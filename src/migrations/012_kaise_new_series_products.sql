-- Migration 012: Products + attributes for HIGH RATE, SOLAR AGM, DEEP CYCLE, FRONT TERMINAL, HIGH TEMPERATURE
BEGIN;

-- =====================================================================
-- PRODUCTS
-- =====================================================================

-- KAISE HIGH RATE (18 products)
INSERT INTO products (id, name, slug, description, product_type_id, status) VALUES
  ('a11c1e00-3005-4000-8000-000000000001', 'KBHR690',     'kbhr690',     'Batería High Rate 6V 9Ah — terminal F2',         'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3005-4000-8000-000000000002', 'KBHR1254',    'kbhr1254',    'Batería High Rate 12V 5.4Ah — terminal F2',      'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3005-4000-8000-000000000003', 'KBHR1260',    'kbhr1260',    'Batería High Rate 12V 6Ah — terminal F1+F2',     'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3005-4000-8000-000000000004', 'KBHR1290',    'kbhr1290',    'Batería High Rate 12V 9Ah — terminal F2',        'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3005-4000-8000-000000000005', 'KBHR12120',   'kbhr12120',   'Batería High Rate 12V 12Ah — terminal F2',       'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3005-4000-8000-000000000006', 'KBHR12200',   'kbhr12200',   'Batería High Rate 12V 20Ah — terminal M5',       'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3005-4000-8000-000000000007', 'KBHR12260',   'kbhr12260',   'Batería High Rate 12V 26Ah — terminal M5',       'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3005-4000-8000-000000000008', 'KBHR12280',   'kbhr12280',   'Batería High Rate 12V 28Ah — terminal M5',       'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3005-4000-8000-000000000009', 'KBHR12350',   'kbhr12350',   'Batería High Rate 12V 35Ah — terminal M6',       'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3005-4000-8000-00000000000a', 'KBHR12450',   'kbhr12450',   'Batería High Rate 12V 45Ah — terminal M6',       'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3005-4000-8000-00000000000b', 'KBHR12550',   'kbhr12550',   'Batería High Rate 12V 55Ah — terminal M6',       'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3005-4000-8000-00000000000c', 'KBHR12650',   'kbhr12650',   'Batería High Rate 12V 65Ah — terminal M6',       'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3005-4000-8000-00000000000d', 'KBHR12820',   'kbhr12820',   'Batería High Rate 12V 82Ah — terminal M6',       'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3005-4000-8000-00000000000e', 'KBHR12900',   'kbhr12900',   'Batería High Rate 12V 95Ah — terminal M6',       'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3005-4000-8000-00000000000f', 'KBHR121000',  'kbhr121000',  'Batería High Rate 12V 100Ah — terminal M6',      'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3005-4000-8000-000000000010', 'KBHR121550',  'kbhr121550',  'Batería High Rate 12V 155Ah — terminal M6',      'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3005-4000-8000-000000000011', 'KBHR122200',  'kbhr122200',  'Batería High Rate 12V 225Ah — terminal M8',      'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3005-4000-8000-000000000012', 'KBHR122500',  'kbhr122500',  'Batería High Rate 12V 250Ah — terminal M8',      'a11c1e00-0000-4000-8000-000000000001', 'published'),

-- KAISE SOLAR AGM (7 products)
  ('a11c1e00-3006-4000-8000-000000000001', 'KBAS12800',   'kbas12800',   'Batería Solar AGM 12V 80Ah — terminal M6',       'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3006-4000-8000-000000000002', 'KBAS12900',   'kbas12900',   'Batería Solar AGM 12V 90Ah — terminal M6',       'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3006-4000-8000-000000000003', 'KBAS121200',  'kbas121200',  'Batería Solar AGM 12V 120Ah — terminal M8',      'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3006-4000-8000-000000000004', 'KBAS121400',  'kbas121400',  'Batería Solar AGM 12V 140Ah — terminal M8',      'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3006-4000-8000-000000000005', 'KBAS121600',  'kbas121600',  'Batería Solar AGM 12V 160Ah — terminal M8',      'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3006-4000-8000-000000000006', 'KBAS121800',  'kbas121800',  'Batería Solar AGM 12V 180Ah — terminal M8',      'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3006-4000-8000-000000000007', 'KBAS122500',  'kbas122500',  'Batería Solar AGM 12V 250Ah — terminal M8',      'a11c1e00-0000-4000-8000-000000000001', 'published'),

