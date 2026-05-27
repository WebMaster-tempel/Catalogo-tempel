<?php
function handleProducts(array $parts): void {
    $method = $_SERVER['REQUEST_METHOD'];
    $id    = $parts[1] ?? null;
    $sub   = $parts[2] ?? null;   // 'media'
    $subId = $parts[3] ?? null;

    if ($id === null) {
        if ($method === 'GET')  { listProducts(); return; }
        if ($method === 'POST') { requireAuth(); createProduct(); return; }
        methodNotAllowed();
    } elseif ($sub === null) {
        if ($method === 'GET')    { getProduct($id); return; }
        if ($method === 'PATCH')  { requireAuth(); updateProduct($id); return; }
        if ($method === 'DELETE') { requireAuth(); deleteProduct($id); return; }
        methodNotAllowed();
    } elseif ($sub === 'media') {
        if ($subId === null) {
            if ($method === 'GET')  { getProductMedia($id); return; }
            if ($method === 'POST') { requireAuth(); addMedia($id); return; }
            methodNotAllowed();
        } else {
            if ($method === 'DELETE') { requireAuth(); deleteMedia($subId); return; }
            methodNotAllowed();
        }
    }
    notFound();
}

// ─── LIST ────────────────────────────────────────────────────────────────────
function listProducts(): void {
    $db      = getDb();
    $page    = max(1, (int)($_GET['page']     ?? 1));
    $perPage = min(200, max(1, (int)($_GET['per_page'] ?? 20)));
    $offset  = ($page - 1) * $perPage;

    $where  = [];
    $params = [];

    if (!empty($_GET['search'])) {
        $s = '%' . $_GET['search'] . '%';
        $where[]  = '(p.name LIKE ? OR p.description LIKE ? OR c.name LIKE ? OR c.applications LIKE ? OR c.characteristics LIKE ? OR c.description LIKE ?)';
        $params   = array_merge($params, [$s, $s, $s, $s, $s, $s]);
    }
    if (!empty($_GET['application']))    { $where[] = 'c.applications LIKE ?';  $params[] = '%' . $_GET['application']    . '%'; }
    if (!empty($_GET['technology']))     { $where[] = 'c.technology LIKE ?';     $params[] = '%' . $_GET['technology']     . '%'; }
    if (!empty($_GET['plate_type']))     { $where[] = 'c.plate_type LIKE ?';     $params[] = '%' . $_GET['plate_type']     . '%'; }
    if (isset($_GET['eurobat']))         { $where[] = 'c.eurobat = ?';           $params[] = (int)$_GET['eurobat']; }
    if (!empty($_GET['capacity_range'])) { $where[] = 'c.capacity_range LIKE ?'; $params[] = '%' . $_GET['capacity_range'] . '%'; }
    if (!empty($_GET['characteristics'])){ $where[] = 'c.characteristics LIKE ?';$params[] = '%' . $_GET['characteristics']. '%'; }
    if (!empty($_GET['product_type_id'])){ $where[] = 'p.product_type_id = ?';   $params[] = $_GET['product_type_id']; }
    if (!empty($_GET['status']))         { $where[] = 'p.status = ?';            $params[] = $_GET['status']; }
    if (!empty($_GET['category_id']))    { $where[] = 'pc.category_id = ?';      $params[] = $_GET['category_id']; }
    if (isset($_GET['capacity_min']))    { $where[] = 'CAST(JSON_UNQUOTE(JSON_EXTRACT(pav.attributes_json,"$.capacity")) AS DECIMAL) >= ?'; $params[] = (float)$_GET['capacity_min']; }
    if (isset($_GET['capacity_max']))    { $where[] = 'CAST(JSON_UNQUOTE(JSON_EXTRACT(pav.attributes_json,"$.capacity")) AS DECIMAL) <= ?'; $params[] = (float)$_GET['capacity_max']; }
    if (isset($_GET['voltage']))         { $where[] = 'CAST(JSON_UNQUOTE(JSON_EXTRACT(pav.attributes_json,"$.voltage"))  AS DECIMAL) = ?';  $params[] = (float)$_GET['voltage']; }

    $whereSQL = $where ? 'WHERE ' . implode(' AND ', $where) : '';

    $countStmt = $db->prepare(
        "SELECT COUNT(DISTINCT p.id) as total
         FROM products p
         LEFT JOIN product_attribute_values pav ON p.id = pav.product_id
         LEFT JOIN product_categories pc ON p.id = pc.product_id
         LEFT JOIN categories c ON pc.category_id = c.id
         $whereSQL"
    );
    $countStmt->execute($params);
    $total = (int)$countStmt->fetchColumn();

    $stmt = $db->prepare(
        "SELECT p.*, pav.attributes_json
         FROM products p
         LEFT JOIN product_attribute_values pav ON p.id = pav.product_id
         LEFT JOIN product_categories pc ON p.id = pc.product_id
         LEFT JOIN categories c ON pc.category_id = c.id
         $whereSQL
         GROUP BY p.id
         ORDER BY p.name ASC
         LIMIT $perPage OFFSET $offset"
    );
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    $data = array_map('attachProductRelations', $rows);

    jsonOut([
        'data' => $data,
        'meta' => ['pagination' => [
            'page'        => $page,
            'per_page'    => $perPage,
            'total'       => $total,
            'total_pages' => (int)ceil($total / $perPage),
        ]],
    ]);
}

