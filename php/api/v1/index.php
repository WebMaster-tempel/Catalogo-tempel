<?php
require_once __DIR__ . '/config.php';

// ─── CORS seguro: solo orígenes de la whitelist ───────────────────────────────
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, ALLOWED_ORIGINS, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
} else {
    // Origen no permitido: no emitir cabecera ACAO → el browser bloqueará.
    // No devolver 403 para evitar information leakage sobre qué orígenes existen.
}

header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-API-Key, Authorization');
header('Access-Control-Max-Age: 3600');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// config.php ya cargado al inicio (necesario para ALLOWED_ORIGINS)
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';

// Parse path — strip /api/v1 prefix
$uri  = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = preg_replace('#^.*?/api/v1#', '', $uri);
$path = rtrim($path, '/');
$parts = array_values(array_filter(explode('/', ltrim($path, '/'))));

$resource = $parts[0] ?? '';

switch ($resource) {
    case 'products':
        require_once __DIR__ . '/products.php';
        handleProducts($parts);
        break;
    case 'categories':
        require_once __DIR__ . '/categories.php';
        handleCategories($parts);
        break;
    case 'product-types':
        require_once __DIR__ . '/product-types.php';
        handleProductTypes($parts);
        break;
    case 'attributes':
        require_once __DIR__ . '/attributes.php';
        handleAttributes($parts);
        break;
    case 'uploads':
        require_once __DIR__ . '/uploads.php';
        handleUploads();
        break;
    case 'auth':
        require_once __DIR__ . '/auth.php';
        handleAuth($parts);
        break;
    case '':
        jsonOut(['name' => 'Product Catalog API', 'version' => '1.0.0']);
        break;
    default:
        notFound('Endpoint not found');
}