-- KAISE DEEP CYCLE (13 products)
  ('a11c1e00-3007-4000-8000-000000000001', 'KBC12260',    'kbc12260',    'Batería Deep Cycle 12V 26Ah — terminal M5',      'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3007-4000-8000-000000000002', 'KBC12280',    'kbc12280',    'Batería Deep Cycle 12V 28Ah — terminal M6',      'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3007-4000-8000-000000000003', 'KBC12330',    'kbc12330',    'Batería Deep Cycle 12V 33Ah — terminal M6',      'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3007-4000-8000-000000000004', 'KBC12450',    'kbc12450',    'Batería Deep Cycle 12V 45Ah — terminal M6',      'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3007-4000-8000-000000000005', 'KBC12550',    'kbc12550',    'Batería Deep Cycle 12V 55Ah — terminal M6',      'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3007-4000-8000-000000000006', 'KBC12650',    'kbc12650',    'Batería Deep Cycle 12V 65Ah — terminal M6',      'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3007-4000-8000-000000000007', 'KBC12750',    'kbc12750',    'Batería Deep Cycle 12V 70Ah — terminal M6',      'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3007-4000-8000-000000000008', 'KBC121000',   'kbc121000',   'Batería Deep Cycle 12V 100Ah — terminal M8',     'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3007-4000-8000-000000000009', 'KBC121200',   'kbc121200',   'Batería Deep Cycle 12V 120Ah — terminal M8',     'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3007-4000-8000-00000000000a', 'KBC121340',   'kbc121340',   'Batería Deep Cycle 12V 135Ah — terminal M8',     'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3007-4000-8000-00000000000b', 'KBC121500',   'kbc121500',   'Batería Deep Cycle 12V 150Ah — terminal M8',     'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3007-4000-8000-00000000000c', 'KBC122000',   'kbc122000',   'Batería Deep Cycle 12V 200Ah — terminal M8',     'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3007-4000-8000-00000000000d', 'KBC122300',   'kbc122300',   'Batería Deep Cycle 12V 230Ah — terminal M8',     'a11c1e00-0000-4000-8000-000000000001', 'published'),

-- KAISE FRONT TERMINAL (4 products)
  ('a11c1e00-3008-4000-8000-000000000001', 'KBF121000',   'kbf121000',   'Batería Front Terminal 12V 100Ah (394mm) — terminal M6',  'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3008-4000-8000-000000000002', 'KBF121050',   'kbf121050',   'Batería Front Terminal 12V 100Ah (508mm) — terminal M6',  'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3008-4000-8000-000000000003', 'KBF121550',   'kbf121550',   'Batería Front Terminal 12V 125Ah — terminal M8',          'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3008-4000-8000-000000000004', 'KBF122000',   'kbf122000',   'Batería Front Terminal 12V 200Ah — terminal M8',          'a11c1e00-0000-4000-8000-000000000001', 'published'),

-- KAISE HIGH TEMPERATURE (8 products)
  ('a11c1e00-3009-4000-8000-000000000001', 'KBHT22000',   'kbht22000',   'Batería High Temperature 2V 200Ah — terminal M8',   'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3009-4000-8000-000000000002', 'KBHT23000',   'kbht23000',   'Batería High Temperature 2V 300Ah — terminal M8',   'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3009-4000-8000-000000000003', 'KBHT25000',   'kbht25000',   'Batería High Temperature 2V 500Ah — terminal M8',   'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3009-4000-8000-000000000004', 'KBHT28000',   'kbht28000',   'Batería High Temperature 2V 800Ah — terminal M8',   'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3009-4000-8000-000000000005', 'KBHT210000',  'kbht210000',  'Batería High Temperature 2V 1000Ah — terminal M8',  'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3009-4000-8000-000000000006', 'KBHT121000',  'kbht121000',  'Batería High Temperature 12V 100Ah — terminal M6',  'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3009-4000-8000-000000000007', 'KBHT121500',  'kbht121500',  'Batería High Temperature 12V 150Ah — terminal M6',  'a11c1e00-0000-4000-8000-000000000001', 'published'),
  ('a11c1e00-3009-4000-8000-000000000008', 'KBHT122000',  'kbht122000',  'Batería High Temperature 12V 200Ah — terminal M8',  'a11c1e00-0000-4000-8000-000000000001', 'published');

