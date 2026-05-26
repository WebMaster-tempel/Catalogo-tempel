DELETE FROM product_categories;
DELETE FROM product_attribute_values;
DELETE FROM media;
DELETE FROM products;
DELETE FROM product_type_attributes;
DELETE FROM categories;
DELETE FROM attributes;
DELETE FROM product_types;

INSERT INTO product_types (id, name, description) VALUES
    ('a11c1e00-0000-4000-8000-000000000001', 'BATERÍA',       'Baterías individuales Kaise'),
    ('a11c1e00-0000-4000-8000-000000000002', 'PACK_BATERÍA',  'Packs y conjuntos de baterías Kaise'),
    ('a11c1e00-0000-4000-8000-000000000003', 'UPS',           'Sistemas UPS / SAI (preparado, sin productos aún)');

INSERT INTO attributes (id, name, label, data_type, unit, is_filterable) VALUES
    ('a11c1e00-2000-4000-8000-000000000001', 'model_code',    'Código de modelo',   'string',  NULL,  1),
    ('a11c1e00-2000-4000-8000-000000000002', 'voltage',       'Voltaje nominal',    'number',  'V',   1),
    ('a11c1e00-2000-4000-8000-000000000003', 'capacity',      'Capacidad nominal',  'number',  'Ah',  1),
    ('a11c1e00-2000-4000-8000-000000000004', 'capacity_rate', 'Tasa de capacidad',  'string',  NULL,  0),
    ('a11c1e00-2000-4000-8000-000000000005', 'length',        'Largo',              'number',  'mm',  0),
    ('a11c1e00-2000-4000-8000-000000000006', 'width',         'Ancho',              'number',  'mm',  0),
    ('a11c1e00-2000-4000-8000-000000000007', 'height',        'Altura',             'number',  'mm',  0),
    ('a11c1e00-2000-4000-8000-000000000008', 'total_height',  'Altura total',       'number',  'mm',  0),
    ('a11c1e00-2000-4000-8000-000000000009', 'terminal_type', 'Tipo de terminal',   'string',  NULL,  1),
    ('a11c1e00-2000-4000-8000-00000000000a', 'weight',        'Peso',               'number',  'kg',  0),
    ('a11c1e00-2000-4000-8000-00000000000b', 'power_rating',  'Potencia nominal',   'number',  'W',   0);

INSERT INTO product_type_attributes (id, product_type_id, attribute_id, is_required, `order`) VALUES
    ('a11c1e00-4000-4000-8000-000000000001', 'a11c1e00-0000-4000-8000-000000000001', 'a11c1e00-2000-4000-8000-000000000001', 1,  1),
    ('a11c1e00-4000-4000-8000-000000000002', 'a11c1e00-0000-4000-8000-000000000001', 'a11c1e00-2000-4000-8000-000000000002', 1,  2),
    ('a11c1e00-4000-4000-8000-000000000003', 'a11c1e00-0000-4000-8000-000000000001', 'a11c1e00-2000-4000-8000-000000000003', 1,  3),
    ('a11c1e00-4000-4000-8000-000000000004', 'a11c1e00-0000-4000-8000-000000000001', 'a11c1e00-2000-4000-8000-000000000004', 0,  4),
    ('a11c1e00-4000-4000-8000-000000000005', 'a11c1e00-0000-4000-8000-000000000001', 'a11c1e00-2000-4000-8000-000000000005', 0,  5),
    ('a11c1e00-4000-4000-8000-000000000006', 'a11c1e00-0000-4000-8000-000000000001', 'a11c1e00-2000-4000-8000-000000000006', 0,  6),
    ('a11c1e00-4000-4000-8000-000000000007', 'a11c1e00-0000-4000-8000-000000000001', 'a11c1e00-2000-4000-8000-000000000007', 0,  7),
    ('a11c1e00-4000-4000-8000-000000000008', 'a11c1e00-0000-4000-8000-000000000001', 'a11c1e00-2000-4000-8000-000000000008', 0,  8),
    ('a11c1e00-4000-4000-8000-000000000009', 'a11c1e00-0000-4000-8000-000000000001', 'a11c1e00-2000-4000-8000-000000000009', 0,  9),
    ('a11c1e00-4000-4000-8000-00000000000a', 'a11c1e00-0000-4000-8000-000000000001', 'a11c1e00-2000-4000-8000-00000000000a', 0, 10),
    ('a11c1e00-4000-4000-8000-00000000000b', 'a11c1e00-0000-4000-8000-000000000001', 'a11c1e00-2000-4000-8000-00000000000b', 0, 11);

