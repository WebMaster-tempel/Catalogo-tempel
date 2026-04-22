-- Migration 014: Products for ELECTRIC VEHICLE, LEAD CARBON, SOLAR GEL, DEEP CYCLE GEL, WIND POWER
BEGIN;

-- =====================================================================
-- PRODUCTS
-- =====================================================================

-- KAISE ELECTRIC VEHICLE (11 products)
INSERT INTO products (id, name, slug, description, product_type_id, status) VALUES
  ('a14c1e00-3001-4000-8000-000000000001', 'KB6200EV',     'kb6200ev',     'Batería Electric Vehicle 6V 230Ah — terminal M8',      'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a14c1e00-3001-4000-8000-000000000002', 'KB6220EV',     'kb6220ev',     'Batería Electric Vehicle 6V 250Ah — terminal M8',      'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a14c1e00-3001-4000-8000-000000000003', 'KB8170EV',     'kb8170ev',     'Batería Electric Vehicle 8V 190Ah — terminal M8',      'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a14c1e00-3001-4000-8000-000000000004', 'KB1212EV',     'kb1212ev',     'Batería Electric Vehicle 12V 17Ah — terminal M5',      'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a14c1e00-3001-4000-8000-000000000005', 'KB1220EV',     'kb1220ev',     'Batería Electric Vehicle 12V 29.5Ah — terminal M5',    'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a14c1e00-3001-4000-8000-000000000006', 'KB1255EV',     'kb1255ev',     'Batería Electric Vehicle 12V 55Ah — terminal M6',      'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a14c1e00-3001-4000-8000-000000000007', 'KB1280EV',     'kb1280ev',     'Batería Electric Vehicle 12V 100Ah — terminal M6',     'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a14c1e00-3001-4000-8000-000000000008', 'KB12110EV',    'kb12110ev',    'Batería Electric Vehicle 12V 118Ah — terminal M8',     'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a14c1e00-3001-4000-8000-000000000009', 'KB12120EV',    'kb12120ev',    'Batería Electric Vehicle 12V 137Ah — terminal M8',     'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a14c1e00-3001-4000-8000-00000000000a', 'KB12135EV',    'kb12135ev',    'Batería Electric Vehicle 12V 157Ah — terminal M8',     'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a14c1e00-3001-4000-8000-00000000000b', 'KB12150EV',    'kb12150ev',    'Batería Electric Vehicle 12V 170Ah — terminal M8',     'a11c1e00-0000-4000-8000-000000000001', 'published'),

-- KAISE ELECTRIC VEHICLE TRACCIÓN (8 products)
  ('a14c1e00-3002-4000-8000-000000000001', 'KB6225TR',     'kb6225tr',     'Batería Tracción 6V 185Ah (5h) — terminal M8',        'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a14c1e00-3002-4000-8000-000000000002', 'KB6245TR',     'kb6245tr',     'Batería Tracción 6V 201Ah (5h) — terminal 1(AP)',     'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a14c1e00-3002-4000-8000-000000000003', 'KB6260TR',     'kb6260tr',     'Batería Tracción 6V 215Ah (5h) — terminal M8',        'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a14c1e00-3002-4000-8000-000000000004', 'KB6330TR',     'kb6330tr',     'Batería Tracción 6V 271Ah (5h) — terminal M8',        'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a14c1e00-3002-4000-8000-000000000005', 'KB6420TR',     'kb6420tr',     'Batería Tracción 6V 344Ah (5h) — terminal M8',        'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a14c1e00-3002-4000-8000-000000000006', 'KB8170TR',     'kb8170tr',     'Batería Tracción 8V 145Ah (5h) — terminal M8',        'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a14c1e00-3002-4000-8000-000000000007', 'KB8190TR',     'kb8190tr',     'Batería Tracción 8V 155Ah (5h) — terminal M8',        'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a14c1e00-3002-4000-8000-000000000008', 'KB12150TR',    'kb12150tr',    'Batería Tracción 12V 120Ah (5h) — terminal M8',       'a11c1e00-0000-4000-8000-000000000001', 'published'),

