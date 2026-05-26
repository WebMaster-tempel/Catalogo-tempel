-- =============================================================================
-- Migration 016: Application Compatibility Matrix
--
-- Fuente: "Gama de productos Kaise Batteries" (pág. 3) y
--         "Aplicaciones vs Especificaciones"  (pág. 4) del catálogo oficial.
--
-- Changes:
--   1. Add suitability column to category_features
--      Values: 'best' (XX – aplicación óptima)
--              'suitable' (×  – aplicación compatible)
--              NULL → feature descriptiva clásica (sin cambios)
--   2. Add type='compatibility' entries for all 16 gammas
--      representing the canonical application matrix
-- =============================================================================

BEGIN;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. SCHEMA: add suitability column
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE category_features
    ADD COLUMN suitability VARCHAR(20) DEFAULT NULL;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. COMPATIBILITY MATRIX
--    type = 'compatibility'
--    suitability = 'best' (XX) | 'suitable' (×)
--    Only non-empty cells are inserted. NULL = no aplica
-- ─────────────────────────────────────────────────────────────────────────────

-- ── KAISE LITIO  (a11c1e00-1000-4000-8000-000000000001) ─────────────────────
INSERT INTO category_features (id, category_id, type, label, suitability, `order`) VALUES
    (UUID(), 'a11c1e00-1000-4000-8000-000000000001', 'compatibility', 'Telecomunicaciones',    'best',     1),
    (UUID(), 'a11c1e00-1000-4000-8000-000000000001', 'compatibility', 'Energías renovables',   'best',     8),
    (UUID(), 'a11c1e00-1000-4000-8000-000000000001', 'compatibility', 'UPS',                   'suitable', 2),
    (UUID(), 'a11c1e00-1000-4000-8000-000000000001', 'compatibility', 'TV por Cable',          'suitable', 4),
    (UUID(), 'a11c1e00-1000-4000-8000-000000000001', 'compatibility', 'Sanitario',             'suitable', 10);

-- ── KAISE STANDARD  (a11c1e00-1000-4000-8000-000000000002) ──────────────────
INSERT INTO category_features (id, category_id, type, label, suitability, `order`) VALUES
    (UUID(), 'a11c1e00-1000-4000-8000-000000000002', 'compatibility', 'Electrónica General',     'best',     6),
    (UUID(), 'a11c1e00-1000-4000-8000-000000000002', 'compatibility', 'Universal',               'best',     11),
    (UUID(), 'a11c1e00-1000-4000-8000-000000000002', 'compatibility', 'Telecomunicaciones',      'suitable', 1),
    (UUID(), 'a11c1e00-1000-4000-8000-000000000002', 'compatibility', 'UPS',                    'suitable', 2),
    (UUID(), 'a11c1e00-1000-4000-8000-000000000002', 'compatibility', 'Iluminación de Emergencia','suitable',3),
    (UUID(), 'a11c1e00-1000-4000-8000-000000000002', 'compatibility', 'TV por Cable',            'suitable', 4),
    (UUID(), 'a11c1e00-1000-4000-8000-000000000002', 'compatibility', 'Centrales Eléctricas',   'suitable', 5),
    (UUID(), 'a11c1e00-1000-4000-8000-000000000002', 'compatibility', 'Red Ferroviaria',        'suitable', 7);

-- ── KAISE LONG LIFE  (a11c1e00-1000-4000-8000-000000000003) ─────────────────
INSERT INTO category_features (id, category_id, type, label, suitability, `order`) VALUES
    (UUID(), 'a11c1e00-1000-4000-8000-000000000003', 'compatibility', 'UPS',                      'best',     2),
    (UUID(), 'a11c1e00-1000-4000-8000-000000000003', 'compatibility', 'Iluminación de Emergencia','suitable', 3),
    (UUID(), 'a11c1e00-1000-4000-8000-000000000003', 'compatibility', 'Electrónica General',      'suitable', 6),
    (UUID(), 'a11c1e00-1000-4000-8000-000000000003', 'compatibility', 'Red Ferroviaria',          'suitable', 7),
    (UUID(), 'a11c1e00-1000-4000-8000-000000000003', 'compatibility', 'Universal',                'suitable', 11);

-- ── KAISE ULTRA LONG LIFE  (a11c1e00-1000-4000-8000-000000000004) ───────────
INSERT INTO category_features (id, category_id, type, label, suitability, `order`) VALUES
    (UUID(), 'a11c1e00-1000-4000-8000-000000000004', 'compatibility', 'Telecomunicaciones',      'suitable', 1),
    (UUID(), 'a11c1e00-1000-4000-8000-000000000004', 'compatibility', 'UPS',                     'suitable', 2),
    (UUID(), 'a11c1e00-1000-4000-8000-000000000004', 'compatibility', 'Iluminación de Emergencia','suitable',3),
    (UUID(), 'a11c1e00-1000-4000-8000-000000000004', 'compatibility', 'Centrales Eléctricas',    'suitable', 5),
    (UUID(), 'a11c1e00-1000-4000-8000-000000000004', 'compatibility', 'Energías renovables',     'suitable', 8);

