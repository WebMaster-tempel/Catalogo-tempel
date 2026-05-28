import { v4 as uuidv4 } from 'uuid';
import { BaseRepository } from './BaseRepository';
import { DbPool } from '../database/connection';
import { Category, ProductCategory } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class CategoryRepository extends BaseRepository {
  constructor(db: DbPool) {
    super(db, 'categories');
  }

  async create(data: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
    const id = uuidv4();
    await this.db.execute(
      `INSERT INTO categories (id, name, slug, parent_id, description)
       VALUES (?, ?, ?, ?, ?)`,
      [id, data.name, data.slug, data.parent_id ?? null, data.description ?? null]
    );
    return this.findById(id);
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const [rows] = await this.db.execute(
      'SELECT * FROM categories WHERE slug = ?',
      [slug]
    );
    return (rows as any[])[0] ?? null;
  }

  async update(id: string, data: Partial<Category>): Promise<Category> {
    const setClauses: string[] = [];
    const values: any[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id' && key !== 'created_at') {
        setClauses.push(`\`${key}\` = ?`);
        values.push(value);
      }
    });

    if (setClauses.length > 0) {
      setClauses.push('updated_at = NOW()');
      values.push(id);
      await this.db.execute(
        `UPDATE categories SET ${setClauses.join(', ')} WHERE id = ?`,
        values
      );
    }

    return this.findById(id);
  }

  // MySQL 8.0 supports WITH RECURSIVE natively
  async getHierarchyTree(): Promise<any[]> {
    const [rows] = await this.db.execute(
      `WITH RECURSIVE category_tree AS (
         SELECT id, name, slug, parent_id, 0 AS level
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
    const [rows] = await this.db.execute(
      'SELECT * FROM categories WHERE parent_id = ? ORDER BY name',
      [parentId]
    );
    return rows as Category[];
  }

  async assignProduct(productId: string, categoryId: string): Promise<ProductCategory> {
    // INSERT IGNORE skips silently on duplicate PK (equivalent to ON CONFLICT DO NOTHING)
    await this.db.execute(
      'INSERT IGNORE INTO product_categories (product_id, category_id) VALUES (?, ?)',
      [productId, categoryId]
    );
    const [rows] = await this.db.execute(
      'SELECT * FROM product_categories WHERE product_id = ? AND category_id = ?',
      [productId, categoryId]
    );
    return (rows as any[])[0];
  }

  async removeProduct(productId: string, categoryId: string): Promise<boolean> {
    const [result] = await this.db.execute(
      'DELETE FROM product_categories WHERE product_id = ? AND category_id = ?',
      [productId, categoryId]
    ) as any[];
    return result.affectedRows > 0;
  }

  async getProductCategories(productId: string): Promise<Category[]> {
    const [rows] = await this.db.execute(
      `SELECT c.* FROM categories c
       JOIN product_categories pc ON c.id = pc.category_id
       WHERE pc.product_id = ?`,
      [productId]
    );
    return rows as Category[];
  }
}
