-- Extend categories table with battery-specific metadata fields
ALTER TABLE categories
    ADD COLUMN IF NOT EXISTS technology VARCHAR(100),
    ADD COLUMN IF NOT EXISTS plate_type VARCHAR(100),
    ADD COLUMN IF NOT EXISTS design_life_years VARCHAR(50),
    ADD COLUMN IF NOT EXISTS cycles VARCHAR(100),
    ADD COLUMN IF NOT EXISTS capacity_range VARCHAR(100),
    ADD COLUMN IF NOT EXISTS applications TEXT,
    ADD COLUMN IF NOT EXISTS eurobat BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS characteristics TEXT;

-- Add index on technology for filtering
CREATE INDEX IF NOT EXISTS idx_categories_technology ON categories(technology);