-- ── KAISE HIGH RATE  (a11c1e00-1000-4000-8000-000000000005) ─────────────────
INSERT INTO category_features (id, category_id, type, label, suitability, `order`) VALUES
    (UUID(), 'a11c1e00-1000-4000-8000-000000000005', 'compatibility', 'Telecomunicaciones',      'best', 1),
    (UUID(), 'a11c1e00-1000-4000-8000-000000000005', 'compatibility', 'UPS',                     'best', 2),
    (UUID(), 'a11c1e00-1000-4000-8000-000000000005', 'compatibility', 'Centrales Eléctricas',    'best', 5),
    (UUID(), 'a11c1e00-1000-4000-8000-000000000005', 'compatibility', 'Iluminación de Emergencia','suitable', 3);

-- ── KAISE SOLAR AGM  (a11c1e00-1000-4000-8000-000000000006) ─────────────────
INSERT INTO category_features (id, category_id, type, label, suitability, `order`) VALUES
    (UUID(), 'a11c1e00-1000-4000-8000-000000000006', 'compatibility', 'Centrales Eléctricas',    'best',     5),
    (UUID(), 'a11c1e00-1000-4000-8000-000000000006', 'compatibility', 'Energías renovables',     'best',     8),
    (UUID(), 'a11c1e00-1000-4000-8000-000000000006', 'compatibility', 'Telecomunicaciones',      'suitable', 1),
    (UUID(), 'a11c1e00-1000-4000-8000-000000000006', 'compatibility', 'Iluminación de Emergencia','suitable',3),
    (UUID(), 'a11c1e00-1000-4000-8000-000000000006', 'compatibility', 'Red Ferroviaria',         'suitable', 7);

-- ── KAISE DEEP CYCLE  (a11c1e00-1000-4000-8000-000000000007) ────────────────
INSERT INTO category_features (id, category_id, type, label, suitability, `order`) VALUES
    (UUID(), 'a11c1e00-1000-4000-8000-000000000007', 'compatibility', 'Movilidad',               'best',     9),
    (UUID(), 'a11c1e00-1000-4000-8000-000000000007', 'compatibility', 'Telecomunicaciones',      'suitable', 1),
    (UUID(), 'a11c1e00-1000-4000-8000-000000000007', 'compatibility', 'Iluminación de Emergencia','suitable',3),
    (UUID(), 'a11c1e00-1000-4000-8000-000000000007', 'compatibility', 'TV por Cable',            'suitable', 4),
    (UUID(), 'a11c1e00-1000-4000-8000-000000000007', 'compatibility', 'Electrónica General',     'suitable', 6),
    (UUID(), 'a11c1e00-1000-4000-8000-000000000007', 'compatibility', 'Red Ferroviaria',         'suitable', 7),
    (UUID(), 'a11c1e00-1000-4000-8000-000000000007', 'compatibility', 'Energías renovables',     'suitable', 8),
    (UUID(), 'a11c1e00-1000-4000-8000-000000000007', 'compatibility', 'Sanitario',               'suitable', 10);

-- ── KAISE FRONT TERMINAL  (a11c1e00-1000-4000-8000-000000000008) ─────────────
INSERT INTO category_features (id, category_id, type, label, suitability, `order`) VALUES
    (UUID(), 'a11c1e00-1000-4000-8000-000000000008', 'compatibility', 'Telecomunicaciones',   'best',     1),
    (UUID(), 'a11c1e00-1000-4000-8000-000000000008', 'compatibility', 'UPS',                  'suitable', 2),
    (UUID(), 'a11c1e00-1000-4000-8000-000000000008', 'compatibility', 'Energías renovables',  'suitable', 8);

-- ── KAISE HIGH TEMPERATURE  (a11c1e00-1000-4000-8000-000000000009) ───────────
INSERT INTO category_features (id, category_id, type, label, suitability, `order`) VALUES
    (UUID(), 'a11c1e00-1000-4000-8000-000000000009', 'compatibility', 'Telecomunicaciones',      'best',     1),
    (UUID(), 'a11c1e00-1000-4000-8000-000000000009', 'compatibility', 'Universal',               'best',     11),
    (UUID(), 'a11c1e00-1000-4000-8000-000000000009', 'compatibility', 'UPS',                    'suitable', 2),
    (UUID(), 'a11c1e00-1000-4000-8000-000000000009', 'compatibility', 'Iluminación de Emergencia','suitable',3),
    (UUID(), 'a11c1e00-1000-4000-8000-000000000009', 'compatibility', 'Energías renovables',    'suitable', 8);