INSERT INTO categories (id, name, slug, description, parent_id, technology, plate_type, design_life_years, cycles, capacity_range, applications, eurobat, characteristics) VALUES
    ('a11c1e00-1000-4000-8000-000000000001', 'KAISE LITIO', 'kaise-litio',
     'Baterías LiFePO4 con BMS integrado. Vida útil +10 años, +6000 ciclos (DOD 75%). Rango 7-300 Ah. Carga/descarga 1C.',
     NULL, 'LiFePO4', 'Prismática', '+10 años', '+6000 (algunos 48V: +5000)', '7 – 300 Ah',
     'Telecomunicaciones, UPS, renovables, SAI, monitoreo carreteras, marítimo, almacenamiento solar/eólico, herramientas eléctricas, bicis, golf, sillas ruedas, autocaravanas',
     0, 'BMS integrado (RS232/RS485). Protecciones: sobrecarga, sobretensión, sobrecalentamiento, baja temperatura, cortocircuito. Eficiencia ~95% vs 80% Pb. ~50% menos espacio. Uso hasta 45ºC. Excelente PSoC. Sin mantenimiento.'),
    ('a11c1e00-1000-4000-8000-000000000002', 'KAISE STANDARD', 'kaise-standard',
     'VRLA AGM con placa Flat. Vida útil 3-5 años, ~1050-1200 ciclos. Rango 1,2-28 Ah (C20). Eurobat clasificada.',
     NULL, 'VRLA-AGM', 'Flat', '3-5 años', '1050-1200', '1,2 – 28 Ah (C20)',
     'UPS/SAI, alarmas, TV cable, iluminación emergencia, seguridad/contraincendios, telecom, juguetes, máquinas vending, herramientas eléctricas, equipos médicos/marítimos',
     1, 'Sellada, libre de mantenimiento. Regulada por válvula. Baja autodescarga. Componentes UL reconocidos (25860).'),
    ('a11c1e00-1000-4000-8000-000000000003', 'KAISE LONG LIFE', 'kaise-long-life',
     'VRLA AGM Flat de larga vida. 10 años en flotación, ~1200 ciclos. Rango 7,2-250 Ah (C10). Eurobat.',
     NULL, 'VRLA-AGM', 'Flat', '10 años (flotación)', '~1200', '7,2 – 250 Ah (C10)',
     'SAI, telecom, TV cable, centrales eléctricas, marítimo/militar, ferrocarriles',
     1, 'Rejillas de aleación Pb-Sn-Ca de alta densidad. Diseñada para aplicaciones críticas de larga duración.');

INSERT INTO products (id, name, slug, description, product_type_id, status) VALUES
    ('a11c1e00-3000-4000-8000-000000000001', 'KBLI127',   'kbli127',   'Batería LiFePO4 12.8V 7Ah — pequeño formato, terminal F1',       'a11c1e00-0000-4000-8000-000000000001', 'published'),
    ('a11c1e00-3000-4000-8000-000000000002', 'KBLI12100', 'kbli12100', 'Batería LiFePO4 12.8V 100Ah — formato medio, terminal M8',       'a11c1e00-0000-4000-8000-000000000001', 'published'),
    ('a11c1e00-3000-4000-8000-000000000003', 'KBLI48100', 'kbli48100', 'Batería LiFePO4 51.2V 100Ah — alto voltaje, terminal M8',        'a11c1e00-0000-4000-8000-000000000001', 'published'),
    ('a11c1e00-3000-4000-8000-000000000004', 'KB1270',    'kb1270',    'Batería VRLA AGM 12V 7Ah — Standard, terminal F1',               'a11c1e00-0000-4000-8000-000000000001', 'published'),
    ('a11c1e00-3000-4000-8000-000000000005', 'KBL1272',   'kbl1272',   'Batería VRLA AGM 12V 7,2Ah Long Life (10 años) — terminal F1/F2','a11c1e00-0000-4000-8000-000000000001', 'published');

INSERT INTO product_attribute_values (id, product_id, attributes_json) VALUES
    ('a11c1e00-5000-4000-8000-000000000001', 'a11c1e00-3000-4000-8000-000000000001', '{"model_code":"KBLI127","voltage":12.8,"capacity":7,"length":151,"width":65,"height":94,"total_height":99,"terminal_type":"F1","weight":1.1}'),
    ('a11c1e00-5000-4000-8000-000000000002', 'a11c1e00-3000-4000-8000-000000000002', '{"model_code":"KBLI12100","voltage":12.8,"capacity":100,"length":330,"width":172,"height":215,"total_height":223,"terminal_type":"M8","weight":12.0}'),
    ('a11c1e00-5000-4000-8000-000000000003', 'a11c1e00-3000-4000-8000-000000000003', '{"model_code":"KBLI48100","voltage":51.2,"capacity":100,"length":450,"width":442,"height":223,"total_height":223,"terminal_type":"M8","weight":49.5}'),
    ('a11c1e00-5000-4000-8000-000000000004', 'a11c1e00-3000-4000-8000-000000000004', '{"model_code":"KB1270","voltage":12,"capacity":7.0,"capacity_rate":"C20","length":151,"width":65,"height":94,"total_height":100,"terminal_type":"F1","weight":1.9}'),
    ('a11c1e00-5000-4000-8000-000000000005', 'a11c1e00-3000-4000-8000-000000000005', '{"model_code":"KBL1272","voltage":12,"capacity":7.2,"capacity_rate":"C10","length":151,"width":65,"height":94,"total_height":100,"terminal_type":"F1/F2","weight":2.4}');

INSERT INTO product_categories (product_id, category_id) VALUES
    ('a11c1e00-3000-4000-8000-000000000001', 'a11c1e00-1000-4000-8000-000000000001'),
    ('a11c1e00-3000-4000-8000-000000000002', 'a11c1e00-1000-4000-8000-000000000001'),
    ('a11c1e00-3000-4000-8000-000000000003', 'a11c1e00-1000-4000-8000-000000000001'),
    ('a11c1e00-3000-4000-8000-000000000004', 'a11c1e00-1000-4000-8000-000000000002'),
    ('a11c1e00-3000-4000-8000-000000000005', 'a11c1e00-1000-4000-8000-000000000003')
