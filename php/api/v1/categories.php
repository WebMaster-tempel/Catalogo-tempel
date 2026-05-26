<?php
function handleCategories(array $parts): void {
    $method    = $_SERVER['REQUEST_METHOD'];
    $id        = $parts[1] ?? null;
    $sub       = $parts[2] ?? null;   // 'children', 'features'
    $subId     = $parts[3] ?? null;   // featureId or 'reorder'

    if ($id === null) {
        if ($method === 'GET')  { listCategories(); return; }
        if ($method === 'POST') { requireAuth(); createCategory(); return; }
        methodNotAllowed();
    } elseif ($id === 'tree' && $sub === null) {
        if ($method === 'GET') { getCategoryTree(); return; }
        methodNotAllowed();
    } elseif ($sub === null) {
        if ($method === 'GET')    { getCategory($id); return; }
        if ($method === 'PATCH')  { requireAuth(); updateCategory($id); return; }
        if ($method === 'DELETE') { requireAuth(); deleteCategory($id); return; }
        methodNotAllowed();
    } elseif ($sub === 'children') {
        if ($method === 'GET') { getChildCategories($id); return; }
        methodNotAllowed();
    } elseif ($sub === 'features') {
        if ($subId === null) {
            if ($method === 'GET')  { getFeatures($id); return; }
            if ($method === 'POST') { requireAuth(); createFeature($id); return; }
            methodNotAllowed();
        } elseif ($subId === 'reorder') {
            if ($method === 'POST') { requireAuth(); reorderFeatures($id); return; }
            methodNotAllowed();
        } else {
            if ($method === 'PATCH')  { requireAuth(); updateFeature($subId); return; }
            if ($method === 'DELETE') { requireAuth(); deleteFeature($subId); return; }
            methodNotAllowed();
        }
    }
    notFound();
}

// ─── CATEGORIES ──────────────────────────────────────────────────────────────
function listCategories(): void {
    $db   = getDb();
    $stmt = $db->query('SELECT * FROM categories ORDER BY name ASC');
    jsonOut(['data' => $stmt->fetchAll()]);
}

function getCategoryTree(): void {
    $db   = getDb();
    $stmt = $db->query(
        'WITH RECURSIVE category_tree AS (
           SELECT id, name, slug, parent_id, 0 as level
           FROM categories WHERE parent_id IS NULL
           UNION ALL
           SELECT c.id, c.name, c.slug, c.parent_id, ct.level + 1
           FROM categories c
           JOIN category_tree ct ON c.parent_id = ct.id
         )
         SELECT * FROM category_tree ORDER BY level, name'
    );
    jsonOut(['data' => $stmt->fetchAll()]);
}

function getCategory(string $id): void {
    $db   = getDb();
    $stmt = $db->prepare('SELECT * FROM categories WHERE id = ?');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) { notFound('Category not found'); }
    jsonOut(['data' => $row]);
}

function getChildCategories(string $id): void {
    $db   = getDb();
    $stmt = $db->prepare('SELECT * FROM categories WHERE parent_id = ? ORDER BY name');
    $stmt->execute([$id]);
    jsonOut(['data' => $stmt->fetchAll()]);
}

function createCategory(): void {
    $db  = getDb();
    $b   = body();
    $id  = uuid();
    $now = date('Y-m-d H:i:s');
    $db->prepare(
        'INSERT INTO categories (id, name, slug, parent_id, description, technology, plate_type,
         design_life_years, cycles, capacity_range, applications, characteristics, eurobat, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    )->execute([
        $id,
        $b['name']              ?? '',
        $b['slug']              ?? '',
        $b['parent_id']         ?? null,
        $b['description']       ?? null,
        $b['technology']        ?? null,
        $b['plate_type']        ?? null,
        $b['design_life_years'] ?? null,
        $b['cycles']            ?? null,
        $b['capacity_range']    ?? null,
        $b['applications']      ?? null,
        $b['characteristics']   ?? null,
        isset($b['eurobat']) ? (int)$b['eurobat'] : 0,
        $now, $now,
    ]);
    getCategory($id);
}

