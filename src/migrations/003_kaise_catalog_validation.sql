-- =============================================================================
-- KAISE CATALOG - VALIDATION SCRIPT (Part 1)
-- Loads 3 battery categories, attributes, and product types.
-- Full product catalog populated by migration 009.
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 1. CLEAN EXISTING DATA (in dependency order)
-- -----------------------------------------------------------------------------
DELETE FROM product_categories;
DELETE FROM product_attribute_values;
DELETE FROM media;
DELETE FROM products;
DELETE FROM product_type_attributes;
DELETE FROM categories;
DELETE FROM attributes;
DELETE FROM product_types;

-- -----------------------------------------------------------------------------
-- 2. PRODUCT TYPES
-- -----------------------------------------------------------------------------
INSERT INTO product_types (id, name, description) VALUES
    ('a11c1e00-0000-4000-8000-000000000001', 'BATERÍA',       'Baterías individuales Kaise'),
    ('a11c1e00-0000-4000-8000-000000000002', 'PACK_BATERÍA',  'Packs y conjuntos de baterías Kaise'),
    ('a11c1e00-0000-4000-8000-000000000003', 'UPS',           'Sistemas UPS / SAI (preparado, sin productos aún)');

-- -----------------------------------------------------------------------------
-- 3. ATTRIBUTES (global definitions)
-- -----------------------------------------------------------------------------
INSERT INTO attributes (id, name, label, data_type, unit, is_filterable) VALUES
    ('a11c1e00-2000-4000-8000-000000000001', 'model_code',    'Código de modelo',   'string',  NULL,  true),
    ('a11c1e00-2000-4000-8000-000000000002', 'voltage',       'Voltaje nominal',    'number',  'V',   true),
    ('a11c1e00-2000-4000-8000-000000000003', 'capacity',      'Capacidad nominal',  'number',  'Ah',  true),
    ('a11c1e00-2000-4000-8000-000000000004', 'capacity_rate', 'Tasa de capacidad',  'string',  NULL,  false),
    ('a11c1e00-2000-4000-8000-000000000005', 'length',        'Largo',              'number',  'mm',  false),
    ('a11c1e00-2000-4000-8000-000000000006', 'width',         'Ancho',              'number',  'mm',  false),
    ('a11c1e00-2000-4000-8000-000000000007', 'height',        'Altura',             'number',  'mm',  false),
    ('a11c1e00-2000-4000-8000-000000000008', 'total_height',  'Altura total',       'number',  'mm',  false),
    ('a11c1e00-2000-4000-8000-000000000009', 'terminal_type', 'Tipo de terminal',   'string',  NULL,  true),
    ('a11c1e00-2000-4000-8000-00000000000a', 'weight',        'Peso',               'number',  'kg',  false),
    ('a11c1e00-2000-4000-8000-00000000000b', 'power_rating',  'Potencia nominal',   'number',  'W',   false);

