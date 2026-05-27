<?php
function jsonOut($data, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function getAuthorizationHeader(): string {
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        return $_SERVER['HTTP_AUTHORIZATION'];
    }
    // Apache may strip Authorization header; try apache_request_headers() as fallback
    if (function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        return $headers['Authorization'] ?? $headers['authorization'] ?? '';
    }
    return '';
}

function base64url_decode(string $data): string {
    $padded = str_pad(strtr($data, '-_', '+/'), strlen($data) + (4 - strlen($data) % 4) % 4, '=');
    return base64_decode($padded);
}

function base64url_encode(string $data): string {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function verifyJwt(string $token): bool {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return false;

    [$header, $payload, $signature] = $parts;

    $expectedSig = base64url_encode(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));
    if (!hash_equals($expectedSig, $signature)) return false;

    $claims = json_decode(base64url_decode($payload), true);
    if (!is_array($claims)) return false;
    if (isset($claims['exp']) && $claims['exp'] < time()) return false;

    return true;
}

function requireAuth(): void {
    $authHeader = getAuthorizationHeader();

    // JWT Bearer token (admin panel)
    if (strpos($authHeader, 'Bearer ') === 0) {
        $token = substr($authHeader, 7);
        if (verifyJwt($token)) return;
        jsonOut(['error' => 'Unauthorized', 'message' => 'Invalid or expired token'], 401);
    }

    // Fallback: API key (WordPress plugin backward compat)
    $key = $_SERVER['HTTP_X_API_KEY'] ?? '';
    if ($key !== '' && $key === API_KEY) return;

    jsonOut(['error' => 'Unauthorized', 'message' => 'Authentication required'], 401);
}

/**
 * UUID v4 criptográficamente seguro usando random_bytes().
 * Sustituye la versión anterior que usaba mt_rand() (no segura).
 */
function uuid(): string {
    $data    = random_bytes(16);
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40); // versión 4
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80); // variante RFC 4122
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

function body(): array {
    return json_decode(file_get_contents('php://input'), true) ?? [];
}

/**
 * Valida longitud de un string. Termina con 400 si no cumple.
 *
 * @param string $value   Valor a validar
 * @param string $field   Nombre del campo (para el mensaje de error)
 * @param int    $max     Longitud máxima en bytes
 * @param int    $min     Longitud mínima en bytes (0 = opcional)
 */
function validateStr(string $value, string $field, int $max, int $min = 0): void {
    $len = strlen($value);
    if ($min > 0 && $len < $min) {
        jsonOut(['error' => 'INPUT_TOO_SHORT',
                 'message' => "$field debe tener al menos $min caracteres"], 400);
    }
    if ($len > $max) {
        jsonOut(['error' => 'INPUT_TOO_LONG',
                 'message' => "$field no puede superar $max caracteres"], 400);
    }
}

/**
 * Valida que un valor numérico esté dentro de rango.
 *
 * @param mixed  $value
 * @param string $field
 * @param float  $min
 * @param float  $max
 */
function validateNum($value, string $field, float $min = 0, float $max = PHP_INT_MAX): void {
    $v = (float)$value;
    if ($v < $min || $v > $max) {
        jsonOut(['error' => 'VALUE_OUT_OF_RANGE',
                 'message' => "$field debe estar entre $min y $max"], 400);
    }
}

/**
 * Valida que un string pertenezca a una lista de valores permitidos.
 */
function validateEnum(string $value, string $field, array $allowed): void {
    if (!in_array($value, $allowed, true)) {
        $list = implode(', ', $allowed);
        jsonOut(['error' => 'INVALID_VALUE',
                 'message' => "$field debe ser uno de: $list"], 400);
    }
}

function notFound(string $msg = 'Not found'): void {
    jsonOut(['error' => 'NOT_FOUND', 'message' => $msg], 404);
}

function methodNotAllowed(): void {
    jsonOut(['error' => 'Method not allowed'], 405);
}

function attachProductRelations(array $row): array {
    $db = getDb();

    $row['attributes_json'] = isset($row['attributes_json'])
        ? (is_string($row['attributes_json']) ? json_decode($row['attributes_json'], true) : $row['attributes_json'])
        : [];

    $stmt = $db->prepare(
        'SELECT c.id, c.name, c.slug, c.technology, c.plate_type, c.design_life_years,
                c.cycles, c.capacity_range, c.applications, c.characteristics, c.eurobat, c.description
         FROM categories c
         JOIN product_categories pc ON c.id = pc.category_id
         WHERE pc.product_id = ?'
    );
    $stmt->execute([$row['id']]);
    $row['categories'] = $stmt->fetchAll();

    $stmt = $db->prepare(
        'SELECT id, type, url, title, `order` FROM media WHERE product_id = ? ORDER BY `order` ASC'
    );
    $stmt->execute([$row['id']]);
    $row['media'] = $stmt->fetchAll();

    return $row;
}