-- KAISE LEAD CARBON (7 products)
  ('a14c1e00-3003-4000-8000-000000000001', 'KBLC12750',    'kblc12750',    'Batería Lead Carbon 12V 75Ah — terminal M6',          'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a14c1e00-3003-4000-8000-000000000002', 'KBLC121000',   'kblc121000',   'Batería Lead Carbon 12V 100Ah — terminal M8',         'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a14c1e00-3003-4000-8000-000000000003', 'KBLC121500',   'kblc121500',   'Batería Lead Carbon 12V 150Ah — terminal M8',         'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a14c1e00-3003-4000-8000-000000000004', 'KBLC121750',   'kblc121750',   'Batería Lead Carbon 12V 165Ah — terminal M8',         'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a14c1e00-3003-4000-8000-000000000005', 'KBLC122000',   'kblc122000',   'Batería Lead Carbon 12V 200Ah — terminal M8',         'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a14c1e00-3003-4000-8000-000000000006', 'KBLC122000S',  'kblc122000s',  'Batería Lead Carbon 12V 200Ah (Slim) — terminal M8',   'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a14c1e00-3003-4000-8000-000000000007', 'KBLC122250',   'kblc122250',   'Batería Lead Carbon 12V 250Ah — terminal M8',         'a11c1e00-0000-4000-8000-000000000001', 'published'),

-- KAISE SOLAR GEL (5 products)
  ('a14c1e00-3004-4000-8000-000000000001', 'KBGS12800',    'kbgs12800',    'Batería Solar GEL 12V 80Ah — terminal M6',            'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a14c1e00-3004-4000-8000-000000000002', 'KBGS121200',   'kbgs121200',   'Batería Solar GEL 12V 120Ah — terminal M8',           'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a14c1e00-3004-4000-8000-000000000003', 'KBGS121400',   'kbgs121400',   'Batería Solar GEL 12V 140Ah — terminal M8',           'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a14c1e00-3004-4000-8000-000000000004', 'KBGS121800',   'kbgs121800',   'Batería Solar GEL 12V 180Ah — terminal M8',           'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a14c1e00-3004-4000-8000-000000000005', 'KBGS122500',   'kbgs122500',   'Batería Solar GEL 12V 250Ah — terminal M8',           'a11c1e00-0000-4000-8000-000000000001', 'published'),

-- KAISE DEEP CYCLE GEL (11 products)
  ('a14c1e00-3005-4000-8000-000000000001', 'KBG12300',     'kbg12300',     'Batería Deep Cycle GEL 12V 33Ah — terminal M6',       'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a14c1e00-3005-4000-8000-000000000002', 'KBG12400',     'kbg12400',     'Batería Deep Cycle GEL 12V 40Ah — terminal M6',       'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a14c1e00-3005-4000-8000-000000000003', 'KBG12550',     'kbg12550',     'Batería Deep Cycle GEL 12V 55Ah — terminal M6',       'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a14c1e00-3005-4000-8000-000000000004', 'KBG12650',     'kbg12650',     'Batería Deep Cycle GEL 12V 65Ah — terminal M6',       'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a14c1e00-3005-4000-8000-000000000005', 'KBG12800',     'kbg12800',     'Batería Deep Cycle GEL 12V 80Ah — terminal M6',       'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a14c1e00-3005-4000-8000-000000000006', 'KBG12900',     'kbg12900',     'Batería Deep Cycle GEL 12V 90Ah — terminal M8',       'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a14c1e00-3005-4000-8000-000000000007', 'KBG121000',    'kbg121000',    'Batería Deep Cycle GEL 12V 100Ah — terminal M8',      'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a14c1e00-3005-4000-8000-000000000008', 'KBG121200',    'kbg121200',    'Batería Deep Cycle GEL 12V 120Ah — terminal M8',      'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a14c1e00-3005-4000-8000-000000000009', 'KBG121500',    'kbg121500',    'Batería Deep Cycle GEL 12V 150Ah — terminal M8',      'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a14c1e00-3005-4000-8000-00000000000a', 'KBG122000',    'kbg122000',    'Batería Deep Cycle GEL 12V 200Ah — terminal M8',      'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a14c1e00-3005-4000-8000-00000000000b', 'KBG122500',    'kbg122500',    'Batería Deep Cycle GEL 12V 250Ah — terminal M8',      'a11c1e00-0000-4000-8000-000000000001', 'published'),

