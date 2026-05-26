<?php
function handleProductTypes(array $parts): void {
    $method = $_SERVER['REQUEST_METHOD'];
    $id     = $parts[1] ?? null;
    $sub    = $parts[2] ?? null;   // 'attributes'
    $attrId = $parts[3] ?? null;

    if ($id === null) {
        if ($method === 'GET')  { listProductTypes(); return; }
        if ($method === 'POST') { requireAuth(); createProductType(); return; }
        methodNotAllowed();
    } elseif ($sub === null) {
        if ($method === 'GET')    { getProductType($id); return; }
        if ($method === 'DELETE') { requireAuth(); deleteProductType($id); return; }
        methodNotAllowed();
    } elseif ($sub === 'attributes') {
        if ($attrId === null) {
            if ($method === 'POST') { requireAuth(); assignAttribute($id); return; }
            methodNotAllowed();
        } else {
            if ($method === 'DELETE') { requireAuth(); removeAttribute($id, $attrId); return; }
            methodNotAllowed();
        }
    }
    notFound();
}

function listProductTypes(): void {
    $db   = getDb();
    $stmt = $db->query('SELECT * FROM product_types ORDER BY name ASC');
    jsonOut(['data' => $stmt->fetchAll()]);
}

function getProductType(string $id): void {
    $db   = getDb();
    $stmt = $db->prepare('SELECT * FROM product_types WHERE id = ?');
    $stmt->execute([$id]);
    $pt = $stmt->fetch();
    if (!$pt) { notFound('Product type not found'); }

    $stmt = $db->prepare(
        'SELECT a.*, pta.is_required, pta.`order`
         FROM attributes a
         JOIN product_type_attributes pta ON a.id = pta.attribute_id
         WHERE pta.product_type_id = ?
         ORDER BY pta.`order` ASC'
    );
    $stmt->execute([$id]);
    $pt['attributes'] = $stmt->fetchAll();
    jsonOut(['data' => $pt]);
}

function createProductType(): void {
    $db  = getDb();
    $b   = body();
    $id  = uuid();
    $now = date('Y-m-d H:i:s');
    $db->prepare(
        'INSERT INTO product_types (id, name, slug, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
    )->execute([$id, $b['name'] ?? '', $b['slug'] ?? '', $b['description'] ?? null, $now, $now]);
    getProductType($id);
}

function deleteProductType(string $id): void {
    $db   = getDb();
    $stmt = $db->prepare('DELETE FROM product_types WHERE id = ?');
    $stmt->execute([$id]);
    if ($stmt->rowCount() === 0) { notFound('Product type not found'); }
    jsonOut(null, 204);
}

function assignAttribute(string $typeId): void {
    $db  = getDb();
    $b   = body();
    $db->prepare(
        'INSERT INTO product_type_attributes (product_type_id, attribute_id, is_required, `order`)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE is_required = VALUES(is_required), `order` = VALUES(`order`)'
    )->execute([$typeId, $b['attribute_id'], (int)($b['is_required'] ?? 0), $b['order'] ?? 0]);
    jsonOut(['data' => ['success' => true]], 201);
}

function removeAttribute(string $typeId, string $attrId): void {
    $db   = getDb();
    $stmt = $db->prepare('DELETE FROM product_type_attributes WHERE product_type_id = ? AND attribute_id = ?');
    $stmt->execute([$typeId, $attrId]);
    if ($stmt->rowCount() === 0) { notFound('Attribute assignment not found'); }
    jsonOut(null, 204);
}