-- -----------------------------------------------------------------------------
-- 4. ASSIGN ATTRIBUTES TO PRODUCT TYPE "BATERÍA"
-- -----------------------------------------------------------------------------
INSERT INTO product_type_attributes (id, product_type_id, attribute_id, is_required, "order") VALUES
    ('a11c1e00-4000-4000-8000-000000000001', 'a11c1e00-0000-4000-8000-000000000001', 'a11c1e00-2000-4000-8000-000000000001', true,  1),  -- model_code
    ('a11c1e00-4000-4000-8000-000000000002', 'a11c1e00-0000-4000-8000-000000000001', 'a11c1e00-2000-4000-8000-000000000002', true,  2),  -- voltage
    ('a11c1e00-4000-4000-8000-000000000003', 'a11c1e00-0000-4000-8000-000000000001', 'a11c1e00-2000-4000-8000-000000000003', true,  3),  -- capacity
    ('a11c1e00-4000-4000-8000-000000000004', 'a11c1e00-0000-4000-8000-000000000001', 'a11c1e00-2000-4000-8000-000000000004', false, 4),  -- capacity_rate
    ('a11c1e00-4000-4000-8000-000000000005', 'a11c1e00-0000-4000-8000-000000000001', 'a11c1e00-2000-4000-8000-000000000005', false, 5),  -- length
    ('a11c1e00-4000-4000-8000-000000000006', 'a11c1e00-0000-4000-8000-000000000001', 'a11c1e00-2000-4000-8000-000000000006', false, 6),  -- width
    ('a11c1e00-4000-4000-8000-000000000007', 'a11c1e00-0000-4000-8000-000000000001', 'a11c1e00-2000-4000-8000-000000000007', false, 7),  -- height
    ('a11c1e00-4000-4000-8000-000000000008', 'a11c1e00-0000-4000-8000-000000000001', 'a11c1e00-2000-4000-8000-000000000008', false, 8),  -- total_height
    ('a11c1e00-4000-4000-8000-000000000009', 'a11c1e00-0000-4000-8000-000000000001', 'a11c1e00-2000-4000-8000-000000000009', false, 9),  -- terminal_type
    ('a11c1e00-4000-4000-8000-00000000000a', 'a11c1e00-0000-4000-8000-000000000001', 'a11c1e00-2000-4000-8000-00000000000a', false, 10), -- weight
    ('a11c1e00-4000-4000-8000-00000000000b', 'a11c1e00-0000-4000-8000-000000000001', 'a11c1e00-2000-4000-8000-00000000000b', false, 11); -- power_rating

-- -----------------------------------------------------------------------------
-- 5. CATEGORIES (first 3 of the catalog)
-- -----------------------------------------------------------------------------
INSERT INTO categories (id, name, slug, description, parent_id,
                         technology, plate_type, design_life_years, cycles,
                         capacity_range, applications, eurobat, characteristics) VALUES

    ('a11c1e00-1000-4000-8000-000000000001',
     'KAISE LITIO',
     'kaise-litio',
     'Baterías LiFePO4 con BMS integrado. Vida útil +10 años, +6000 ciclos (DOD 75%). Rango 7-300 Ah. Carga/descarga 1C.',
     NULL,
     'LiFePO4',
     'Prismática',
     '+10 años',
     '+6000 (algunos 48V: +5000)',
     '7 – 300 Ah',
     'Telecomunicaciones, UPS, renovables, SAI, monitoreo carreteras, marítimo, almacenamiento solar/eólico, herramientas eléctricas, bicis, golf, sillas ruedas, autocaravanas',
     FALSE,
     'BMS integrado (RS232/RS485). Protecciones: sobrecarga, sobretensión, sobrecalentamiento, baja temperatura, cortocircuito. Eficiencia ~95% vs 80% Pb. ~50% menos espacio. Uso hasta 45ºC. Excelente PSoC. Sin mantenimiento.'),

    ('a11c1e00-1000-4000-8000-000000000002',
     'KAISE STANDARD',
     'kaise-standard',
     'VRLA AGM con placa Flat. Vida útil 3-5 años, ~1050-1200 ciclos. Rango 1,2-28 Ah (C20). Eurobat clasificada.',
     NULL,
     'VRLA-AGM',
     'Flat',
     '3-5 años',
     '1050-1200',
     '1,2 – 28 Ah (C20)',
     'UPS/SAI, alarmas, TV cable, iluminación emergencia, seguridad/contraincendios, telecom, juguetes, máquinas vending, herramientas eléctricas, equipos médicos/marítimos',
     TRUE,
     'Sellada, libre de mantenimiento. Regulada por válvula. Baja autodescarga. Componentes UL reconocidos (25860).'),

    ('a11c1e00-1000-4000-8000-000000000003',
     'KAISE LONG LIFE',
     'kaise-long-life',
     'VRLA AGM Flat de larga vida. 10 años en flotación, ~1200 ciclos. Rango 7,2-250 Ah (C10). Eurobat.',
     NULL,
     'VRLA-AGM',
     'Flat',
     '10 años (flotación)',
     '~1200',
     '7,2 – 250 Ah (C10)',
     'SAI, telecom, TV cable, centrales eléctricas, marítimo/militar, ferrocarriles',
     TRUE,
     'Rejillas de aleación Pb-Sn-Ca de alta densidad. Diseñada para aplicaciones críticas de larga duración.');


COMMIT;
