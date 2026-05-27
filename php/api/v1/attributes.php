<?php
function handleAttributes(array $parts): void {
    $method = $_SERVER['REQUEST_METHOD'];
    $id     = $parts[1] ?? null;

    if ($id === null) {
        if ($method === 'GET')  { listAttributes(); return; }
        if ($method === 'POST') { requireAuth(); createAttribute(); return; }
        methodNotAllowed();
    } elseif ($id === 'filterable') {
        if ($method === 'GET') { getFilterableAttributes(); return; }
        methodNotAllowed();
    } else {
        if ($method === 'GET')    { getAttribute($id); return; }
        if ($method === 'DELETE') { requireAuth(); deleteAttribute($id); return; }
        methodNotAllowed();
    }
}

function listAttributes(): void {
    $db   = getDb();
    $stmt = $db->query('SELECT * FROM attributes ORDER BY name ASC');
    jsonOut(['data' => $stmt->fetchAll()]);
}

function getFilterableAttributes(): void {
    $db   = getDb();
    $stmt = $db->query('SELECT * FROM attributes WHERE is_filterable = 1 ORDER BY name ASC');
    jsonOut(['data' => $stmt->fetchAll()]);
}

function getAttribute(string $id): void {
    $db   = getDb();
    $stmt = $db->prepare('SELECT * FROM attributes WHERE id = ?');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) { notFound('Attribute not found'); }
    jsonOut(['data' => $row]);
}

function createAttribute(): void {
    $db  = getDb();
    $b   = body();
    $id  = uuid();
    $now = date('Y-m-d H:i:s');

    // ── Validación ────────────────────────────────────────────────────────────
    $name      = $b['name']      ?? '';
    $label     = $b['label']     ?? '';
    $data_type = $b['data_type'] ?? 'string';
    if (!$name || !$label) { jsonOut(['error' => 'MISSING_FIELDS', 'message' => 'name y label son requeridos'], 400); }
    validateStr($name,            'name',      100, 1);
    validateStr($label,           'label',     255, 1);
    validateStr($b['unit'] ?? '', 'unit',       50);
    validateEnum($data_type, 'data_type', ['string', 'number', 'boolean', 'date']);

    $db->prepare(
        'INSERT INTO attributes (id, name, label, data_type, unit, is_filterable, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    )->execute([
        $id,
        $name,
        $label,
        $data_type,
        $b['unit']          ?? null,
        (int)($b['is_filterable'] ?? 0),
        $now, $now,
    ]);
    getAttribute($id);
}

function deleteAttribute(string $id): void {
    $db   = getDb();
    $stmt = $db->prepare('DELETE FROM attributes WHERE id = ?');
    $stmt->execute([$id]);
    if ($stmt->rowCount() === 0) { notFound('Attribute not found'); }
    jsonOut(null, 204);
}
