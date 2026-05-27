<?php
function handleUploads(): void {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') { methodNotAllowed(); }
    requireAuth();

    if (empty($_FILES['file'])) {
        jsonOut(['error' => 'No file uploaded'], 400);
    }

    $file = $_FILES['file'];
    if ($file['error'] !== UPLOAD_ERR_OK) {
        jsonOut(['error' => 'Upload error', 'code' => $file['error']], 400);
    }

    // Límite de tamaño: 10 MB
    if ($file['size'] > 10 * 1024 * 1024) {
        jsonOut(['error' => 'File too large. Maximum 10 MB'], 400);
    }

    // ── MIME detection desde magic bytes (no confiar en Content-Type del cliente) ──
    $mime = mime_content_type($file['tmp_name']);

    // Mapa canónico MIME → extensión segura.
    // La extensión se deriva SOLO del MIME real, nunca del nombre de fichero del cliente.
    $mimeToExt = [
        'image/jpeg'      => 'jpg',
        'image/png'       => 'png',
        'image/gif'       => 'gif',
        'image/webp'      => 'webp',
        'application/pdf' => 'pdf',
    ];

    if (!isset($mimeToExt[$mime])) {
        jsonOut(['error' => 'File type not allowed. Allowed: JPEG, PNG, GIF, WebP, PDF'], 400);
    }

    $ext  = $mimeToExt[$mime];
    $type = ($ext === 'pdf') ? 'document' : 'image';

    // ── Validación adicional de contenido para imágenes ──────────────────────────
    // getimagesize() verifica que el fichero es una imagen válida y rechaza
    // polimórficos PHP que solo tienen magic bytes JPEG al principio.
    if ($type === 'image') {
        $imgInfo = @getimagesize($file['tmp_name']);
        if ($imgInfo === false) {
            jsonOut(['error' => 'Invalid image file'], 400);
        }
        // Verificar coherencia entre MIME declarado y MIME real de la imagen
        $imgMime = $imgInfo['mime'] ?? '';
        if ($imgMime !== $mime) {
            jsonOut(['error' => 'MIME mismatch: file content does not match declared type'], 400);
        }
    }

    if (!is_dir(UPLOADS_DIR)) {
        mkdir(UPLOADS_DIR, 0755, true);
        // Proteger el directorio de uploads de ejecución PHP
        $htaccess = UPLOADS_DIR . '.htaccess';
        if (!file_exists($htaccess)) {
            file_put_contents($htaccess,
                "# Bloquear ejecución de scripts en uploads\n" .
                "<FilesMatch \"\\.php[0-9]?\$\">\n" .
                "    Require all denied\n" .
                "</FilesMatch>\n" .
                "<FilesMatch \"\\.phtml\$\">\n" .
                "    Require all denied\n" .
                "</FilesMatch>\n" .
                "Options -ExecCGI\n" .
                "AddType text/plain .php .php3 .php4 .php5 .php7 .phtml .phar\n"
            );
        }
    }

    // Nombre final: UUID + extensión derivada del MIME (nunca del cliente)
    $filename = uuid() . '.' . $ext;
    $dest     = UPLOADS_DIR . $filename;

    if (!move_uploaded_file($file['tmp_name'], $dest)) {
        jsonOut(['error' => 'Failed to save file'], 500);
    }

    jsonOut(['data' => ['url' => UPLOADS_URL . $filename, 'type' => $type]], 201);
}
