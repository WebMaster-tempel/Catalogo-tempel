ALTER TABLE categories
    ADD COLUMN technology VARCHAR(100),
    ADD COLUMN plate_type VARCHAR(100),
    ADD COLUMN design_life_years VARCHAR(50),
    ADD COLUMN cycles VARCHAR(100),
    ADD COLUMN capacity_range VARCHAR(100),
    ADD COLUMN applications TEXT,
    ADD COLUMN eurobat TINYINT(1) DEFAULT 0,
    ADD COLUMN characteristics TEXT;

CREATE INDEX idx_categories_technology ON categories(technology)