-- =====================================================================
-- PRODUCT_CATEGORIES ASSIGNMENTS
-- =====================================================================
INSERT INTO product_categories (product_id, category_id) VALUES
  -- HIGH RATE
  ('a11c1e00-3005-4000-8000-000000000001', 'a11c1e00-1000-4000-8000-000000000005'),
  ('a11c1e00-3005-4000-8000-000000000002', 'a11c1e00-1000-4000-8000-000000000005'),
  ('a11c1e00-3005-4000-8000-000000000003', 'a11c1e00-1000-4000-8000-000000000005'),
  ('a11c1e00-3005-4000-8000-000000000004', 'a11c1e00-1000-4000-8000-000000000005'),
  ('a11c1e00-3005-4000-8000-000000000005', 'a11c1e00-1000-4000-8000-000000000005'),
  ('a11c1e00-3005-4000-8000-000000000006', 'a11c1e00-1000-4000-8000-000000000005'),
  ('a11c1e00-3005-4000-8000-000000000007', 'a11c1e00-1000-4000-8000-000000000005'),
  ('a11c1e00-3005-4000-8000-000000000008', 'a11c1e00-1000-4000-8000-000000000005'),
  ('a11c1e00-3005-4000-8000-000000000009', 'a11c1e00-1000-4000-8000-000000000005'),
  ('a11c1e00-3005-4000-8000-00000000000a', 'a11c1e00-1000-4000-8000-000000000005'),
  ('a11c1e00-3005-4000-8000-00000000000b', 'a11c1e00-1000-4000-8000-000000000005'),
  ('a11c1e00-3005-4000-8000-00000000000c', 'a11c1e00-1000-4000-8000-000000000005'),
  ('a11c1e00-3005-4000-8000-00000000000d', 'a11c1e00-1000-4000-8000-000000000005'),
  ('a11c1e00-3005-4000-8000-00000000000e', 'a11c1e00-1000-4000-8000-000000000005'),
  ('a11c1e00-3005-4000-8000-00000000000f', 'a11c1e00-1000-4000-8000-000000000005'),
  ('a11c1e00-3005-4000-8000-000000000010', 'a11c1e00-1000-4000-8000-000000000005'),
  ('a11c1e00-3005-4000-8000-000000000011', 'a11c1e00-1000-4000-8000-000000000005'),
  ('a11c1e00-3005-4000-8000-000000000012', 'a11c1e00-1000-4000-8000-000000000005'),
  -- SOLAR AGM
  ('a11c1e00-3006-4000-8000-000000000001', 'a11c1e00-1000-4000-8000-000000000006'),
  ('a11c1e00-3006-4000-8000-000000000002', 'a11c1e00-1000-4000-8000-000000000006'),
  ('a11c1e00-3006-4000-8000-000000000003', 'a11c1e00-1000-4000-8000-000000000006'),
  ('a11c1e00-3006-4000-8000-000000000004', 'a11c1e00-1000-4000-8000-000000000006'),
  ('a11c1e00-3006-4000-8000-000000000005', 'a11c1e00-1000-4000-8000-000000000006'),
  ('a11c1e00-3006-4000-8000-000000000006', 'a11c1e00-1000-4000-8000-000000000006'),
  ('a11c1e00-3006-4000-8000-000000000007', 'a11c1e00-1000-4000-8000-000000000006'),
  -- DEEP CYCLE
  ('a11c1e00-3007-4000-8000-000000000001', 'a11c1e00-1000-4000-8000-000000000007'),
  ('a11c1e00-3007-4000-8000-000000000002', 'a11c1e00-1000-4000-8000-000000000007'),
  ('a11c1e00-3007-4000-8000-000000000003', 'a11c1e00-1000-4000-8000-000000000007'),
  ('a11c1e00-3007-4000-8000-000000000004', 'a11c1e00-1000-4000-8000-000000000007'),
  ('a11c1e00-3007-4000-8000-000000000005', 'a11c1e00-1000-4000-8000-000000000007'),
  ('a11c1e00-3007-4000-8000-000000000006', 'a11c1e00-1000-4000-8000-000000000007'),
  ('a11c1e00-3007-4000-8000-000000000007', 'a11c1e00-1000-4000-8000-000000000007'),
  ('a11c1e00-3007-4000-8000-000000000008', 'a11c1e00-1000-4000-8000-000000000007'),
  ('a11c1e00-3007-4000-8000-000000000009', 'a11c1e00-1000-4000-8000-000000000007'),
  ('a11c1e00-3007-4000-8000-00000000000a', 'a11c1e00-1000-4000-8000-000000000007'),
  ('a11c1e00-3007-4000-8000-00000000000b', 'a11c1e00-1000-4000-8000-000000000007'),
  ('a11c1e00-3007-4000-8000-00000000000c', 'a11c1e00-1000-4000-8000-000000000007'),
  ('a11c1e00-3007-4000-8000-00000000000d', 'a11c1e00-1000-4000-8000-000000000007'),
  -- FRONT TERMINAL
  ('a11c1e00-3008-4000-8000-000000000001', 'a11c1e00-1000-4000-8000-000000000008'),
  ('a11c1e00-3008-4000-8000-000000000002', 'a11c1e00-1000-4000-8000-000000000008'),
  ('a11c1e00-3008-4000-8000-000000000003', 'a11c1e00-1000-4000-8000-000000000008'),
  ('a11c1e00-3008-4000-8000-000000000004', 'a11c1e00-1000-4000-8000-000000000008'),
  -- HIGH TEMPERATURE
  ('a11c1e00-3009-4000-8000-000000000001', 'a11c1e00-1000-4000-8000-000000000009'),
  ('a11c1e00-3009-4000-8000-000000000002', 'a11c1e00-1000-4000-8000-000000000009'),
  ('a11c1e00-3009-4000-8000-000000000003', 'a11c1e00-1000-4000-8000-000000000009'),
  ('a11c1e00-3009-4000-8000-000000000004', 'a11c1e00-1000-4000-8000-000000000009'),
  ('a11c1e00-3009-4000-8000-000000000005', 'a11c1e00-1000-4000-8000-000000000009'),
  ('a11c1e00-3009-4000-8000-000000000006', 'a11c1e00-1000-4000-8000-000000000009'),
  ('a11c1e00-3009-4000-8000-000000000007', 'a11c1e00-1000-4000-8000-000000000009'),
  ('a11c1e00-3009-4000-8000-000000000008', 'a11c1e00-1000-4000-8000-000000000009');

