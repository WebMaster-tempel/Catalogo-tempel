import { DbPool } from '../database/connection';
import { BaseRepository } from './BaseRepository';
import { CategoryFeature } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class CategoryFeatureRepository extends BaseRepository {
  constructor(db: DbPool) {
    super(db, 'category_features');
  }

  async findByCategoryId(categoryId: string): Promise<CategoryFeature[]> {
    const [rows] = await this.db.query(
      'SELECT * FROM category_features WHERE category_id = ? ORDER BY type, `order`',
      [categoryId]
    );
    return rows as any[];
  }

  async findByType(categoryId: string, type: string): Promise<CategoryFeature[]> {
    const validTypes = ['application', 'characteristic'];
    const validType = validTypes.includes(type) ? type : 'application';
    const [rows] = await this.db.query(
      'SELECT * FROM category_features WHERE category_id = ? AND type = ? ORDER BY `order`',
      [categoryId, validType]
    );
    return rows as any[];
  }

  async create(data: Omit<CategoryFeature, 'id' | 'created_at' | 'updated_at'>): Promise<CategoryFeature> {
    const id = uuidv4();
    await this.db.query(
      'INSERT INTO category_features (id, category_id, type, label, `order`) VALUES (?, ?, ?, ?, ?)',
      [id, data.category_id, data.type, data.label, data.order || 0]
    );
    return this.findById(id);
  }

  async update(id: string, data: Partial<CategoryFeature>): Promise<CategoryFeature> {
    const fields: string[] = [];
    const values: any[] = [];

    const allowed = ['label', 'type', 'order'];
    Object.entries(data).forEach(([key, value]) => {
      if (allowed.includes(key) && value !== undefined) {
        fields.push(`\`${key}\` = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) return this.findById(id);

    fields.push('updated_at = ?');
    values.push(new Date());
    values.push(id);

    await this.db.query(`UPDATE category_features SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  async reorder(categoryId: string, featureIds: string[]): Promise<void> {
    for (let i = 0; i < featureIds.length; i++) {
      await this.db.query(
        'UPDATE category_features SET `order` = ? WHERE id = ? AND category_id = ?',
        [i + 1, featureIds[i], categoryId]
      );
    }
  }

  async deleteByCategoryId(categoryId: string): Promise<boolean> {
    const [result] = await this.db.query(
      'DELETE FROM category_features WHERE category_id = ?',
      [categoryId]
    );
    return (result as any).affectedRows > 0;
  }
}
