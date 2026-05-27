<?php
function handleAuth(array $parts): void {
    $method = $_SERVER['REQUEST_METHOD'];
    $action = $parts[1] ?? null;

    // login: público
    if ($action === 'login' && $method === 'POST') { authLogin(); return; }

    // create-user: sólo admins autenticados pueden crear nuevas cuentas
    if ($action === 'create-user' && $method === 'POST') {
        requireAuth();
        authCreateUser();
        return;
    }

    // El endpoint /register público ha sido eliminado por seguridad.
    // Para crear el primer admin usa la migración SQL 020_users.sql.
    notFound('Auth endpoint not found');
}

function authLogin(): void {
    $b        = body();
    $email    = trim($b['email']    ?? '');
    $password =      $b['password'] ?? '';

    // Validación de longitud antes de tocar la BD
    if (!$email || !$password) {
        jsonOut(['error' => 'MISSING_FIELDS', 'message' => 'email y password son requeridos'], 400);
    }
    if (strlen($email) > 254) {
        jsonOut(['error' => 'INPUT_TOO_LONG', 'message' => 'email demasiado largo'], 400);
    }
    if (strlen($password) > 1024) {
        jsonOut(['error' => 'INPUT_TOO_LONG', 'message' => 'password demasiado largo'], 400);
    }

    $db   = getDb();
    $stmt = $db->prepare('SELECT * FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    // Respuesta genérica — no revelar si el email existe o no
    if (!$user || !password_verify($password, $user['password_hash'])) {
        jsonOut(['error' => 'INVALID_CREDENTIALS', 'message' => 'Credenciales inválidas'], 401);
    }

    $token = createJwt(['sub' => $user['id'], 'email' => $user['email'], 'role' => $user['role']]);
    jsonOut(['token' => $token, 'user' => ['id' => $user['id'], 'email' => $user['email'], 'role' => $user['role']]]);
}

/**
 * Crea un nuevo usuario. Solo accesible para admins autenticados.
 * El rol por defecto es 'admin'; se puede pasar 'role' en el body.
 */
function authCreateUser(): void {
    $b        = body();
    $email    = trim($b['email']    ?? '');
    $password =      $b['password'] ?? '';
    $role     =      $b['role']     ?? 'admin';

    if (!$email || !$password) {
        jsonOut(['error' => 'MISSING_FIELDS', 'message' => 'email y password son requeridos'], 400);
    }
    if (strlen($email) > 254) {
        jsonOut(['error' => 'INPUT_TOO_LONG', 'message' => 'email demasiado largo'], 400);
    }
    if (strlen($password) > 1024) {
        jsonOut(['error' => 'INPUT_TOO_LONG', 'message' => 'password demasiado largo'], 400);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        jsonOut(['error' => 'INVALID_EMAIL', 'message' => 'Dirección de email inválida'], 400);
    }
    if (strlen($password) < 10) {
        jsonOut(['error' => 'WEAK_PASSWORD', 'message' => 'La contraseña debe tener al menos 10 caracteres'], 400);
    }
    // Solo roles permitidos
    $allowedRoles = ['admin', 'editor', 'viewer'];
    if (!in_array($role, $allowedRoles, true)) {
        jsonOut(['error' => 'INVALID_ROLE', 'message' => 'Rol no válido. Permitidos: admin, editor, viewer'], 400);
    }

    $db   = getDb();
    $stmt = $db->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        jsonOut(['error' => 'EMAIL_TAKEN', 'message' => 'Email ya registrado'], 409);
    }

    $id   = uuid();
    $hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
    $db->prepare('INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)')->execute([$id, $email, $hash, $role]);

    jsonOut(['user' => ['id' => $id, 'email' => $email, 'role' => $role]], 201);
}

function createJwt(array $claims): string {
    $header  = base64url_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $claims['iat'] = time();
    $claims['exp'] = time() + 86400; // 24h
    $payload   = base64url_encode(json_encode($claims));
    $signature = base64url_encode(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));
    return "$header.$payload.$signature";
}