-- ── KAISE LEAD CARBON  (a13c1e00-1000-4000-8000-000000000003) ───────────────
INSERT INTO category_features (id, category_id, type, label, suitability, `order`) VALUES
    (UUID(), 'a13c1e00-1000-4000-8000-000000000003', 'compatibility', 'Universal',               'best',     11),
    (UUID(), 'a13c1e00-1000-4000-8000-000000000003', 'compatibility', 'Iluminación de Emergencia','suitable',3),
    (UUID(), 'a13c1e00-1000-4000-8000-000000000003', 'compatibility', 'Centrales Eléctricas',   'suitable', 5);

-- ── KAISE WIND POWER  (a13c1e00-1000-4000-8000-000000000006) ────────────────
INSERT INTO category_features (id, category_id, type, label, suitability, `order`) VALUES
    (UUID(), 'a13c1e00-1000-4000-8000-000000000006', 'compatibility', 'Universal',               'best',     11),
    (UUID(), 'a13c1e00-1000-4000-8000-000000000006', 'compatibility', 'Telecomunicaciones',      'suitable', 1),
    (UUID(), 'a13c1e00-1000-4000-8000-000000000006', 'compatibility', 'UPS',                    'suitable', 2),
    (UUID(), 'a13c1e00-1000-4000-8000-000000000006', 'compatibility', 'Iluminación de Emergencia','suitable',3);

-- ── KAISE SOLAR GEL  (a13c1e00-1000-4000-8000-000000000004) ─────────────────
INSERT INTO category_features (id, category_id, type, label, suitability, `order`) VALUES
    (UUID(), 'a13c1e00-1000-4000-8000-000000000004', 'compatibility', 'Universal',               'best',     11),
    (UUID(), 'a13c1e00-1000-4000-8000-000000000004', 'compatibility', 'Telecomunicaciones',      'suitable', 1),
    (UUID(), 'a13c1e00-1000-4000-8000-000000000004', 'compatibility', 'Iluminación de Emergencia','suitable',3),
    (UUID(), 'a13c1e00-1000-4000-8000-000000000004', 'compatibility', 'Energías renovables',    'suitable', 8);

-- ── KAISE DEEP CYCLE GEL  (a13c1e00-1000-4000-8000-000000000005) ────────────
INSERT INTO category_features (id, category_id, type, label, suitability, `order`) VALUES
    (UUID(), 'a13c1e00-1000-4000-8000-000000000005', 'compatibility', 'Movilidad',          'best',     9),
    (UUID(), 'a13c1e00-1000-4000-8000-000000000005', 'compatibility', 'Energías renovables','suitable', 8),
    (UUID(), 'a13c1e00-1000-4000-8000-000000000005', 'compatibility', 'Universal',          'suitable', 11);

-- ── KAISE OPzV  (a15c1e00-1000-4000-8000-00000000000b) ──────────────────────
INSERT INTO category_features (id, category_id, type, label, suitability, `order`) VALUES
    (UUID(), 'a15c1e00-1000-4000-8000-00000000000b', 'compatibility', 'Telecomunicaciones',      'best',     1),
    (UUID(), 'a15c1e00-1000-4000-8000-00000000000b', 'compatibility', 'UPS',                     'best',     2),
    (UUID(), 'a15c1e00-1000-4000-8000-00000000000b', 'compatibility', 'Energías renovables',     'best',     8),
    (UUID(), 'a15c1e00-1000-4000-8000-00000000000b', 'compatibility', 'Iluminación de Emergencia','suitable',3),
    (UUID(), 'a15c1e00-1000-4000-8000-00000000000b', 'compatibility', 'Centrales Eléctricas',   'suitable', 5),
    (UUID(), 'a15c1e00-1000-4000-8000-00000000000b', 'compatibility', 'Universal',               'suitable', 11);

-- ── KAISE ELECTRIC VEHICLE  (a13c1e00-1000-4000-8000-000000000001) ───────────
INSERT INTO category_features (id, category_id, type, label, suitability, `order`) VALUES
    (UUID(), 'a13c1e00-1000-4000-8000-000000000001', 'compatibility', 'Movilidad', 'best',     9),
    (UUID(), 'a13c1e00-1000-4000-8000-000000000001', 'compatibility', 'Universal', 'suitable', 11);

-- ── KAISE ELECTRIC VEHICLE TRACCIÓN  (a13c1e00-1000-4000-8000-000000000002) ──
INSERT INTO category_features (id, category_id, type, label, suitability, `order`) VALUES
    (UUID(), 'a13c1e00-1000-4000-8000-000000000002', 'compatibility', 'Movilidad', 'best',     9),
    (UUID(), 'a13c1e00-1000-4000-8000-000000000002', 'compatibility', 'Universal', 'suitable', 11);

COMMIT;
