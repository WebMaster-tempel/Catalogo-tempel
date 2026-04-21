import { IDatabase } from 'pg-promise';
import { BaseRepository } from './BaseRepository';
import { Category, ProductCategory } from '../types';

export class CategoryRepository extends BaseRepository {
  constructor(db: IDatabase<any>) {
    super(db, 'categories');
  }

  async create(data: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
    return this.db.one(
      `INSERT INTO categories (name, slug, parent_id, description)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.name, data.slug, data.parent_id, data.description]
    );
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return this.db.oneOrNone('SELECT * FROM categories WHERE slug = $1', [slug]);
  }

  async update(id: string, data: Partial<Category>): Promise<Category> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id' && key !== 'created_at') {
        fields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });

    if (fields.length === 0) {
      return this.db.one('SELECT * FROM categories WHERE id = $1', [id]);
    }

    fields.push(`updated_at = $${paramIndex}`);
    values.push(new Date());
    values.push(id);

    return this.db.one(
      `UPDATE categories SET ${fields.join(', ')} WHERE id = $${paramIndex + 1} RETURNING *`,
      values
    );
  }

  async getHierarchyTree(): Promise<any[]> {
    return this.db.any(
      `WITH RECURSIVE category_tree AS (
         SELECT id, name, slug, parent_id, 0 as level
         FROM categories WHERE parent_id IS NULL
         UNION ALL
         SELECT c.id, c.name, c.slug, c.parent_id, ct.level + 1
         FROM categories c
         JOIN category_tree ct ON c.parent_id = ct.id
       )
       SELECT * FROM category_tree ORDER BY level, name`
    );
  }

  async getChildCategories(parentId: string): Promise<Category[]> {
    return this.db.any('SELECT * FROM categories WHERE parent_id = $1 ORDER BY name', [parentId]);
  }

  async assignProduct(productId: string, categoryId: string): Promise<ProductCategory> {
    return this.db.one(
      `INSERT INTO product_categories (product_id, category_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING
       RETURNING *`,
      [productId, categoryId]
    );
  }

  async removeProduct(productId: string, categoryId: string): Promise<boolean> {
    const result = await this.db.result(
      `DELETE FROM product_categories WHERE product_id = $1 AND category_id = $2`,
      [productId, categoryId]
    );
    return result.rowCount > 0;
  }

  async getProductCategories(productId: string): Promise<Category[]> {
    return this.db.any(
      `SELECT c.* FROM categories c
       JOIN product_categories pc ON c.id = pc.category_id
       WHERE pc.product_id = $1`,
      [productId]
    );
  }
}
