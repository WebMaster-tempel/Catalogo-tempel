-- =============================================================================
-- Migration 015: Reorganize category hierarchy
--
-- Changes:
--   1. Create tags + category_tags tables
--   2. Insert tags: Cíclico, Estacionario
--   3. Insert 10 new structural categories (non-leaf nodes)
--   4. Rename "KAISE SOLAR AGM" → "KAISE SOLAR"
--   5. Set parent_id on all existing gammas
--   6. Create KAISE OPzV gamma with 20 products, features and attributes
--   7. Assign tags to all gammas
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 1. TAGS INFRASTRUCTURE
-- -----------------------------------------------------------------------------

CREATE TABLE tags (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name       VARCHAR(100) NOT NULL UNIQUE,
    label      VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE category_tags (
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    tag_id      UUID NOT NULL REFERENCES tags(id)       ON DELETE CASCADE,
    PRIMARY KEY (category_id, tag_id)
);

CREATE INDEX idx_category_tags_tag_id ON category_tags(tag_id);

-- -----------------------------------------------------------------------------
-- 2. INSERT TAGS
-- -----------------------------------------------------------------------------

INSERT INTO tags (id, name, label) VALUES
    ('a15c1e00-2000-4000-8000-000000000001', 'cyclical',   'Cíclico'),
    ('a15c1e00-2000-4000-8000-000000000002', 'stationary', 'Estacionario');

-- -----------------------------------------------------------------------------
-- 3. NEW STRUCTURAL CATEGORIES
-- Inserted in depth order so parent_id FK is always satisfied.
-- -----------------------------------------------------------------------------

-- Level 1 (roots)
INSERT INTO categories (id, name, slug, parent_id) VALUES
    ('a15c1e00-1000-4000-8000-000000000001', 'Litio',       'litio',       NULL),
    ('a15c1e00-1000-4000-8000-000000000003', 'Plomo Ácido', 'plomo-acido', NULL);

-- Level 2
INSERT INTO categories (id, name, slug, parent_id) VALUES
    ('a15c1e00-1000-4000-8000-000000000002', 'LFP',           'lfp',           'a15c1e00-1000-4000-8000-000000000001'),
    ('a15c1e00-1000-4000-8000-000000000004', 'Plomo Carbono', 'plomo-carbono', 'a15c1e00-1000-4000-8000-000000000003'),
    ('a15c1e00-1000-4000-8000-000000000005', 'VRLA',          'vrla',          'a15c1e00-1000-4000-8000-000000000003');

-- Level 3
INSERT INTO categories (id, name, slug, parent_id) VALUES
    ('a15c1e00-1000-4000-8000-000000000006', 'AGM',              'agm',              'a15c1e00-1000-4000-8000-000000000005'),
    ('a15c1e00-1000-4000-8000-000000000008', 'Alta Temperatura', 'alta-temperatura', 'a15c1e00-1000-4000-8000-000000000005'),
    ('a15c1e00-1000-4000-8000-000000000009', 'Gel Puro',         'gel-puro',         'a15c1e00-1000-4000-8000-000000000005'),
    ('a15c1e00-1000-4000-8000-00000000000a', 'Gel Híbrido',      'gel-hibrido',      'a15c1e00-1000-4000-8000-000000000005');

-- Level 4
INSERT INTO categories (id, name, slug, parent_id) VALUES
    ('a15c1e00-1000-4000-8000-000000000007', 'Tracción', 'traccion', 'a15c1e00-1000-4000-8000-000000000006');

-- -----------------------------------------------------------------------------
-- 4. RENAME "KAISE SOLAR AGM" → "KAISE SOLAR"
-- -----------------------------------------------------------------------------

UPDATE categories
    SET name = 'KAISE SOLAR', slug = 'kaise-solar', updated_at = CURRENT_TIMESTAMP
    WHERE id = 'a11c1e00-1000-4000-8000-000000000006';

-- -----------------------------------------------------------------------------
-- 5. SET parent_id ON EXISTING GAMMAS
-- -----------------------------------------------------------------------------

-- Kaise Litio → LFP
UPDATE categories SET parent_id = 'a15c1e00-1000-4000-8000-000000000002', updated_at = CURRENT_TIMESTAMP
    WHERE id = 'a11c1e00-1000-4000-8000-000000000001';

-- Kaise Lead Carbon → Plomo Carbono
UPDATE categories SET parent_id = 'a15c1e00-1000-4000-8000-000000000004', updated_at = CURRENT_TIMESTAMP
    WHERE id = 'a13c1e00-1000-4000-8000-000000000003';

-- Kaise Electric Vehicle → Tracción
UPDATE categories SET parent_id = 'a15c1e00-1000-4000-8000-000000000007', updated_at = CURRENT_TIMESTAMP
    WHERE id = 'a13c1e00-1000-4000-8000-000000000001';

-- AGM gammas (direct children of AGM)
UPDATE categories SET parent_id = 'a15c1e00-1000-4000-8000-000000000006', updated_at = CURRENT_TIMESTAMP
    WHERE id IN (
        'a11c1e00-1000-4000-8000-000000000002',  -- Kaise Standard
        'a11c1e00-1000-4000-8000-000000000003',  -- Kaise Long Life
        'a11c1e00-1000-4000-8000-000000000004',  -- Kaise Ultra Long Life
        'a11c1e00-1000-4000-8000-000000000006',  -- Kaise Solar (renamed)
        'a11c1e00-1000-4000-8000-000000000007',  -- Kaise Deep Cycle
        'a11c1e00-1000-4000-8000-000000000008',  -- Kaise Front Terminal
        'a11c1e00-1000-4000-8000-000000000005',  -- Kaise High Rate
        'a13c1e00-1000-4000-8000-000000000006'   -- Kaise Wind Power
    );

-- Kaise High Temperature → Alta Temperatura
UPDATE categories SET parent_id = 'a15c1e00-1000-4000-8000-000000000008', updated_at = CURRENT_TIMESTAMP
    WHERE id = 'a11c1e00-1000-4000-8000-000000000009';

-- Gel Puro gammas
UPDATE categories SET parent_id = 'a15c1e00-1000-4000-8000-000000000009', updated_at = CURRENT_TIMESTAMP
    WHERE id IN (
        'a13c1e00-1000-4000-8000-000000000004',  -- Kaise Solar Gel
        'a13c1e00-1000-4000-8000-000000000005'   -- Kaise Deep Cycle Gel
    );

-- Kaise Electric Vehicle Tracción stays at parent_id = NULL (pendiente de reorganizar)

-- -----------------------------------------------------------------------------
-- 6. NEW GAMMA: KAISE OPzV (under Gel Puro)
-- -----------------------------------------------------------------------------

INSERT INTO categories (id, name, slug, description, parent_id,
                         technology, plate_type, design_life_years, cycles,
                         capacity_range, applications, eurobat, characteristics)
VALUES (
    'a15c1e00-1000-4000-8000-00000000000b',
    'KAISE OPzV',
    'kaise-opzv',
    'La serie OPzV es una batería de plomo-ácido regulada por válvula que adopta tecnología GEL inmovilizada y placa tubular para una alta fiabilidad y rendimiento. La batería está diseñada y fabricada según los estándares DIN con placa positiva, tubular y fórmula patentada de material activo. La serie OPzV supera los valores estándar DIN con más de 20 años de vida en flotación a 25°C y uso cíclico en condiciones de operación extremas.',
    'a15c1e00-1000-4000-8000-000000000009',
    'VRLA-GEL',
    'Tubular',
    '16 años (12V) / 20 años (2V)',
    NULL,
    '60 – 3000 Ah (C10)',
    'Sistemas de telecomunicaciones, Estaciones de retransmisión de señales telefónicas y de radio, Sistemas de iluminación de emergencia, Centrales eléctricas y energías alternativas (solar, eólica), Grandes UPS''s y backup de ordenador, Señalización ferroviaria, Reserva de energía a bordo de barcos y en tierra, Ingeniería de procesos y control',
    FALSE,
    'Diseño de vida útil de 16 años (serie 12V) y 20 años (serie 2V) a 25°C en operación de flotación continua hasta aproximadamente 80% de la capacidad. Electrolito inmovilizado en gel puro. Baja emisión de gases gracias a la aleación libre de antimonio y la recombinación interna de oxígeno. Se puede suministrar para instalación vertical estándar o bajo pedido especial para instalación horizontal. Cortocircuito interno imposible debido a la estructura del gel. Cumple con las normas IEC, IEEE, UL, EN, CE, etc.'
);

-- -----------------------------------------------------------------------------
-- 7. KAISE OPzV: CATEGORY FEATURES
-- -----------------------------------------------------------------------------

INSERT INTO category_features (id, category_id, type, label, "order") VALUES
    -- Applications (8)
    ('a15c1e00-700b-4000-8000-000000000001', 'a15c1e00-1000-4000-8000-00000000000b', 'application', 'Sistemas de telecomunicaciones', 1),
    ('a15c1e00-700b-4000-8000-000000000002', 'a15c1e00-1000-4000-8000-00000000000b', 'application', 'Estaciones de retransmisión de señales telefónicas y de radio', 2),
    ('a15c1e00-700b-4000-8000-000000000003', 'a15c1e00-1000-4000-8000-00000000000b', 'application', 'Sistemas de iluminación de emergencia', 3),
    ('a15c1e00-700b-4000-8000-000000000004', 'a15c1e00-1000-4000-8000-00000000000b', 'application', 'Centrales eléctricas, centrales convencionales, energías alternativas (solar, eólica)', 4),
    ('a15c1e00-700b-4000-8000-000000000005', 'a15c1e00-1000-4000-8000-00000000000b', 'application', 'Grandes UPS''s y backup de ordenador', 5),
    ('a15c1e00-700b-4000-8000-000000000006', 'a15c1e00-1000-4000-8000-00000000000b', 'application', 'Señalización ferroviaria', 6),
    ('a15c1e00-700b-4000-8000-000000000007', 'a15c1e00-1000-4000-8000-00000000000b', 'application', 'Reserva de energía a bordo de barcos y en tierra', 7),
    ('a15c1e00-700b-4000-8000-000000000008', 'a15c1e00-1000-4000-8000-00000000000b', 'application', 'Ingeniería de procesos y control', 8),
    -- Characteristics (6)
    ('a15c1e00-700b-4000-8000-000000000009', 'a15c1e00-1000-4000-8000-00000000000b', 'characteristic', 'Diseño de vida útil de 16 años (serie 12V) y 20 años (serie 2V) a 25°C en operación de flotación continua hasta aproximadamente 80% de la capacidad', 1),
    ('a15c1e00-700b-4000-8000-00000000000a', 'a15c1e00-1000-4000-8000-00000000000b', 'characteristic', 'Electrolito inmovilizado en gel puro', 2),
    ('a15c1e00-700b-4000-8000-00000000000b', 'a15c1e00-1000-4000-8000-00000000000b', 'characteristic', 'Baja emisión de gases gracias a la aleación libre de antimonio y la recombinación interna de oxígeno', 3),
    ('a15c1e00-700b-4000-8000-00000000000c', 'a15c1e00-1000-4000-8000-00000000000b', 'characteristic', 'Se puede suministrar para instalación vertical estándar o bajo pedido especial para instalación horizontal', 4),
    ('a15c1e00-700b-4000-8000-00000000000d', 'a15c1e00-1000-4000-8000-00000000000b', 'characteristic', 'Cortocircuito interno imposible debido a la estructura del gel', 5),
    ('a15c1e00-700b-4000-8000-00000000000e', 'a15c1e00-1000-4000-8000-00000000000b', 'characteristic', 'Cumple con las normas IEC, IEEE, UL, EN, CE, etc', 6);

-- -----------------------------------------------------------------------------
-- 8. KAISE OPzV: PRODUCTS (20)
-- -----------------------------------------------------------------------------

INSERT INTO products (id, name, slug, description, product_type_id, status) VALUES
    -- 2V series (12 products)
    ('a15c1e00-3000-4000-8000-000000000001', 'KBOPZV2200',  'kbopzv2200',  'Batería VRLA-GEL 2V 200Ah OPzV — terminal M8',   'a11c1e00-0000-4000-8000-000000000001', 'published'),
    ('a15c1e00-3000-4000-8000-000000000002', 'KBOPZV2300',  'kbopzv2300',  'Batería VRLA-GEL 2V 300Ah OPzV — terminal M8',   'a11c1e00-0000-4000-8000-000000000001', 'published'),
    ('a15c1e00-3000-4000-8000-000000000003', 'KBOPZV2420',  'kbopzv2420',  'Batería VRLA-GEL 2V 420Ah OPzV — terminal M8',   'a11c1e00-0000-4000-8000-000000000001', 'published'),
    ('a15c1e00-3000-4000-8000-000000000004', 'KBOPZV2500',  'kbopzv2500',  'Batería VRLA-GEL 2V 490Ah OPzV — terminal M8',   'a11c1e00-0000-4000-8000-000000000001', 'published'),
    ('a15c1e00-3000-4000-8000-000000000005', 'KBOPZV2600',  'kbopzv2600',  'Batería VRLA-GEL 2V 600Ah OPzV — terminal M8',   'a11c1e00-0000-4000-8000-000000000001', 'published'),
    ('a15c1e00-3000-4000-8000-000000000006', 'KBOPZV2800',  'kbopzv2800',  'Batería VRLA-GEL 2V 800Ah OPzV — terminal M8',   'a11c1e00-0000-4000-8000-000000000001', 'published'),
    ('a15c1e00-3000-4000-8000-000000000007', 'KBOPZV21000', 'kbopzv21000', 'Batería VRLA-GEL 2V 1000Ah OPzV — terminal M8',  'a11c1e00-0000-4000-8000-000000000001', 'published'),
    ('a15c1e00-3000-4000-8000-000000000008', 'KBOPZV21200', 'kbopzv21200', 'Batería VRLA-GEL 2V 1200Ah OPzV — terminal M8',  'a11c1e00-0000-4000-8000-000000000001', 'published'),
    ('a15c1e00-3000-4000-8000-000000000009', 'KBOPZV21500', 'kbopzv21500', 'Batería VRLA-GEL 2V 1500Ah OPzV — terminal M8',  'a11c1e00-0000-4000-8000-000000000001', 'published'),
    ('a15c1e00-3000-4000-8000-00000000000a', 'KBOPZV22000', 'kbopzv22000', 'Batería VRLA-GEL 2V 2000Ah OPzV — terminal M8',  'a11c1e00-0000-4000-8000-000000000001', 'published'),
    ('a15c1e00-3000-4000-8000-00000000000b', 'KBOPZV22500', 'kbopzv22500', 'Batería VRLA-GEL 2V 2500Ah OPzV — terminal M8',  'a11c1e00-0000-4000-8000-000000000001', 'published'),
    ('a15c1e00-3000-4000-8000-00000000000c', 'KBOPZV23000', 'kbopzv23000', 'Batería VRLA-GEL 2V 3000Ah OPzV — terminal M8',  'a11c1e00-0000-4000-8000-000000000001', 'published'),
    -- 12V series (8 products)
    ('a15c1e00-3000-4000-8000-00000000000d', 'KBOPZV1260',  'kbopzv1260',  'Batería VRLA-GEL 12V 60Ah OPzV — terminal M6',   'a11c1e00-0000-4000-8000-000000000001', 'published'),
    ('a15c1e00-3000-4000-8000-00000000000e', 'KBOPZV1280',  'kbopzv1280',  'Batería VRLA-GEL 12V 80Ah OPzV — terminal M8',   'a11c1e00-0000-4000-8000-000000000001', 'published'),
    ('a15c1e00-3000-4000-8000-00000000000f', 'KBOPZV12100', 'kbopzv12100', 'Batería VRLA-GEL 12V 100Ah OPzV — terminal M8',  'a11c1e00-0000-4000-8000-000000000001', 'published'),
    ('a15c1e00-3000-4000-8000-000000000010', 'KBOPZV12120', 'kbopzv12120', 'Batería VRLA-GEL 12V 120Ah OPzV — terminal M8',  'a11c1e00-0000-4000-8000-000000000001', 'published'),
    ('a15c1e00-3000-4000-8000-000000000011', 'KBOPZV12140', 'kbopzv12140', 'Batería VRLA-GEL 12V 140Ah OPzV — terminal M8',  'a11c1e00-0000-4000-8000-000000000001', 'published'),
    ('a15c1e00-3000-4000-8000-000000000012', 'KBOPZV12160', 'kbopzv12160', 'Batería VRLA-GEL 12V 160Ah OPzV — terminal M8',  'a11c1e00-0000-4000-8000-000000000001', 'published'),
    ('a15c1e00-3000-4000-8000-000000000013', 'KBOPZV12180', 'kbopzv12180', 'Batería VRLA-GEL 12V 180Ah OPzV — terminal M8',  'a11c1e00-0000-4000-8000-000000000001', 'published'),
    ('a15c1e00-3000-4000-8000-000000000014', 'KBOPZV12200', 'kbopzv12200', 'Batería VRLA-GEL 12V 200Ah OPzV — terminal M8',  'a11c1e00-0000-4000-8000-000000000001', 'published');

-- -----------------------------------------------------------------------------
-- 9. KAISE OPzV: PRODUCT → CATEGORY LINKS
-- -----------------------------------------------------------------------------

INSERT INTO product_categories (product_id, category_id) VALUES
    ('a15c1e00-3000-4000-8000-000000000001', 'a15c1e00-1000-4000-8000-00000000000b'),
    ('a15c1e00-3000-4000-8000-000000000002', 'a15c1e00-1000-4000-8000-00000000000b'),
    ('a15c1e00-3000-4000-8000-000000000003', 'a15c1e00-1000-4000-8000-00000000000b'),
    ('a15c1e00-3000-4000-8000-000000000004', 'a15c1e00-1000-4000-8000-00000000000b'),
    ('a15c1e00-3000-4000-8000-000000000005', 'a15c1e00-1000-4000-8000-00000000000b'),
    ('a15c1e00-3000-4000-8000-000000000006', 'a15c1e00-1000-4000-8000-00000000000b'),
    ('a15c1e00-3000-4000-8000-000000000007', 'a15c1e00-1000-4000-8000-00000000000b'),
    ('a15c1e00-3000-4000-8000-000000000008', 'a15c1e00-1000-4000-8000-00000000000b'),
    ('a15c1e00-3000-4000-8000-000000000009', 'a15c1e00-1000-4000-8000-00000000000b'),
    ('a15c1e00-3000-4000-8000-00000000000a', 'a15c1e00-1000-4000-8000-00000000000b'),
    ('a15c1e00-3000-4000-8000-00000000000b', 'a15c1e00-1000-4000-8000-00000000000b'),
    ('a15c1e00-3000-4000-8000-00000000000c', 'a15c1e00-1000-4000-8000-00000000000b'),
    ('a15c1e00-3000-4000-8000-00000000000d', 'a15c1e00-1000-4000-8000-00000000000b'),
    ('a15c1e00-3000-4000-8000-00000000000e', 'a15c1e00-1000-4000-8000-00000000000b'),
    ('a15c1e00-3000-4000-8000-00000000000f', 'a15c1e00-1000-4000-8000-00000000000b'),
    ('a15c1e00-3000-4000-8000-000000000010', 'a15c1e00-1000-4000-8000-00000000000b'),
    ('a15c1e00-3000-4000-8000-000000000011', 'a15c1e00-1000-4000-8000-00000000000b'),
    ('a15c1e00-3000-4000-8000-000000000012', 'a15c1e00-1000-4000-8000-00000000000b'),
    ('a15c1e00-3000-4000-8000-000000000013', 'a15c1e00-1000-4000-8000-00000000000b'),
    ('a15c1e00-3000-4000-8000-000000000014', 'a15c1e00-1000-4000-8000-00000000000b');

-- -----------------------------------------------------------------------------
-- 10. KAISE OPzV: PRODUCT ATTRIBUTE VALUES
-- -----------------------------------------------------------------------------

INSERT INTO product_attribute_values (id, product_id, attributes_json) VALUES
    ('a15c1e00-5000-4000-8000-000000000001', 'a15c1e00-3000-4000-8000-000000000001', '{"model_code":"KBOPZV2200","voltage":2,"capacity":200,"capacity_rate":"C10","length":103,"width":206,"height":355,"total_height":390,"terminal_type":"M8","weight":16.0}'),
    ('a15c1e00-5000-4000-8000-000000000002', 'a15c1e00-3000-4000-8000-000000000002', '{"model_code":"KBOPZV2300","voltage":2,"capacity":300,"capacity_rate":"C10","length":145,"width":206,"height":355,"total_height":390,"terminal_type":"M8","weight":23.5}'),
    ('a15c1e00-5000-4000-8000-000000000003', 'a15c1e00-3000-4000-8000-000000000003', '{"model_code":"KBOPZV2420","voltage":2,"capacity":420,"capacity_rate":"C10","length":145,"width":206,"height":470,"total_height":505,"terminal_type":"M8","weight":32.5}'),
    ('a15c1e00-5000-4000-8000-000000000004', 'a15c1e00-3000-4000-8000-000000000004', '{"model_code":"KBOPZV2500","voltage":2,"capacity":490,"capacity_rate":"C10","length":166,"width":206,"height":470,"total_height":505,"terminal_type":"M8","weight":38.0}'),
    ('a15c1e00-5000-4000-8000-000000000005', 'a15c1e00-3000-4000-8000-000000000005', '{"model_code":"KBOPZV2600","voltage":2,"capacity":600,"capacity_rate":"C10","length":145,"width":206,"height":645,"total_height":680,"terminal_type":"M8","weight":45.0}'),
    ('a15c1e00-5000-4000-8000-000000000006', 'a15c1e00-3000-4000-8000-000000000006', '{"model_code":"KBOPZV2800","voltage":2,"capacity":800,"capacity_rate":"C10","length":191,"width":210,"height":645,"total_height":680,"terminal_type":"M8","weight":60.5}'),
    ('a15c1e00-5000-4000-8000-000000000007', 'a15c1e00-3000-4000-8000-000000000007', '{"model_code":"KBOPZV21000","voltage":2,"capacity":1000,"capacity_rate":"C10","length":233,"width":210,"height":645,"total_height":680,"terminal_type":"M8","weight":73.5}'),
    ('a15c1e00-5000-4000-8000-000000000008', 'a15c1e00-3000-4000-8000-000000000008', '{"model_code":"KBOPZV21200","voltage":2,"capacity":1200,"capacity_rate":"C10","length":276,"width":210,"height":645,"total_height":680,"terminal_type":"M8","weight":88.5}'),
    ('a15c1e00-5000-4000-8000-000000000009', 'a15c1e00-3000-4000-8000-000000000009', '{"model_code":"KBOPZV21500","voltage":2,"capacity":1500,"capacity_rate":"C10","length":275,"width":210,"height":795,"total_height":830,"terminal_type":"M8","weight":104.5}'),
    ('a15c1e00-5000-4000-8000-00000000000a', 'a15c1e00-3000-4000-8000-00000000000a', '{"model_code":"KBOPZV22000","voltage":2,"capacity":2000,"capacity_rate":"C10","length":399,"width":214,"height":770,"total_height":805,"terminal_type":"M8","weight":142.5}'),
    ('a15c1e00-5000-4000-8000-00000000000b', 'a15c1e00-3000-4000-8000-00000000000b', '{"model_code":"KBOPZV22500","voltage":2,"capacity":2500,"capacity_rate":"C10","length":487,"width":212,"height":770,"total_height":805,"terminal_type":"M8","weight":180.5}'),
    ('a15c1e00-5000-4000-8000-00000000000c', 'a15c1e00-3000-4000-8000-00000000000c', '{"model_code":"KBOPZV23000","voltage":2,"capacity":3000,"capacity_rate":"C10","length":576,"width":212,"height":770,"total_height":805,"terminal_type":"M8","weight":214.0}'),
    ('a15c1e00-5000-4000-8000-00000000000d', 'a15c1e00-3000-4000-8000-00000000000d', '{"model_code":"KBOPZV1260","voltage":12,"capacity":60,"capacity_rate":"C10","length":260,"width":169,"height":211,"total_height":216,"terminal_type":"M6","weight":23.0}'),
    ('a15c1e00-5000-4000-8000-00000000000e', 'a15c1e00-3000-4000-8000-00000000000e', '{"model_code":"KBOPZV1280","voltage":12,"capacity":80,"capacity_rate":"C10","length":328,"width":172,"height":215,"total_height":220,"terminal_type":"M8","weight":30.0}'),
    ('a15c1e00-5000-4000-8000-00000000000f', 'a15c1e00-3000-4000-8000-00000000000f', '{"model_code":"KBOPZV12100","voltage":12,"capacity":100,"capacity_rate":"C10","length":407,"width":177,"height":225,"total_height":225,"terminal_type":"M8","weight":34.5}'),
    ('a15c1e00-5000-4000-8000-000000000010', 'a15c1e00-3000-4000-8000-000000000010', '{"model_code":"KBOPZV12120","voltage":12,"capacity":120,"capacity_rate":"C10","length":483,"width":170,"height":241,"total_height":242,"terminal_type":"M8","weight":44.6}'),
    ('a15c1e00-5000-4000-8000-000000000011', 'a15c1e00-3000-4000-8000-000000000011', '{"model_code":"KBOPZV12140","voltage":12,"capacity":140,"capacity_rate":"C10","length":532,"width":207,"height":214,"total_height":219,"terminal_type":"M8","weight":52.8}'),
    ('a15c1e00-5000-4000-8000-000000000012', 'a15c1e00-3000-4000-8000-000000000012', '{"model_code":"KBOPZV12160","voltage":12,"capacity":160,"capacity_rate":"C10","length":532,"width":207,"height":214,"total_height":219,"terminal_type":"M8","weight":57.0}'),
    ('a15c1e00-5000-4000-8000-000000000013', 'a15c1e00-3000-4000-8000-000000000013', '{"model_code":"KBOPZV12180","voltage":12,"capacity":180,"capacity_rate":"C10","length":522,"width":240,"height":219,"total_height":224,"terminal_type":"M8","weight":65.0}'),
    ('a15c1e00-5000-4000-8000-000000000014', 'a15c1e00-3000-4000-8000-000000000014', '{"model_code":"KBOPZV12200","voltage":12,"capacity":200,"capacity_rate":"C10","length":521,"width":268,"height":220,"total_height":225,"terminal_type":"M8","weight":69.5}');

-- -----------------------------------------------------------------------------
-- 11. ASSIGN TAGS TO GAMMAS
-- -----------------------------------------------------------------------------

INSERT INTO category_tags (category_id, tag_id) VALUES
    -- Kaise Lead Carbon: Cíclico + Estacionario
    ('a13c1e00-1000-4000-8000-000000000003', 'a15c1e00-2000-4000-8000-000000000001'),
    ('a13c1e00-1000-4000-8000-000000000003', 'a15c1e00-2000-4000-8000-000000000002'),
    -- Kaise Standard: Estacionario
    ('a11c1e00-1000-4000-8000-000000000002', 'a15c1e00-2000-4000-8000-000000000002'),
    -- Kaise Long Life: Estacionario
    ('a11c1e00-1000-4000-8000-000000000003', 'a15c1e00-2000-4000-8000-000000000002'),
    -- Kaise Ultra Long Life: Estacionario
    ('a11c1e00-1000-4000-8000-000000000004', 'a15c1e00-2000-4000-8000-000000000002'),
    -- Kaise Solar (renamed): Cíclico
    ('a11c1e00-1000-4000-8000-000000000006', 'a15c1e00-2000-4000-8000-000000000001'),
    -- Kaise Deep Cycle: Cíclico
    ('a11c1e00-1000-4000-8000-000000000007', 'a15c1e00-2000-4000-8000-000000000001'),
    -- Kaise Front Terminal: Estacionario
    ('a11c1e00-1000-4000-8000-000000000008', 'a15c1e00-2000-4000-8000-000000000002'),
    -- Kaise High Rate: Estacionario
    ('a11c1e00-1000-4000-8000-000000000005', 'a15c1e00-2000-4000-8000-000000000002'),
    -- Kaise Wind Power: Estacionario
    ('a13c1e00-1000-4000-8000-000000000006', 'a15c1e00-2000-4000-8000-000000000002'),
    -- Kaise High Temperature: Estacionario
    ('a11c1e00-1000-4000-8000-000000000009', 'a15c1e00-2000-4000-8000-000000000002'),
    -- Kaise Solar Gel: Cíclico + Estacionario
    ('a13c1e00-1000-4000-8000-000000000004', 'a15c1e00-2000-4000-8000-000000000001'),
    ('a13c1e00-1000-4000-8000-000000000004', 'a15c1e00-2000-4000-8000-000000000002'),
    -- Kaise Deep Cycle Gel: Cíclico
    ('a13c1e00-1000-4000-8000-000000000005', 'a15c1e00-2000-4000-8000-000000000001'),
    -- Kaise OPzV: Cíclico + Estacionario
    ('a15c1e00-1000-4000-8000-00000000000b', 'a15c1e00-2000-4000-8000-000000000001'),
    ('a15c1e00-1000-4000-8000-00000000000b', 'a15c1e00-2000-4000-8000-000000000002');

COMMIT;
