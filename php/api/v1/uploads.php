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

    $allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    $mime    = mime_content_type($file['tmp_name']);
    if (!in_array($mime, $allowed, true)) {
        jsonOut(['error' => 'File type not allowed'], 400);
    }

    if (!is_dir(UPLOADS_DIR)) {
        mkdir(UPLOADS_DIR, 0755, true);
    }

    $ext      = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uuid() . ($ext ? '.' . strtolower($ext) : '');
    $dest     = UPLOADS_DIR . $filename;

    if (!move_uploaded_file($file['tmp_name'], $dest)) {
        jsonOut(['error' => 'Failed to save file'], 500);
    }

    $type = strpos($mime, 'image/') === 0 ? 'image' : 'document';
    jsonOut(['data' => ['url' => UPLOADS_URL . $filename, 'type' => $type]], 201);
}
