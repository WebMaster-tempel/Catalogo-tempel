<?php
function handleAuth(array $parts): void {
    $method = $_SERVER['REQUEST_METHOD'];
    $action = $parts[1] ?? null;

    if ($action === 'login'    && $method === 'POST') { authLogin();    return; }
    if ($action === 'register' && $method === 'POST') { authRegister(); return; }
    notFound('Auth endpoint not found');
}

function authLogin(): void {
    $b        = body();
    $email    = trim($b['email']    ?? '');
    $password =      $b['password'] ?? '';

    if (!$email || !$password) {
        jsonOut(['error' => 'MISSING_FIELDS', 'message' => 'email and password are required'], 400);
    }

    $db   = getDb();
    $stmt = $db->prepare('SELECT * FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        jsonOut(['error' => 'INVALID_CREDENTIALS', 'message' => 'Invalid credentials'], 401);
    }

    $token = createJwt(['sub' => $user['id'], 'email' => $user['email'], 'role' => $user['role']]);
    jsonOut(['token' => $token, 'user' => ['id' => $user['id'], 'email' => $user['email'], 'role' => $user['role']]]);
}

function authRegister(): void {
    $b        = body();
    $email    = trim($b['email']    ?? '');
    $password =      $b['password'] ?? '';

    if (!$email || !$password) {
        jsonOut(['error' => 'MISSING_FIELDS', 'message' => 'email and password are required'], 400);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        jsonOut(['error' => 'INVALID_EMAIL', 'message' => 'Invalid email address'], 400);
    }
    if (strlen($password) < 8) {
        jsonOut(['error' => 'WEAK_PASSWORD', 'message' => 'Password must be at least 8 characters'], 400);
    }

    $db   = getDb();
    $stmt = $db->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        jsonOut(['error' => 'EMAIL_TAKEN', 'message' => 'Email already registered'], 409);
    }

    $id   = uuid();
    $hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
    $db->prepare('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)')->execute([$id, $email, $hash]);

    $token = createJwt(['sub' => $id, 'email' => $email, 'role' => 'admin']);
    jsonOut(['token' => $token, 'user' => ['id' => $id, 'email' => $email, 'role' => 'admin']], 201);
}

function createJwt(array $claims): string {
    $header  = base64url_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $claims['iat'] = time();
    $claims['exp'] = time() + 86400; // 24h
    $payload   = base64url_encode(json_encode($claims));
    $signature = base64url_encode(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));
    return "$header.$payload.$signature";
}
