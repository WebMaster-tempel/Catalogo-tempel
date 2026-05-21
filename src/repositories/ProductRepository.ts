import { DbPool } from '../database/connection';
import { BaseRepository } from './BaseRepository';
import { Product, QueryOptions, PaginationMeta } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class ProductRepository extends BaseRepository {
  constructor(db: DbPool) {
    super(db, 'products');
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const [rows] = await this.db.query('SELECT * FROM products WHERE slug = ?', [slug]);
    return (rows as any[])[0] || null;
  }

  async create(data: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const id = uuidv4();
    await this.db.query(
      `INSERT INTO products (id, name, slug, description, product_type_id, status, main_image_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, data.name, data.slug, data.description, data.product_type_id, data.status, data.main_image_id]
    );
    return this.findById(id);
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
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

    await this.db.query(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  async search(options: QueryOptions): Promise<{ data: any[]; meta: PaginationMeta }> {
    const page = options.page || 1;
    const perPage = options.per_page || 20;
    const offset = (page - 1) * perPage;

    const where: string[] = [];
    const params: any[] = [];

    if (options.search) {
      const s = `%${options.search}%`;
      where.push(`(p.name LIKE ? OR p.description LIKE ? OR c.name LIKE ? OR c.applications LIKE ? OR c.characteristics LIKE ? OR c.description LIKE ?)`);
      params.push(s, s, s, s, s, s);
    }
    if (options.application) { where.push('c.applications LIKE ?'); params.push(`%${options.application}%`); }
    if (options.technology) { where.push('c.technology LIKE ?'); params.push(`%${options.technology}%`); }
    if (options.plate_type) { where.push('c.plate_type LIKE ?'); params.push(`%${options.plate_type}%`); }
    if (options.eurobat !== undefined) { where.push('c.eurobat = ?'); params.push(options.eurobat); }
    if (options.capacity_range) { where.push('c.capacity_range LIKE ?'); params.push(`%${options.capacity_range}%`); }
    if (options.characteristics) { where.push('c.characteristics LIKE ?'); params.push(`%${options.characteristics}%`); }
    if (options.product_type_id) { where.push('p.product_type_id = ?'); params.push(options.product_type_id); }
    if (options.status) { where.push('p.status = ?'); params.push(options.status); }
    if (options.category_id) { where.push('pc.category_id = ?'); params.push(options.category_id); }
    if (options.capacity_min !== undefined) { where.push('CAST(JSON_UNQUOTE(JSON_EXTRACT(pav.attributes_json, "$.capacity")) AS DECIMAL) >= ?'); params.push(options.capacity_min); }
    if (options.capacity_max !== undefined) { where.push('CAST(JSON_UNQUOTE(JSON_EXTRACT(pav.attributes_json, "$.capacity")) AS DECIMAL) <= ?'); params.push(options.capacity_max); }
    if (options.voltage !== undefined) { where.push('CAST(JSON_UNQUOTE(JSON_EXTRACT(pav.attributes_json, "$.voltage")) AS DECIMAL) = ?'); params.push(options.voltage); }
    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        where.push(`JSON_UNQUOTE(JSON_EXTRACT(pav.attributes_json, '$.${key}')) = ?`);
        params.push(String(value));
      });
    }

    const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

    const [countRows] = await this.db.query(
      `SELECT COUNT(DISTINCT p.id) as total
       FROM products p
       LEFT JOIN product_attribute_values pav ON p.id = pav.product_id
       LEFT JOIN product_categories pc ON p.id = pc.product_id
       LEFT JOIN categories c ON pc.category_id = c.id
       ${whereClause}`,
      params
    );
    const total = parseInt((countRows as any[])[0].total, 10);

    const [rows] = await this.db.query(
      `SELECT p.*, pav.attributes_json
       FROM products p
       LEFT JOIN product_attribute_values pav ON p.id = pav.product_id
       LEFT JOIN product_categories pc ON p.id = pc.product_id
       LEFT JOIN categories c ON pc.category_id = c.id
       ${whereClause}
       GROUP BY p.id
       ORDER BY p.name ASC
       LIMIT ? OFFSET ?`,
      [...params, perPage, offset]
    );

    const products = rows as any[];
    const data = await Promise.all(products.map((p) => this.attachRelations(p)));

    return {
      data,
      meta: { page, per_page: perPage, total, total_pages: Math.ceil(total / perPage) },
    };
  }

  async findFullProduct(id: string): Promise<any> {
    const [rows] = await this.db.query(
      `SELECT p.*, pav.attributes_json
       FROM products p
       LEFT JOIN product_attribute_values pav ON p.id = pav.product_id
       WHERE p.id = ?`,
      [id]
    );
    const row = (rows as any[])[0];
    if (!row) return null;
    return this.attachRelations(row);
  }

  private async attachRelations(row: any): Promise<any> {
    if (typeof row.attributes_json === 'string') row.attributes_json = JSON.parse(row.attributes_json);
    if (!row.attributes_json) row.attributes_json = {};

    const [cats] = await this.db.query(
      `SELECT c.id, c.name, c.slug, c.technology, c.plate_type, c.design_life_years,
              c.cycles, c.capacity_range, c.applications, c.characteristics, c.eurobat, c.description
       FROM categories c
       JOIN product_categories pc ON c.id = pc.category_id
       WHERE pc.product_id = ?`,
      [row.id]
    );
    row.categories = cats || [];

    const [media] = await this.db.query(
      'SELECT id, type, url, title, `order` FROM media WHERE product_id = ? ORDER BY `order` ASC',
      [row.id]
    );
    row.media = media || [];

    return row;
  }
}
