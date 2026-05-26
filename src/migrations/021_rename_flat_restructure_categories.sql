-- =============================================================================
-- Migration 021: Rename plate_type Flat→Plana, restructure category hierarchy
--
-- Changes:
--   1. plate_type 'Flat' → 'Plana' in all categories
--   2. Plomo Carbono (Lead Carbon) → moved inside AGM as subfamily
--   3. Alta Temperatura → moved inside AGM as subfamily
--   4. 'Gel Puro' → 'GEL Puro', 'Gel Híbrido' → 'GEL Híbrido'
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 1. RENAME plate_type 'Flat' → 'Plana'
-- -----------------------------------------------------------------------------

UPDATE categories
    SET plate_type = 'Plana', updated_at = CURRENT_TIMESTAMP
    WHERE plate_type = 'Flat';

-- -----------------------------------------------------------------------------
-- 2. PLOMO CARBONO → inside AGM (as Level 3 subfamily)
--    a15c1e00-1000-4000-8000-000000000004 was under Plomo Ácido (000000000003)
--    → now under AGM (a15c1e00-1000-4000-8000-000000000006)
-- -----------------------------------------------------------------------------

UPDATE categories
    SET parent_id = 'a15c1e00-1000-4000-8000-000000000006', updated_at = CURRENT_TIMESTAMP
    WHERE id = 'a15c1e00-1000-4000-8000-000000000004';

-- -----------------------------------------------------------------------------
-- 3. ALTA TEMPERATURA → inside AGM (as Level 4 subfamily)
--    a15c1e00-1000-4000-8000-000000000008 was under VRLA (000000000005)
--    → now under AGM (a15c1e00-1000-4000-8000-000000000006)
-- -----------------------------------------------------------------------------

UPDATE categories
    SET parent_id = 'a15c1e00-1000-4000-8000-000000000006', updated_at = CURRENT_TIMESTAMP
    WHERE id = 'a15c1e00-1000-4000-8000-000000000008';

-- -----------------------------------------------------------------------------
-- 4. GEL → uppercase in structural category names
-- -----------------------------------------------------------------------------

UPDATE categories
    SET name = 'GEL Puro', updated_at = CURRENT_TIMESTAMP
    WHERE id = 'a15c1e00-1000-4000-8000-000000000009';

UPDATE categories
    SET name = 'GEL Híbrido', updated_at = CURRENT_TIMESTAMP
    WHERE id = 'a15c1e00-1000-4000-8000-00000000000a';

COMMIT;