-- =====================================================================
-- PRODUCT ATTRIBUTE VALUES
-- =====================================================================
INSERT INTO product_attribute_values (id, product_id, attributes_json) VALUES
  -- HIGH RATE
  ('a11c1e00-5005-4000-8000-000000000001', 'a11c1e00-3005-4000-8000-000000000001', '{"model_code":"KBHR690","voltage":6,"capacity":9.0,"capacity_rate":"10min@9.6V","power_rating":153.48,"length":151,"width":34,"height":94,"total_height":100,"terminal_type":"F2","weight":1.4}'),
  ('a11c1e00-5005-4000-8000-000000000002', 'a11c1e00-3005-4000-8000-000000000002', '{"model_code":"KBHR1254","voltage":12,"capacity":5.4,"capacity_rate":"10min@9.6V","power_rating":170.52,"length":90,"width":70,"height":101,"total_height":107,"terminal_type":"F2","weight":1.5}'),
  ('a11c1e00-5005-4000-8000-000000000003', 'a11c1e00-3005-4000-8000-000000000003', '{"model_code":"KBHR1260","voltage":12,"capacity":6.0,"capacity_rate":"10min@9.6V","power_rating":180,"length":151,"width":51,"height":93,"total_height":99,"terminal_type":"F1+F2","weight":1.8}'),
  ('a11c1e00-5005-4000-8000-000000000004', 'a11c1e00-3005-4000-8000-000000000004', '{"model_code":"KBHR1290","voltage":12,"capacity":9.0,"capacity_rate":"10min@9.6V","power_rating":306.96,"length":151,"width":65,"height":94,"total_height":100,"terminal_type":"F2","weight":2.5}'),
  ('a11c1e00-5005-4000-8000-000000000005', 'a11c1e00-3005-4000-8000-000000000005', '{"model_code":"KBHR12120","voltage":12,"capacity":12,"capacity_rate":"10min@9.6V","power_rating":409.26,"length":151,"width":98,"height":95,"total_height":101,"terminal_type":"F2","weight":3.2}'),
  ('a11c1e00-5005-4000-8000-000000000006', 'a11c1e00-3005-4000-8000-000000000006', '{"model_code":"KBHR12200","voltage":12,"capacity":20,"capacity_rate":"10min@9.6V","power_rating":648,"length":181,"width":77,"height":167,"total_height":167,"terminal_type":"M5","weight":6.2}'),
  ('a11c1e00-5005-4000-8000-000000000007', 'a11c1e00-3005-4000-8000-000000000007', '{"model_code":"KBHR12260","voltage":12,"capacity":26,"capacity_rate":"10min@9.6V","power_rating":769.2,"length":166,"width":176,"height":125,"total_height":125,"terminal_type":"M5","weight":8.1}'),
  ('a11c1e00-5005-4000-8000-000000000008', 'a11c1e00-3005-4000-8000-000000000008', '{"model_code":"KBHR12280","voltage":12,"capacity":28,"capacity_rate":"10min@9.6V","power_rating":799.8,"length":164,"width":125,"height":174,"total_height":174,"terminal_type":"M5","weight":8.4}'),
  ('a11c1e00-5005-4000-8000-000000000009', 'a11c1e00-3005-4000-8000-000000000009', '{"model_code":"KBHR12350","voltage":12,"capacity":35,"capacity_rate":"10min@9.6V","power_rating":1211.4,"length":195,"width":130,"height":164,"total_height":167,"terminal_type":"M6","weight":10.4}'),
  ('a11c1e00-5005-4000-8000-00000000000a', 'a11c1e00-3005-4000-8000-00000000000a', '{"model_code":"KBHR12450","voltage":12,"capacity":45,"capacity_rate":"10min@9.6V","power_rating":1115.4,"length":197,"width":165,"height":170,"total_height":170,"terminal_type":"M6","weight":14.2}'),
  ('a11c1e00-5005-4000-8000-00000000000b', 'a11c1e00-3005-4000-8000-00000000000b', '{"model_code":"KBHR12550","voltage":12,"capacity":55,"capacity_rate":"10min@9.6V","power_rating":1864.2,"length":229,"width":138,"height":200,"total_height":203,"terminal_type":"M6","weight":17.7}'),
  ('a11c1e00-5005-4000-8000-00000000000c', 'a11c1e00-3005-4000-8000-00000000000c', '{"model_code":"KBHR12650","voltage":12,"capacity":65,"capacity_rate":"10min@9.6V","power_rating":1990.2,"length":348,"width":167,"height":178,"total_height":178,"terminal_type":"M6","weight":21.4}'),
  ('a11c1e00-5005-4000-8000-00000000000d', 'a11c1e00-3005-4000-8000-00000000000d', '{"model_code":"KBHR12820","voltage":12,"capacity":82,"capacity_rate":"10min@9.6V","power_rating":2592,"length":260,"width":168,"height":210,"total_height":210,"terminal_type":"M6","weight":25.0}'),
  ('a11c1e00-5005-4000-8000-00000000000e', 'a11c1e00-3005-4000-8000-00000000000e', '{"model_code":"KBHR12900","voltage":12,"capacity":95,"capacity_rate":"10min@9.6V","power_rating":3060,"length":307,"width":168,"height":211,"total_height":214,"terminal_type":"M6","weight":31.0}'),
  ('a11c1e00-5005-4000-8000-00000000000f', 'a11c1e00-3005-4000-8000-00000000000f', '{"model_code":"KBHR121000","voltage":12,"capacity":100,"capacity_rate":"10min@9.6V","power_rating":3195,"length":326,"width":170,"height":213,"total_height":216,"terminal_type":"M6","weight":31.6}'),
  ('a11c1e00-5005-4000-8000-000000000010', 'a11c1e00-3005-4000-8000-000000000010', '{"model_code":"KBHR121550","voltage":12,"capacity":155,"capacity_rate":"10min@9.6V","power_rating":4036.8,"length":335,"width":172,"height":275,"total_height":278,"terminal_type":"M6","weight":42.4}'),
  ('a11c1e00-5005-4000-8000-000000000011', 'a11c1e00-3005-4000-8000-000000000011', '{"model_code":"KBHR122200","voltage":12,"capacity":225,"capacity_rate":"10min@9.6V","power_rating":6348,"length":522,"width":240,"height":219,"total_height":224,"terminal_type":"M8","weight":72.0}'),
  ('a11c1e00-5005-4000-8000-000000000012', 'a11c1e00-3005-4000-8000-000000000012', '{"model_code":"KBHR122500","voltage":12,"capacity":250,"capacity_rate":"10min@9.6V","power_rating":6882,"length":521,"width":268,"height":220,"total_height":225,"terminal_type":"M8","weight":80.5}'),

  -- SOLAR AGM
  ('a11c1e00-5006-4000-8000-000000000001', 'a11c1e00-3006-4000-8000-000000000001', '{"model_code":"KBAS12800","voltage":12,"capacity":80,"capacity_rate":"C100","length":350,"width":166,"height":175,"total_height":175,"terminal_type":"M6","weight":19.5}'),
  ('a11c1e00-5006-4000-8000-000000000002', 'a11c1e00-3006-4000-8000-000000000002', '{"model_code":"KBAS12900","voltage":12,"capacity":90,"capacity_rate":"C100","length":258,"width":168,"height":212,"total_height":215,"terminal_type":"M6","weight":22.5}'),
  ('a11c1e00-5006-4000-8000-000000000003', 'a11c1e00-3006-4000-8000-000000000003', '{"model_code":"KBAS121200","voltage":12,"capacity":120,"capacity_rate":"C100","length":330,"width":171,"height":216,"total_height":219,"terminal_type":"M8","weight":29.5}'),
  ('a11c1e00-5006-4000-8000-000000000004', 'a11c1e00-3006-4000-8000-000000000004', '{"model_code":"KBAS121400","voltage":12,"capacity":140,"capacity_rate":"C100","length":407,"width":173,"height":237,"total_height":237,"terminal_type":"M8","weight":33.5}'),
  ('a11c1e00-5006-4000-8000-000000000005', 'a11c1e00-3006-4000-8000-000000000005', '{"model_code":"KBAS121600","voltage":12,"capacity":160,"capacity_rate":"C100","length":341,"width":173,"height":281,"total_height":286,"terminal_type":"M8","weight":41.5}'),
  ('a11c1e00-5006-4000-8000-000000000006', 'a11c1e00-3006-4000-8000-000000000006', '{"model_code":"KBAS121800","voltage":12,"capacity":180,"capacity_rate":"C100","length":484,"width":170,"height":241,"total_height":241,"terminal_type":"M8","weight":42.5}'),
  ('a11c1e00-5006-4000-8000-000000000007', 'a11c1e00-3006-4000-8000-000000000007', '{"model_code":"KBAS122500","voltage":12,"capacity":250,"capacity_rate":"C100","length":522,"width":240,"height":219,"total_height":222,"terminal_type":"M8","weight":59.0}'),

  -- DEEP CYCLE
  ('a11c1e00-5007-4000-8000-000000000001', 'a11c1e00-3007-4000-8000-000000000001', '{"model_code":"KBC12260","voltage":12,"capacity":26,"capacity_rate":"C10","length":166,"width":176,"height":125,"total_height":125,"terminal_type":"M5","weight":8.6}'),
  ('a11c1e00-5007-4000-8000-000000000002', 'a11c1e00-3007-4000-8000-000000000002', '{"model_code":"KBC12280","voltage":12,"capacity":28,"capacity_rate":"C10","length":165,"width":125,"height":174,"total_height":174,"terminal_type":"M6","weight":8.8}'),
  ('a11c1e00-5007-4000-8000-000000000003', 'a11c1e00-3007-4000-8000-000000000003', '{"model_code":"KBC12330","voltage":12,"capacity":33,"capacity_rate":"C10","length":195,"width":130,"height":167,"total_height":167,"terminal_type":"M6","weight":10.0}'),
  ('a11c1e00-5007-4000-8000-000000000004', 'a11c1e00-3007-4000-8000-000000000004', '{"model_code":"KBC12450","voltage":12,"capacity":45,"capacity_rate":"C10","length":197,"width":165,"height":172,"total_height":172,"terminal_type":"M6","weight":15.0}'),
  ('a11c1e00-5007-4000-8000-000000000005', 'a11c1e00-3007-4000-8000-000000000005', '{"model_code":"KBC12550","voltage":12,"capacity":55,"capacity_rate":"C10","length":229,"width":138,"height":205,"total_height":208,"terminal_type":"M6","weight":17.5}'),
  ('a11c1e00-5007-4000-8000-000000000006', 'a11c1e00-3007-4000-8000-000000000006', '{"model_code":"KBC12650","voltage":12,"capacity":65,"capacity_rate":"C10","length":350,"width":166,"height":175,"total_height":175,"terminal_type":"M6","weight":19.5}'),
  ('a11c1e00-5007-4000-8000-000000000007', 'a11c1e00-3007-4000-8000-000000000007', '{"model_code":"KBC12750","voltage":12,"capacity":70,"capacity_rate":"C10","length":258,"width":168,"height":212,"total_height":215,"terminal_type":"M6","weight":22.5}'),
  ('a11c1e00-5007-4000-8000-000000000008', 'a11c1e00-3007-4000-8000-000000000008', '{"model_code":"KBC121000","voltage":12,"capacity":100,"capacity_rate":"C10","length":330,"width":171,"height":216,"total_height":219,"terminal_type":"M8","weight":29.5}'),
  ('a11c1e00-5007-4000-8000-000000000009', 'a11c1e00-3007-4000-8000-000000000009', '{"model_code":"KBC121200","voltage":12,"capacity":120,"capacity_rate":"C10","length":407,"width":173,"height":237,"total_height":237,"terminal_type":"M8","weight":33.5}'),
  ('a11c1e00-5007-4000-8000-00000000000a', 'a11c1e00-3007-4000-8000-00000000000a', '{"model_code":"KBC121340","voltage":12,"capacity":135,"capacity_rate":"C10","length":341,"width":173,"height":281,"total_height":286,"terminal_type":"M8","weight":41.5}'),
  ('a11c1e00-5007-4000-8000-00000000000b', 'a11c1e00-3007-4000-8000-00000000000b', '{"model_code":"KBC121500","voltage":12,"capacity":150,"capacity_rate":"C10","length":484,"width":170,"height":241,"total_height":241,"terminal_type":"M8","weight":42.5}'),
  ('a11c1e00-5007-4000-8000-00000000000c', 'a11c1e00-3007-4000-8000-00000000000c', '{"model_code":"KBC122000","voltage":12,"capacity":200,"capacity_rate":"C10","length":522,"width":240,"height":219,"total_height":222,"terminal_type":"M8","weight":59.0}'),
  ('a11c1e00-5007-4000-8000-00000000000d', 'a11c1e00-3007-4000-8000-00000000000d', '{"model_code":"KBC122300","voltage":12,"capacity":230,"capacity_rate":"C10","length":521,"width":269,"height":204,"total_height":209,"terminal_type":"M8","weight":67.0}'),

  -- FRONT TERMINAL
  ('a11c1e00-5008-4000-8000-000000000001', 'a11c1e00-3008-4000-8000-000000000001', '{"model_code":"KBF121000","voltage":12,"capacity":100,"capacity_rate":"C10","length":394,"width":110,"height":286,"total_height":286,"terminal_type":"M6","weight":31.0}'),
  ('a11c1e00-5008-4000-8000-000000000002', 'a11c1e00-3008-4000-8000-000000000002', '{"model_code":"KBF121050","voltage":12,"capacity":100,"capacity_rate":"C10","length":508,"width":110,"height":239,"total_height":239,"terminal_type":"M6","weight":32.8}'),
  ('a11c1e00-5008-4000-8000-000000000003', 'a11c1e00-3008-4000-8000-000000000003', '{"model_code":"KBF121550","voltage":12,"capacity":125,"capacity_rate":"C10","length":551,"width":110,"height":288,"total_height":288,"terminal_type":"M8","weight":44.8}'),
  ('a11c1e00-5008-4000-8000-000000000004', 'a11c1e00-3008-4000-8000-000000000004', '{"model_code":"KBF122000","voltage":12,"capacity":200,"capacity_rate":"C10","length":560,"width":126,"height":320,"total_height":320,"terminal_type":"M8","weight":61.0}'),

  -- HIGH TEMPERATURE
  ('a11c1e00-5009-4000-8000-000000000001', 'a11c1e00-3009-4000-8000-000000000001', '{"model_code":"KBHT22000","voltage":2,"capacity":200,"capacity_rate":"C10","length":170,"width":110,"height":328,"total_height":348,"terminal_type":"M8","weight":13.5}'),
  ('a11c1e00-5009-4000-8000-000000000002', 'a11c1e00-3009-4000-8000-000000000002', '{"model_code":"KBHT23000","voltage":2,"capacity":300,"capacity_rate":"C10","length":170,"width":150,"height":328,"total_height":348,"terminal_type":"M8","weight":18.8}'),
  ('a11c1e00-5009-4000-8000-000000000003', 'a11c1e00-3009-4000-8000-000000000003', '{"model_code":"KBHT25000","voltage":2,"capacity":500,"capacity_rate":"C10","length":240,"width":175,"height":330,"total_height":350,"terminal_type":"M8","weight":30.0}'),
  ('a11c1e00-5009-4000-8000-000000000004', 'a11c1e00-3009-4000-8000-000000000004', '{"model_code":"KBHT28000","voltage":2,"capacity":800,"capacity_rate":"C10","length":410,"width":175,"height":330,"total_height":350,"terminal_type":"M8","weight":50.4}'),
  ('a11c1e00-5009-4000-8000-000000000005', 'a11c1e00-3009-4000-8000-000000000005', '{"model_code":"KBHT210000","voltage":2,"capacity":1000,"capacity_rate":"C10","length":475,"width":175,"height":328,"total_height":350,"terminal_type":"M8","weight":60.0}'),
  ('a11c1e00-5009-4000-8000-000000000006', 'a11c1e00-3009-4000-8000-000000000006', '{"model_code":"KBHT121000","voltage":12,"capacity":100,"capacity_rate":"C10","length":394,"width":110,"height":286,"total_height":286,"terminal_type":"M6","weight":31.5}'),
  ('a11c1e00-5009-4000-8000-000000000007', 'a11c1e00-3009-4000-8000-000000000007', '{"model_code":"KBHT121500","voltage":12,"capacity":150,"capacity_rate":"C10","length":551,"width":110,"height":288,"total_height":288,"terminal_type":"M6","weight":46.6}'),
  ('a11c1e00-5009-4000-8000-000000000008', 'a11c1e00-3009-4000-8000-000000000008', '{"model_code":"KBHT122000","voltage":12,"capacity":200,"capacity_rate":"C10","length":560,"width":126,"height":320,"total_height":320,"terminal_type":"M8","weight":59.5}');

COMMIT;
