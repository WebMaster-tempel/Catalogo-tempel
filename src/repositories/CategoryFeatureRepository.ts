import { v4 as uuidv4 } from 'uuid';
import { BaseRepository } from './BaseRepository';
import { DbPool } from '../database/connection';
import { CategoryFeature } from '../types';

export class CategoryFeatureRepository extends BaseRepository {
  constructor(db: DbPool) {
    super(db, 'category_features');
  }

  async findByCategoryId(categoryId: string): Promise<CategoryFeature[]> {
    const [rows] = await this.db.execute(
      'SELECT * FROM category_features WHERE category_id = ? ORDER BY type, `order`',
      [categoryId]
    );
    return rows as CategoryFeature[];
  }

  async findByType(categoryId: string, type: string): Promise<CategoryFeature[]> {
    const [rows] = await this.db.execute(
      'SELECT * FROM category_features WHERE category_id = ? AND type = ? ORDER BY `order`',
      [categoryId, type]
    );
    return rows as CategoryFeature[];
  }

  async create(data: Omit<CategoryFeature, 'id' | 'created_at' | 'updated_at'>): Promise<CategoryFeature> {
    const id = uuidv4();
    await this.db.execute(
      'INSERT INTO category_features (id, category_id, type, label, `order`) VALUES (?, ?, ?, ?, ?)',
      [id, data.category_id, data.type, data.label, data.order ?? 0]
    );
    return this.findById(id);
  }

  async update(id: string, data: Partial<CategoryFeature>): Promise<CategoryFeature> {
    const allowed = ['label', 'type', 'order'];
    const setClauses: string[] = [];
    const values: any[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (allowed.includes(key) && value !== undefined) {
        setClauses.push(`\`${key}\` = ?`);
        values.push(value);
      }
    });

    if (setClauses.length > 0) {
      setClauses.push('updated_at = NOW()');
      values.push(id);
      await this.db.execute(
        `UPDATE category_features SET ${setClauses.join(', ')} WHERE id = ?`,
        values
      );
    }

    return this.findById(id);
  }

  // Uses a real transaction via pool connection instead of pg-promise's db.tx()
  async reorder(categoryId: string, featureIds: string[]): Promise<void> {
    const conn = await this.db.getConnection();
    try {
      await conn.beginTransaction();
      for (const [index, id] of featureIds.entries()) {
        await conn.execute(
          'UPDATE category_features SET `order` = ? WHERE id = ?',
          [index + 1, id]
        );
      }
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  async deleteByCategoryId(categoryId: string): Promise<boolean> {
    const [result] = await this.db.execute(
      'DELETE FROM category_features WHERE category_id = ?',
      [categoryId]
    ) as any[];
    return result.affectedRows > 0;
  }
}
