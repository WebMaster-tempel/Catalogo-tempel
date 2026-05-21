import { DbPool } from '../database/connection';
import { BaseRepository } from './BaseRepository';
import { Category, ProductCategory } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class CategoryRepository extends BaseRepository {
  constructor(db: DbPool) {
    super(db, 'categories');
  }

  async create(data: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
    const id = uuidv4();
    await this.db.query(
      `INSERT INTO categories (id, name, slug, parent_id, description) VALUES (?, ?, ?, ?, ?)`,
      [id, data.name, data.slug, data.parent_id, data.description]
    );
    return this.findById(id);
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const [rows] = await this.db.query('SELECT * FROM categories WHERE slug = ?', [slug]);
    return (rows as any[])[0] || null;
  }

  async update(id: string, data: Partial<Category>): Promise<Category> {
    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id' && key !== 'created_at') {
        fields.push(`\`${key}\` = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) return this.findById(id);

    fields.push('updated_at = ?');
    values.push(new Date());
    values.push(id);

    await this.db.query(`UPDATE categories SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  async getHierarchyTree(): Promise<any[]> {
    const [rows] = await this.db.query(
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
    return rows as any[];
  }

  async getChildCategories(parentId: string): Promise<Category[]> {
    const [rows] = await this.db.query(
      'SELECT * FROM categories WHERE parent_id = ? ORDER BY name',
      [parentId]
    );
    return rows as any[];
  }

  async assignProduct(productId: string, categoryId: string): Promise<ProductCategory> {
    await this.db.query(
      `INSERT IGNORE INTO product_categories (product_id, category_id) VALUES (?, ?)`,
      [productId, categoryId]
    );
    const [rows] = await this.db.query(
      'SELECT * FROM product_categories WHERE product_id = ? AND category_id = ?',
      [productId, categoryId]
    );
    return (rows as any[])[0];
  }

  async removeProduct(productId: string, categoryId: string): Promise<boolean> {
    const [result] = await this.db.query(
      'DELETE FROM product_categories WHERE product_id = ? AND category_id = ?',
      [productId, categoryId]
    );
    return (result as any).affectedRows > 0;
  }

  async getProductCategories(productId: string): Promise<Category[]> {
    const [rows] = await this.db.query(
      `SELECT c.* FROM categories c
       JOIN product_categories pc ON c.id = pc.category_id
       WHERE pc.product_id = ?`,
      [productId]
    );
    return rows as any[];
  }
}
