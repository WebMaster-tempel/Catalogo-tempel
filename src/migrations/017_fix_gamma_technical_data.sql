-- =============================================================================
-- Migration 017: Corrección de datos técnicos de gammas
--
-- Fuente autorizada: Catálogo oficial Kaise Batteries
--   - Tabla "Gama de Productos Kaise Batteries" (pág. 3)
--   - Tabla "Aplicaciones vs Especificaciones"   (pág. 4)
--
-- Correcciones:
--   1. eurobat = TRUE para todas las gammas VRLA/AGM/GEL
--   2. plate_type 'Tubular' → 'Flat' donde el catálogo indica Flat
--        (Solar AGM tenía 'AGM'; Deep Cycle, Solar Gel, Deep Cycle Gel tenían 'Tubular')
--   3. technology 'VRLA' → 'VRLA-AGM' para Wind Power
--   4. design_life_years nulos rellenados con valores del catálogo
--   5. cycles nulos rellenados con valores del catálogo
-- =============================================================================

BEGIN;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. EUROBAT — todas las gammas VRLA/GEL certificadas (excepto Litio)
-- ─────────────────────────────────────────────────────────────────────────────
UPDATE categories
SET eurobat = TRUE, updated_at = CURRENT_TIMESTAMP
WHERE id IN (
    'a11c1e00-1000-4000-8000-000000000002',  -- KAISE STANDARD         (ya era TRUE)
    'a11c1e00-1000-4000-8000-000000000003',  -- KAISE LONG LIFE        (ya era TRUE)
    'a11c1e00-1000-4000-8000-000000000004',  -- KAISE ULTRA LONG LIFE  (ya era TRUE)
    'a11c1e00-1000-4000-8000-000000000005',  -- KAISE HIGH RATE        FALSE→TRUE
    'a11c1e00-1000-4000-8000-000000000006',  -- KAISE SOLAR            FALSE→TRUE
    'a11c1e00-1000-4000-8000-000000000007',  -- KAISE DEEP CYCLE       FALSE→TRUE
    'a11c1e00-1000-4000-8000-000000000008',  -- KAISE FRONT TERMINAL   FALSE→TRUE
    'a11c1e00-1000-4000-8000-000000000009',  -- KAISE HIGH TEMPERATURE FALSE→TRUE
    'a13c1e00-1000-4000-8000-000000000001',  -- KAISE ELECTRIC VEHICLE FALSE→TRUE
    'a13c1e00-1000-4000-8000-000000000002',  -- KAISE EV TRACCIÓN      FALSE→TRUE
    'a13c1e00-1000-4000-8000-000000000003',  -- KAISE LEAD CARBON      FALSE→TRUE
    'a13c1e00-1000-4000-8000-000000000004',  -- KAISE SOLAR GEL        FALSE→TRUE
    'a13c1e00-1000-4000-8000-000000000005',  -- KAISE DEEP CYCLE GEL   FALSE→TRUE
    'a13c1e00-1000-4000-8000-000000000006',  -- KAISE WIND POWER       FALSE→TRUE
    'a15c1e00-1000-4000-8000-00000000000b'   -- KAISE OPzV             FALSE→TRUE
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. PLATE_TYPE — correcciones de tipo de placa
-- ─────────────────────────────────────────────────────────────────────────────

-- KAISE SOLAR: tenía 'AGM' → el catálogo indica 'Flat'
UPDATE categories SET plate_type = 'Flat', updated_at = CURRENT_TIMESTAMP
WHERE id = 'a11c1e00-1000-4000-8000-000000000006';

-- KAISE DEEP CYCLE: tenía 'Tubular' → el catálogo indica 'Flat'
UPDATE categories SET plate_type = 'Flat', updated_at = CURRENT_TIMESTAMP
WHERE id = 'a11c1e00-1000-4000-8000-000000000007';

-- KAISE SOLAR GEL: tenía 'Tubular' → el catálogo indica 'Flat'
UPDATE categories SET plate_type = 'Flat', updated_at = CURRENT_TIMESTAMP
WHERE id = 'a13c1e00-1000-4000-8000-000000000004';

-- KAISE DEEP CYCLE GEL: tenía 'Tubular' → el catálogo indica 'Flat'
UPDATE categories SET plate_type = 'Flat', updated_at = CURRENT_TIMESTAMP
WHERE id = 'a13c1e00-1000-4000-8000-000000000005';

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. TECHNOLOGY — correcciones de tecnología
-- ─────────────────────────────────────────────────────────────────────────────

-- KAISE WIND POWER: tenía 'VRLA' → el catálogo indica 'VRLA-AGM'
UPDATE categories SET technology = 'VRLA-AGM', updated_at = CURRENT_TIMESTAMP
WHERE id = 'a13c1e00-1000-4000-8000-000000000006';

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. DESIGN_LIFE_YEARS — rellenar valores nulos
-- ─────────────────────────────────────────────────────────────────────────────

-- KAISE SOLAR: catálogo pág.3 → 8-12 años
UPDATE categories SET design_life_years = '8-12 años', updated_at = CURRENT_TIMESTAMP
WHERE id = 'a11c1e00-1000-4000-8000-000000000006';

-- KAISE DEEP CYCLE: catálogo pág.3 → 10 años
UPDATE categories SET design_life_years = '10 años', updated_at = CURRENT_TIMESTAMP
WHERE id = 'a11c1e00-1000-4000-8000-000000000007';

-- KAISE WIND POWER: catálogo pág.4 → 10-12 años
UPDATE categories SET design_life_years = '10-12 años', updated_at = CURRENT_TIMESTAMP
WHERE id = 'a13c1e00-1000-4000-8000-000000000006';

-- KAISE SOLAR GEL: catálogo pág.4 → 10-12 años
UPDATE categories SET design_life_years = '10-12 años', updated_at = CURRENT_TIMESTAMP
WHERE id = 'a13c1e00-1000-4000-8000-000000000004';

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. CYCLES — rellenar valores nulos
-- ─────────────────────────────────────────────────────────────────────────────

-- KAISE SOLAR: catálogo pág.3 → ≈2250
UPDATE categories SET cycles = '≈2250', updated_at = CURRENT_TIMESTAMP
WHERE id = 'a11c1e00-1000-4000-8000-000000000006';

-- KAISE DEEP CYCLE: catálogo pág.3 → ≈1500-1700
UPDATE categories SET cycles = '≈1500-1700', updated_at = CURRENT_TIMESTAMP
WHERE id = 'a11c1e00-1000-4000-8000-000000000007';

-- KAISE SOLAR GEL: catálogo pág.4 → ≈1200
UPDATE categories SET cycles = '≈1200', updated_at = CURRENT_TIMESTAMP
WHERE id = 'a13c1e00-1000-4000-8000-000000000004';

-- KAISE DEEP CYCLE GEL: catálogo pág.4 → +1.200
UPDATE categories SET cycles = '+1.200', updated_at = CURRENT_TIMESTAMP
WHERE id = 'a13c1e00-1000-4000-8000-000000000005';

-- KAISE OPzV: catálogo pág.4 → +3.500
UPDATE categories SET cycles = '+3.500', updated_at = CURRENT_TIMESTAMP
WHERE id = 'a15c1e00-1000-4000-8000-00000000000b';

-- KAISE ELECTRIC VEHICLE: catálogo pág.4 → ≈1200
UPDATE categories SET cycles = '≈1200', updated_at = CURRENT_TIMESTAMP
WHERE id = 'a13c1e00-1000-4000-8000-000000000001';

-- KAISE EV TRACCIÓN: catálogo pág.4 → ≈1200
UPDATE categories SET cycles = '≈1200', updated_at = CURRENT_TIMESTAMP
WHERE id = 'a13c1e00-1000-4000-8000-000000000002';

COMMIT;
