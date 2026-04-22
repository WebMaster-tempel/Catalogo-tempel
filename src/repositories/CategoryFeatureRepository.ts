import { IDatabase } from 'pg-promise';
import { BaseRepository } from './BaseRepository';
import { CategoryFeature } from '../types';

export class CategoryFeatureRepository extends BaseRepository {
  constructor(db: IDatabase<any>) {
    super(db, 'category_features');
  }

  async findByCategoryId(categoryId: string): Promise<CategoryFeature[]> {
    return this.db.any(
      'SELECT * FROM category_features WHERE category_id = $1 ORDER BY type, "order"',
      [categoryId]
    );
  }

  async findByType(categoryId: string, type: string): Promise<CategoryFeature[]> {
    return this.db.any(
      'SELECT * FROM category_features WHERE category_id = $1 AND type = $2 ORDER BY "order"',
      [categoryId, type]
    );
  }

  async create(data: Omit<CategoryFeature, 'id' | 'created_at' | 'updated_at'>): Promise<CategoryFeature> {
    return this.db.one(
      `INSERT INTO category_features (category_id, type, label, "order")
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.category_id, data.type, data.label, data.order || 0]
    );
  }

  async update(id: string, data: Partial<CategoryFeature>): Promise<CategoryFeature> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    const allowed = ['label', 'type', 'order'];
    Object.entries(data).forEach(([key, value]) => {
      if (allowed.includes(key) && value !== undefined) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });

    if (fields.length === 0) {
      return this.db.one('SELECT * FROM category_features WHERE id = $1', [id]);
    }

    fields.push(`updated_at = $${paramIndex}`);
    values.push(new Date());
    values.push(id);

    return this.db.one(
      `UPDATE category_features SET ${fields.join(', ')} WHERE id = $${paramIndex + 1} RETURNING *`,
      values
    );
  }

  async reorder(categoryId: string, featureIds: string[]): Promise<void> {
    const queries = featureIds.map((id, index) =>
      this.db.none('UPDATE category_features SET "order" = $1 WHERE id = $2', [index + 1, id])
    );
    await this.db.tx((t) => t.batch(queries));
  }

  async deleteByCategoryId(categoryId: string): Promise<boolean> {
    const result = await this.db.result(
      'DELETE FROM category_features WHERE category_id = $1',
      [categoryId]
    );
    return result.rowCount > 0;
  }
}
