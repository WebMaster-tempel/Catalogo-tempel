-- =============================================================================
-- Migration 022: Set technology = 'Lead Carbon' for KAISE LEAD CARBON gamma
--
-- Previously the gamma had technology = 'VRLA-AGM' which made ?technology=Lead+Carbon
-- return 0 results. The Lead Carbon series is technically a VRLA-AGM variant but
-- deserves its own technology tag so the filter works correctly.
-- =============================================================================

BEGIN;

UPDATE categories
    SET technology = 'Lead Carbon', updated_at = CURRENT_TIMESTAMP
    WHERE id = 'a13c1e00-1000-4000-8000-000000000003';

COMMIT;