-- KAISE WIND POWER (2 products)
  ('a14c1e00-3006-4000-8000-000000000001', 'KBL1272WP',    'kbl1272wp',    'Batería Wind Power 12V 7.2Ah — terminal F2',          'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a14c1e00-3006-4000-8000-000000000002', 'KB12120WP',    'kb12120wp',    'Batería Wind Power 12V 12Ah — terminal F2',           'a11c1e00-0000-4000-8000-000000000001', 'published');

-- =====================================================================
-- PRODUCT_CATEGORIES ASSIGNMENTS
-- =====================================================================
INSERT INTO product_categories (product_id, category_id) VALUES
  -- ELECTRIC VEHICLE (11)
  ('a14c1e00-3001-4000-8000-000000000001', 'a13c1e00-1000-4000-8000-000000000001'),
  ('a14c1e00-3001-4000-8000-000000000002', 'a13c1e00-1000-4000-8000-000000000001'),
  ('a14c1e00-3001-4000-8000-000000000003', 'a13c1e00-1000-4000-8000-000000000001'),
  ('a14c1e00-3001-4000-8000-000000000004', 'a13c1e00-1000-4000-8000-000000000001'),
  ('a14c1e00-3001-4000-8000-000000000005', 'a13c1e00-1000-4000-8000-000000000001'),
  ('a14c1e00-3001-4000-8000-000000000006', 'a13c1e00-1000-4000-8000-000000000001'),
  ('a14c1e00-3001-4000-8000-000000000007', 'a13c1e00-1000-4000-8000-000000000001'),
  ('a14c1e00-3001-4000-8000-000000000008', 'a13c1e00-1000-4000-8000-000000000001'),
  ('a14c1e00-3001-4000-8000-000000000009', 'a13c1e00-1000-4000-8000-000000000001'),
  ('a14c1e00-3001-4000-8000-00000000000a', 'a13c1e00-1000-4000-8000-000000000001'),
  ('a14c1e00-3001-4000-8000-00000000000b', 'a13c1e00-1000-4000-8000-000000000001'),
  -- TRACCIÓN (8)
  ('a14c1e00-3002-4000-8000-000000000001', 'a13c1e00-1000-4000-8000-000000000002'),
  ('a14c1e00-3002-4000-8000-000000000002', 'a13c1e00-1000-4000-8000-000000000002'),
  ('a14c1e00-3002-4000-8000-000000000003', 'a13c1e00-1000-4000-8000-000000000002'),
  ('a14c1e00-3002-4000-8000-000000000004', 'a13c1e00-1000-4000-8000-000000000002'),
  ('a14c1e00-3002-4000-8000-000000000005', 'a13c1e00-1000-4000-8000-000000000002'),
  ('a14c1e00-3002-4000-8000-000000000006', 'a13c1e00-1000-4000-8000-000000000002'),
  ('a14c1e00-3002-4000-8000-000000000007', 'a13c1e00-1000-4000-8000-000000000002'),
  ('a14c1e00-3002-4000-8000-000000000008', 'a13c1e00-1000-4000-8000-000000000002'),
  -- LEAD CARBON (7)
  ('a14c1e00-3003-4000-8000-000000000001', 'a13c1e00-1000-4000-8000-000000000003'),
  ('a14c1e00-3003-4000-8000-000000000002', 'a13c1e00-1000-4000-8000-000000000003'),
  ('a14c1e00-3003-4000-8000-000000000003', 'a13c1e00-1000-4000-8000-000000000003'),
  ('a14c1e00-3003-4000-8000-000000000004', 'a13c1e00-1000-4000-8000-000000000003'),
  ('a14c1e00-3003-4000-8000-000000000005', 'a13c1e00-1000-4000-8000-000000000003'),
  ('a14c1e00-3003-4000-8000-000000000006', 'a13c1e00-1000-4000-8000-000000000003'),
  ('a14c1e00-3003-4000-8000-000000000007', 'a13c1e00-1000-4000-8000-000000000003'),
  -- SOLAR GEL (5)
  ('a14c1e00-3004-4000-8000-000000000001', 'a13c1e00-1000-4000-8000-000000000004'),
  ('a14c1e00-3004-4000-8000-000000000002', 'a13c1e00-1000-4000-8000-000000000004'),
  ('a14c1e00-3004-4000-8000-000000000003', 'a13c1e00-1000-4000-8000-000000000004'),
  ('a14c1e00-3004-4000-8000-000000000004', 'a13c1e00-1000-4000-8000-000000000004'),
  ('a14c1e00-3004-4000-8000-000000000005', 'a13c1e00-1000-4000-8000-000000000004'),
  -- DEEP CYCLE GEL (11)
  ('a14c1e00-3005-4000-8000-000000000001', 'a13c1e00-1000-4000-8000-000000000005'),
  ('a14c1e00-3005-4000-8000-000000000002', 'a13c1e00-1000-4000-8000-000000000005'),
  ('a14c1e00-3005-4000-8000-000000000003', 'a13c1e00-1000-4000-8000-000000000005'),
  ('a14c1e00-3005-4000-8000-000000000004', 'a13c1e00-1000-4000-8000-000000000005'),
  ('a14c1e00-3005-4000-8000-000000000005', 'a13c1e00-1000-4000-8000-000000000005'),
  ('a14c1e00-3005-4000-8000-000000000006', 'a13c1e00-1000-4000-8000-000000000005'),
  ('a14c1e00-3005-4000-8000-000000000007', 'a13c1e00-1000-4000-8000-000000000005'),
  ('a14c1e00-3005-4000-8000-000000000008', 'a13c1e00-1000-4000-8000-000000000005'),
  ('a14c1e00-3005-4000-8000-000000000009', 'a13c1e00-1000-4000-8000-000000000005'),
  ('a14c1e00-3005-4000-8000-00000000000a', 'a13c1e00-1000-4000-8000-000000000005'),
  ('a14c1e00-3005-4000-8000-00000000000b', 'a13c1e00-1000-4000-8000-000000000005'),
  -- WIND POWER (2)
  ('a14c1e00-3006-4000-8000-000000000001', 'a13c1e00-1000-4000-8000-000000000006'),
  ('a14c1e00-3006-4000-8000-000000000002', 'a13c1e00-1000-4000-8000-000000000006');

