<?php
// ─── Edit these values with your server credentials ──────────────────────────
define('DB_HOST',    'localhost');
define('DB_PORT',    3306);
define('DB_NAME',    'catalogo_tg_db_com');       // nombre de la BD en el servidor
define('DB_USER',    'user_ms_db');             // usuario MySQL del servidor
define('DB_PASS',    'Tempel33!');                 // contraseña MySQL del servidor
define('DB_CHARSET', 'utf8mb4');

// Must match VITE_API_KEY used in the React admin build (kept for WordPress plugin compat)
define('API_KEY', 'AIzaSyBTyBWo0WHphelL8Hk1ryb6moPaW8xfjbM');

// Must match JWT_SECRET in Node.js .env
define('JWT_SECRET', getenv('JWT_SECRET') ?: 'ad2205b0b9d050e45f7b1f2301f1ce9d23ce7da70dec216309344c5fea1a08799c20dbc9884cd69b365d57e358bab7e4a5d972e0111ef12d046792751f5f1512');

// Absolute path to uploads folder on the server (two levels up from api/v1/)
define('UPLOADS_DIR', dirname(__DIR__, 2) . '/uploads/');
define('UPLOADS_URL', '/uploads/');

// ─── CORS: orígenes permitidos ────────────────────────────────────────────────
// Añade aquí los dominios exactos desde los que se accede al panel admin y WP.
// NO usar '*' en producción — permite peticiones autenticadas desde cualquier web.
define('ALLOWED_ORIGINS', [
    'https://www.tempelgroup.com',
    'https://tempelgroup.com',
    'https://kaise.es',
    'https://catalogo.tempelgroup.com/',
    'https://desarrollo.tempelgroup.com/'
    // Desarrollo local (eliminar en producción):
    'http://localhost:5173',
    'http://localhost:3000',
]);
