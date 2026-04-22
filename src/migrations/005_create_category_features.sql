-- Create category_features table for key points (applications, characteristics, etc.)
CREATE TABLE IF NOT EXISTS category_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,  -- 'application', 'characteristic'
  label VARCHAR(255) NOT NULL,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_category_features_category_id ON category_features(category_id);
CREATE INDEX IF NOT EXISTS idx_category_features_type ON category_features(type);
CREATE INDEX IF NOT EXISTS idx_category_features_order ON category_features(category_id, type, "order");