function updateCategory(string $id): void {
    $db = getDb();
    $b  = body();
    $allowed = ['name','slug','parent_id','description','technology','plate_type',
                'design_life_years','cycles','capacity_range','applications',
                'characteristics','eurobat'];
    $fields = [];
    $values = [];
    foreach ($allowed as $f) {
        if (array_key_exists($f, $b)) {
            $fields[] = "`$f` = ?";
            $values[] = $f === 'eurobat' ? (int)$b[$f] : $b[$f];
        }
    }
    if ($fields) {
        $fields[] = 'updated_at = ?';
        $values[] = date('Y-m-d H:i:s');
        $values[] = $id;
        $db->prepare('UPDATE categories SET ' . implode(', ', $fields) . ' WHERE id = ?')->execute($values);
    }
    getCategory($id);
}

function deleteCategory(string $id): void {
    $db   = getDb();
    $stmt = $db->prepare('DELETE FROM categories WHERE id = ?');
    $stmt->execute([$id]);
    if ($stmt->rowCount() === 0) { notFound('Category not found'); }
    jsonOut(null, 204);
}

// ─── FEATURES ────────────────────────────────────────────────────────────────
function getFeatures(string $categoryId): void {
    $db = getDb();
    if (!empty($_GET['type'])) {
        $stmt = $db->prepare(
            'SELECT * FROM category_features WHERE category_id = ? AND type = ? ORDER BY `order` ASC'
        );
        $stmt->execute([$categoryId, $_GET['type']]);
    } else {
        $stmt = $db->prepare(
            'SELECT * FROM category_features WHERE category_id = ? ORDER BY `order` ASC'
        );
        $stmt->execute([$categoryId]);
    }
    jsonOut(['data' => $stmt->fetchAll()]);
}

function createFeature(string $categoryId): void {
    $db  = getDb();
    $b   = body();
    $id  = uuid();
    $db->prepare(
        'INSERT INTO category_features (id, category_id, type, label, `order`) VALUES (?, ?, ?, ?, ?)'
    )->execute([$id, $categoryId, $b['type'] ?? '', $b['label'] ?? '', $b['order'] ?? 0]);
    $stmt = $db->prepare('SELECT * FROM category_features WHERE id = ?');
    $stmt->execute([$id]);
    jsonOut(['data' => $stmt->fetch()], 201);
}

function updateFeature(string $featureId): void {
    $db = getDb();
    $b  = body();
    $fields = [];
    $values = [];
    foreach (['label', 'type', 'order'] as $f) {
        if (array_key_exists($f, $b)) {
            $fields[] = "`$f` = ?";
            $values[] = $b[$f];
        }
    }
    if ($fields) {
        $values[] = $featureId;
        $db->prepare('UPDATE category_features SET ' . implode(', ', $fields) . ' WHERE id = ?')->execute($values);
    }
    $stmt = $db->prepare('SELECT * FROM category_features WHERE id = ?');
    $stmt->execute([$featureId]);
    jsonOut(['data' => $stmt->fetch()]);
}

function deleteFeature(string $featureId): void {
    $db   = getDb();
    $stmt = $db->prepare('DELETE FROM category_features WHERE id = ?');
    $stmt->execute([$featureId]);
    if ($stmt->rowCount() === 0) { notFound('Feature not found'); }
    jsonOut(null, 204);
}

function reorderFeatures(string $categoryId): void {
    $db         = getDb();
    $featureIds = body()['featureIds'] ?? [];
    $upd        = $db->prepare('UPDATE category_features SET `order` = ? WHERE id = ? AND category_id = ?');
    foreach ($featureIds as $i => $fid) {
        $upd->execute([$i + 1, $fid, $categoryId]);
    }
    jsonOut(['data' => ['success' => true]]);
}
