CREATE TABLE IF NOT EXISTS category_features (
  id CHAR(36) PRIMARY KEY,
  category_id CHAR(36) NOT NULL,
  type VARCHAR(50) NOT NULL,
  label VARCHAR(255) NOT NULL,
  `order` INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_cf_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_category_features_category_id ON category_features(category_id);
CREATE INDEX idx_category_features_type ON category_features(type);
CREATE INDEX idx_category_features_order ON category_features(category_id, type, `order`)