-- =====================================================================
-- PRODUCT ATTRIBUTE VALUES
-- =====================================================================
INSERT INTO product_attribute_values (id, product_id, attributes_json) VALUES
  -- ELECTRIC VEHICLE
  ('a14c1e00-5001-4000-8000-000000000001', 'a14c1e00-3001-4000-8000-000000000001', '{"model_code":"KB6200EV","voltage":6,"capacity_nominal_10h":230,"capacity_nominal_3h":201,"length":260,"width":180,"height":268,"total_height":273,"terminal_type":"M8","weight":32.5}'),
  ('a14c1e00-5001-4000-8000-000000000002', 'a14c1e00-3001-4000-8000-000000000002', '{"model_code":"KB6220EV","voltage":6,"capacity_nominal_10h":250,"capacity_nominal_3h":220,"length":260,"width":180,"height":268,"total_height":273,"terminal_type":"M8","weight":35.0}'),
  ('a14c1e00-5001-4000-8000-000000000003', 'a14c1e00-3001-4000-8000-000000000003', '{"model_code":"KB8170EV","voltage":8,"capacity_nominal_10h":190,"capacity_nominal_3h":170,"length":260,"width":180,"height":280,"total_height":280,"terminal_type":"M8","weight":36.5}'),
  ('a14c1e00-5001-4000-8000-000000000004', 'a14c1e00-3001-4000-8000-000000000004', '{"model_code":"KB1212EV","voltage":12,"capacity_nominal_10h":17,"capacity_nominal_3h_c2":13.3,"length":151,"width":99,"height":98,"total_height":98.5,"terminal_type":"M5","weight":4.35}'),
  ('a14c1e00-5001-4000-8000-000000000005', 'a14c1e00-3001-4000-8000-000000000005', '{"model_code":"KB1220EV","voltage":12,"capacity_nominal_10h":29.5,"capacity_nominal_3h_c2":23,"length":181,"width":77,"height":170,"total_height":170,"terminal_type":"M5","weight":6.9}'),
  ('a14c1e00-5001-4000-8000-000000000006', 'a14c1e00-3001-4000-8000-000000000006', '{"model_code":"KB1255EV","voltage":12,"capacity_nominal_10h":55,"capacity_nominal_3h":52.3,"length":223,"width":136,"height":177,"total_height":177,"terminal_type":"M6","weight":14.1}'),
  ('a14c1e00-5001-4000-8000-000000000007', 'a14c1e00-3001-4000-8000-000000000007', '{"model_code":"KB1280EV","voltage":12,"capacity_nominal_10h":100,"capacity_nominal_3h":80,"length":260,"width":168,"height":210,"total_height":210,"terminal_type":"M6","weight":26.5}'),
  ('a14c1e00-5001-4000-8000-000000000008', 'a14c1e00-3001-4000-8000-000000000008', '{"model_code":"KB12110EV","voltage":12,"capacity_nominal_10h":118,"capacity_nominal_3h":106,"length":330,"width":172,"height":214,"total_height":214,"terminal_type":"M8","weight":33.2}'),
  ('a14c1e00-5001-4000-8000-000000000009', 'a14c1e00-3001-4000-8000-000000000009', '{"model_code":"KB12120EV","voltage":12,"capacity_nominal_10h":137,"capacity_nominal_3h":120,"length":407,"width":175,"height":212,"total_height":216,"terminal_type":"M8","weight":40.0}'),
  ('a14c1e00-5001-4000-8000-00000000000a', 'a14c1e00-3001-4000-8000-00000000000a', '{"model_code":"KB12135EV","voltage":12,"capacity_nominal_10h":157,"capacity_nominal_3h":135,"length":336,"width":172,"height":279,"total_height":279,"terminal_type":"M8","weight":45.0}'),
  ('a14c1e00-5001-4000-8000-00000000000b', 'a14c1e00-3001-4000-8000-00000000000b', '{"model_code":"KB12150EV","voltage":12,"capacity_nominal_10h":170,"capacity_nominal_3h":150,"length":481,"width":170,"height":239,"total_height":239,"terminal_type":"M8","weight":50.0}'),

  -- TRACCIÓN
  ('a14c1e00-5002-4000-8000-000000000001', 'a14c1e00-3002-4000-8000-000000000001', '{"model_code":"KB6225TR","voltage":6,"capacity_nominal_5h":185,"capacity_nominal_20h":225,"rc_25amp":445,"rc_75amp":115,"length":260,"width":180,"height":248,"total_height":280,"terminal_type":"M8","weight":28.6}'),
  ('a14c1e00-5002-4000-8000-000000000002', 'a14c1e00-3002-4000-8000-000000000002', '{"model_code":"KB6245TR","voltage":6,"capacity_nominal_5h":201,"capacity_nominal_20h":245,"rc_25amp":500,"rc_75amp":135,"length":244,"width":191,"height":246.5,"total_height":268,"terminal_type":"1(AP)","weight":31.0}'),
  ('a14c1e00-5002-4000-8000-000000000003', 'a14c1e00-3002-4000-8000-000000000003', '{"model_code":"KB6260TR","voltage":6,"capacity_nominal_5h":215,"capacity_nominal_20h":260,"rc_25amp":530,"rc_75amp":145,"length":260,"width":180,"height":248,"total_height":280,"terminal_type":"M8","weight":30.4}'),
  ('a14c1e00-5002-4000-8000-000000000004', 'a14c1e00-3002-4000-8000-000000000004', '{"model_code":"KB6330TR","voltage":6,"capacity_nominal_5h":271,"capacity_nominal_20h":330,"rc_25amp":711,"rc_75amp":195,"length":296,"width":176,"height":336,"total_height":336,"terminal_type":"M8","weight":42.0}'),
  ('a14c1e00-5002-4000-8000-000000000005', 'a14c1e00-3002-4000-8000-000000000005', '{"model_code":"KB6420TR","voltage":6,"capacity_nominal_5h":344,"capacity_nominal_20h":420,"rc_25amp":850,"rc_75amp":220,"length":296,"width":176,"height":425,"total_height":425,"terminal_type":"M8","weight":52.0}'),
  ('a14c1e00-5002-4000-8000-000000000006', 'a14c1e00-3002-4000-8000-000000000006', '{"model_code":"KB8170TR","voltage":8,"capacity_nominal_5h":145,"capacity_nominal_20h":170,"rc_25amp":295,"rc_56amp":117,"length":260,"width":180,"height":248,"total_height":280,"terminal_type":"M8","weight":29.2}'),
  ('a14c1e00-5002-4000-8000-000000000007', 'a14c1e00-3002-4000-8000-000000000007', '{"model_code":"KB8190TR","voltage":8,"capacity_nominal_5h":155,"capacity_nominal_20h":190,"rc_25amp":340,"rc_56amp":132,"length":260,"width":180,"height":248,"total_height":280,"terminal_type":"M8","weight":31.5}'),
  ('a14c1e00-5002-4000-8000-000000000008', 'a14c1e00-3002-4000-8000-000000000008', '{"model_code":"KB12150TR","voltage":12,"capacity_nominal_5h":120,"capacity_nominal_20h":150,"rc_25amp":280,"rc_56amp":102,"length":328,"width":180,"height":248,"total_height":280,"terminal_type":"M8","weight":36.7}'),

  -- LEAD CARBON
  ('a14c1e00-5003-4000-8000-000000000001', 'a14c1e00-3003-4000-8000-000000000001', '{"model_code":"KBLC12750","voltage":12,"capacity_nominal_10h":75,"length":260,"width":169,"height":211,"total_height":218,"terminal_type":"M6","weight":25.0}'),
  ('a14c1e00-5003-4000-8000-000000000002', 'a14c1e00-3003-4000-8000-000000000002', '{"model_code":"KBLC121000","voltage":12,"capacity_nominal_10h":100,"length":330,"width":171,"height":216,"total_height":219,"terminal_type":"M8","weight":30.8}'),
  ('a14c1e00-5003-4000-8000-000000000003', 'a14c1e00-3003-4000-8000-000000000003', '{"model_code":"KBLC121500","voltage":12,"capacity_nominal_10h":150,"length":484,"width":170,"height":241,"total_height":241,"terminal_type":"M8","weight":47.0}'),
  ('a14c1e00-5003-4000-8000-000000000004', 'a14c1e00-3003-4000-8000-000000000004', '{"model_code":"KBLC121750","voltage":12,"capacity_nominal_10h":165,"length":532,"width":207,"height":214,"total_height":219,"terminal_type":"M8","weight":51.0}'),
  ('a14c1e00-5003-4000-8000-000000000005', 'a14c1e00-3003-4000-8000-000000000005', '{"model_code":"KBLC122000","voltage":12,"capacity_nominal_10h":200,"length":522,"width":240,"height":219,"total_height":222,"terminal_type":"M8","weight":61.5}'),
  ('a14c1e00-5003-4000-8000-000000000006', 'a14c1e00-3003-4000-8000-000000000006', '{"model_code":"KBLC122000S","voltage":12,"capacity_nominal_10h":200,"length":522,"width":268,"height":220,"total_height":226,"terminal_type":"M8","weight":75.6}'),
  ('a14c1e00-5003-4000-8000-000000000007', 'a14c1e00-3003-4000-8000-000000000007', '{"model_code":"KBLC122250","voltage":12,"capacity_nominal_10h":250,"length":520,"width":268,"height":220,"total_height":223,"terminal_type":"M8","weight":71.0}'),

  -- SOLAR GEL
  ('a14c1e00-5004-4000-8000-000000000001', 'a14c1e00-3004-4000-8000-000000000001', '{"model_code":"KBGS12800","voltage":12,"capacity_nominal_c100":80,"length":350,"width":166,"height":175,"total_height":175,"terminal_type":"M6","weight":21.0}'),
  ('a14c1e00-5004-4000-8000-000000000002', 'a14c1e00-3004-4000-8000-000000000002', '{"model_code":"KBGS121200","voltage":12,"capacity_nominal_c100":120,"length":330,"width":171,"height":216,"total_height":219,"terminal_type":"M8","weight":29.5}'),
  ('a14c1e00-5004-4000-8000-000000000003', 'a14c1e00-3004-4000-8000-000000000003', '{"model_code":"KBGS121400","voltage":12,"capacity_nominal_c100":140,"length":407,"width":173,"height":237,"total_height":237,"terminal_type":"M8","weight":33.5}'),
  ('a14c1e00-5004-4000-8000-000000000004', 'a14c1e00-3004-4000-8000-000000000004', '{"model_code":"KBGS121800","voltage":12,"capacity_nominal_c100":180,"length":484,"width":170,"height":241,"total_height":241,"terminal_type":"M8","weight":42.0}'),
  ('a14c1e00-5004-4000-8000-000000000005', 'a14c1e00-3004-4000-8000-000000000005', '{"model_code":"KBGS122500","voltage":12,"capacity_nominal_c100":250,"length":522,"width":240,"height":219,"total_height":222,"terminal_type":"M8","weight":57.0}'),

  -- DEEP CYCLE GEL
  ('a14c1e00-5005-4000-8000-000000000001', 'a14c1e00-3005-4000-8000-000000000001', '{"model_code":"KBG12300","voltage":12,"capacity_nominal_c10":33,"length":195,"width":130,"height":167,"total_height":167,"terminal_type":"M6","weight":10.0}'),
  ('a14c1e00-5005-4000-8000-000000000002', 'a14c1e00-3005-4000-8000-000000000002', '{"model_code":"KBG12400","voltage":12,"capacity_nominal_c10":40,"length":197,"width":165,"height":172,"total_height":172,"terminal_type":"M6","weight":13.2}'),
  ('a14c1e00-5005-4000-8000-000000000003', 'a14c1e00-3005-4000-8000-000000000003', '{"model_code":"KBG12550","voltage":12,"capacity_nominal_c10":55,"length":229,"width":138,"height":205,"total_height":208,"terminal_type":"M6","weight":16.5}'),
  ('a14c1e00-5005-4000-8000-000000000004', 'a14c1e00-3005-4000-8000-000000000004', '{"model_code":"KBG12650","voltage":12,"capacity_nominal_c10":65,"length":350,"width":166,"height":175,"total_height":175,"terminal_type":"M6","weight":21.0}'),
  ('a14c1e00-5005-4000-8000-000000000005', 'a14c1e00-3005-4000-8000-000000000005', '{"model_code":"KBG12800","voltage":12,"capacity_nominal_c10":80,"length":258,"width":168,"height":208,"total_height":211,"terminal_type":"M6","weight":24.0}'),
  ('a14c1e00-5005-4000-8000-000000000006', 'a14c1e00-3005-4000-8000-000000000006', '{"model_code":"KBG12900","voltage":12,"capacity_nominal_c10":90,"length":330,"width":171,"height":216,"total_height":219,"terminal_type":"M8","weight":27.0}'),
  ('a14c1e00-5005-4000-8000-000000000007', 'a14c1e00-3005-4000-8000-000000000007', '{"model_code":"KBG121000","voltage":12,"capacity_nominal_c10":100,"length":330,"width":171,"height":216,"total_height":219,"terminal_type":"M8","weight":29.5}'),
  ('a14c1e00-5005-4000-8000-000000000008', 'a14c1e00-3005-4000-8000-000000000008', '{"model_code":"KBG121200","voltage":12,"capacity_nominal_c10":120,"length":407,"width":173,"height":237,"total_height":237,"terminal_type":"M8","weight":33.5}'),
  ('a14c1e00-5005-4000-8000-000000000009', 'a14c1e00-3005-4000-8000-000000000009', '{"model_code":"KBG121500","voltage":12,"capacity_nominal_c10":150,"length":484,"width":170,"height":241,"total_height":241,"terminal_type":"M8","weight":42.5}'),
  ('a14c1e00-5005-4000-8000-00000000000a', 'a14c1e00-3005-4000-8000-00000000000a', '{"model_code":"KBG122000","voltage":12,"capacity_nominal_c10":200,"length":522,"width":240,"height":219,"total_height":222,"terminal_type":"M8","weight":57.0}'),
  ('a14c1e00-5005-4000-8000-00000000000b', 'a14c1e00-3005-4000-8000-00000000000b', '{"model_code":"KBG122500","voltage":12,"capacity_nominal_c10":250,"length":520,"width":268,"height":220,"total_height":223,"terminal_type":"M8","weight":71.0}'),

  -- WIND POWER
  ('a14c1e00-5006-4000-8000-000000000001', 'a14c1e00-3006-4000-8000-000000000001', '{"model_code":"KBL1272WP","voltage":12,"capacity_nominal_10h":7.2,"length":151,"width":64.5,"height":94,"total_height":99.5,"terminal_type":"F2","weight":2.50}'),
  ('a14c1e00-5006-4000-8000-000000000002', 'a14c1e00-3006-4000-8000-000000000002', '{"model_code":"KB12120WP","voltage":12,"capacity_nominal_10h":12,"length":151,"width":98,"height":94,"total_height":100,"terminal_type":"F2","weight":3.85}');

COMMIT;