// ─── GET ONE ─────────────────────────────────────────────────────────────────
function getProduct(string $id): void {
    $db   = getDb();
    $stmt = $db->prepare(
        'SELECT p.*, pav.attributes_json
         FROM products p
         LEFT JOIN product_attribute_values pav ON p.id = pav.product_id
         WHERE p.id = ?'
    );
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) { notFound('Product not found'); }
    jsonOut(['data' => attachProductRelations($row)]);
}

// ─── CREATE ──────────────────────────────────────────────────────────────────
function createProduct(): void {
    $db   = getDb();
    $b    = body();
    $id   = uuid();
    $now  = date('Y-m-d H:i:s');

    // ── Validación de campos ──────────────────────────────────────────────────
    $name   = $b['name']   ?? '';
    $slug   = $b['slug']   ?? '';
    $status = $b['status'] ?? 'draft';
    if (!$name) { jsonOut(['error' => 'MISSING_FIELDS', 'message' => 'name es requerido'], 400); }
    validateStr($name,                     'name',        255, 1);
    validateStr($slug,                     'slug',        255, 1);
    validateStr($b['description'] ?? '',   'description', 10000);
    validateEnum($status, 'status', ['draft', 'published', 'archived']);

    $stmt = $db->prepare(
        'INSERT INTO products (id, name, slug, description, product_type_id, status, main_image_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $id,
        $name,
        $slug,
        $b['description']     ?? null,
        $b['product_type_id'] ?? null,
        $status,
        $b['main_image_id']   ?? null,
        $now, $now,
    ]);

    // Attributes
    if (!empty($b['attributes'])) {
        $db->prepare(
            'INSERT INTO product_attribute_values (id, product_id, attributes_json) VALUES (?, ?, ?)'
        )->execute([uuid(), $id, json_encode($b['attributes'])]);
    }

    // Categories
    if (!empty($b['category_ids'])) {
        $ins = $db->prepare('INSERT IGNORE INTO product_categories (product_id, category_id) VALUES (?, ?)');
        foreach ($b['category_ids'] as $catId) {
            $ins->execute([$id, $catId]);
        }
    }

    getProduct($id);
}

// ─── UPDATE ──────────────────────────────────────────────────────────────────
function updateProduct(string $id): void {
    $db = getDb();
    $b  = body();

    // ── Validación de campos presentes ────────────────────────────────────────
    if (array_key_exists('name',        $b)) validateStr($b['name'],        'name',        255, 1);
    if (array_key_exists('slug',        $b)) validateStr($b['slug'],        'slug',        255, 1);
    if (array_key_exists('description', $b)) validateStr($b['description'] ?? '', 'description', 10000);
    if (array_key_exists('status',      $b)) validateEnum($b['status'], 'status', ['draft', 'published', 'archived']);

    $fields = [];
    $values = [];
    $allowed = ['name', 'slug', 'description', 'product_type_id', 'status', 'main_image_id'];
    foreach ($allowed as $f) {
        if (array_key_exists($f, $b)) {
            $fields[] = "`$f` = ?";
            $values[] = $b[$f];
        }
    }
    if ($fields) {
        $fields[] = 'updated_at = ?';
        $values[] = date('Y-m-d H:i:s');
        $values[] = $id;
        $db->prepare('UPDATE products SET ' . implode(', ', $fields) . ' WHERE id = ?')->execute($values);
    }

    // Attributes (upsert)
    if (!empty($b['attributes'])) {
        $db->prepare(
            'INSERT INTO product_attribute_values (id, product_id, attributes_json) VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE attributes_json = VALUES(attributes_json)'
        )->execute([uuid(), $id, json_encode($b['attributes'])]);
    }

    // Categories (replace)
    if (isset($b['category_ids'])) {
        $db->prepare('DELETE FROM product_categories WHERE product_id = ?')->execute([$id]);
        $ins = $db->prepare('INSERT IGNORE INTO product_categories (product_id, category_id) VALUES (?, ?)');
        foreach ($b['category_ids'] as $catId) {
            $ins->execute([$id, $catId]);
        }
    }

    getProduct($id);
}

// ─── DELETE ──────────────────────────────────────────────────────────────────
function deleteProduct(string $id): void {
    $db   = getDb();
    $stmt = $db->prepare('DELETE FROM products WHERE id = ?');
    $stmt->execute([$id]);
    if ($stmt->rowCount() === 0) { notFound('Product not found'); }
    jsonOut(null, 204);
}

// ─── MEDIA ───────────────────────────────────────────────────────────────────
function getProductMedia(string $id): void {
    $db   = getDb();
    $stmt = $db->prepare('SELECT id, type, url, title, `order` FROM media WHERE product_id = ? ORDER BY `order` ASC');
    $stmt->execute([$id]);
    jsonOut(['data' => $stmt->fetchAll()]);
}

function addMedia(string $id): void {
    $db  = getDb();
    $b   = body();
    $mid = uuid();
    $db->prepare(
        'INSERT INTO media (id, product_id, type, url, title, `order`) VALUES (?, ?, ?, ?, ?, ?)'
    )->execute([$mid, $id, $b['type'] ?? 'image', $b['url'] ?? '', $b['title'] ?? null, $b['order'] ?? 0]);
    $stmt = $db->prepare('SELECT id, type, url, title, `order` FROM media WHERE id = ?');
    $stmt->execute([$mid]);
    jsonOut(['data' => $stmt->fetch()], 201);
}

function deleteMedia(string $mediaId): void {
    $db   = getDb();
    $stmt = $db->prepare('DELETE FROM media WHERE id = ?');
    $stmt->execute([$mediaId]);
    if ($stmt->rowCount() === 0) { notFound('Media not found'); }
    jsonOut(null, 204);
}
