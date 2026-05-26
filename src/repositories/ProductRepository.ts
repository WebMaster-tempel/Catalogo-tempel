import { v4 as uuidv4 } from 'uuid';
import { BaseRepository } from './BaseRepository';
import { DbPool } from '../database/connection';
import { Product, QueryOptions, PaginationMeta } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class ProductRepository extends BaseRepository {
  constructor(db: DbPool) {
    super(db, 'products');
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const [rows] = await this.db.execute(
      'SELECT * FROM products WHERE slug = ?',
      [slug]
    );
    return (rows as any[])[0] ?? null;
  }

  async create(data: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const id = uuidv4();
    await this.db.execute(
      `INSERT INTO products (id, name, slug, description, product_type_id, status, main_image_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, data.name, data.slug, data.description ?? null,
       data.product_type_id, data.status, data.main_image_id ?? null]
    );
    return this.findById(id);
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
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
        `UPDATE products SET ${setClauses.join(', ')} WHERE id = ?`,
        values
      );
    }

    return this.findById(id);
  }

  async list(options: QueryOptions): Promise<{ data: Product[]; meta: PaginationMeta }> {
    const page    = options.page     || 1;
    const perPage = options.per_page || 20;
    const offset  = (page - 1) * perPage;

    const where: string[] = [];
    const params: any[]   = [];

    if (options.search) {
      where.push('(name LIKE ? OR description LIKE ?)');
      params.push(`%${options.search}%`, `%${options.search}%`);
    }
    if (options.product_type_id) {
      where.push('product_type_id = ?');
      params.push(options.product_type_id);
    }
    if (options.status) {
      where.push('status = ?');
      params.push(options.status);
    }
    if (options.category_id) {
      where.push('id IN (SELECT product_id FROM product_categories WHERE category_id = ?)');
      params.push(options.category_id);
    }

    const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

    const [countRows] = await this.db.execute(
      `SELECT COUNT(*) AS total FROM products ${whereClause}`,
      params
    );
    const total = parseInt((countRows as any[])[0].total, 10);

    const [data] = await this.db.execute(
      `SELECT * FROM products ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, perPage, offset]
    );

    return {
      data: data as Product[],
      meta: { page, per_page: perPage, total, total_pages: Math.ceil(total / perPage) },
    };
  }

  async listWithDynamicFilters(options: QueryOptions): Promise<{ data: any[]; meta: PaginationMeta }> {
    const page    = options.page     || 1;
    const perPage = options.per_page || 20;
    const offset  = (page - 1) * perPage;

    const where: string[] = [];
    const params: any[]   = [];

    if (options.search) {
      where.push('(p.name LIKE ? OR p.description LIKE ?)');
      params.push(`%${options.search}%`, `%${options.search}%`);
    }
    if (options.product_type_id) {
      where.push('p.product_type_id = ?');
      params.push(options.product_type_id);
    }
    if (options.status) {
      where.push('p.status = ?');
      params.push(options.status);
    }
    if (options.category_id) {
      where.push('p.id IN (SELECT product_id FROM product_categories WHERE category_id = ?)');
      params.push(options.category_id);
    }

    // Dynamic JSON attribute filters — MySQL 8.0 arrow operator
    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        where.push(`JSON_UNQUOTE(JSON_EXTRACT(pav.attributes_json, ?)) = ?`);
        params.push(`$.${key}`, String(value));
      });
    }

    const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

    const [countRows] = await this.db.execute(
      `SELECT COUNT(*) AS total
       FROM products p
       LEFT JOIN product_attribute_values pav ON p.id = pav.product_id
       ${whereClause}`,
      params
    );
    const total = parseInt((countRows as any[])[0].total, 10);

    const [data] = await this.db.execute(
      `SELECT p.*, pav.attributes_json
       FROM products p
       LEFT JOIN product_attribute_values pav ON p.id = pav.product_id
       LEFT JOIN product_categories pc ON p.id = pc.product_id
       LEFT JOIN categories c ON pc.category_id = c.id
       ${whereClause}
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, perPage, offset]
    );

    const products = rows as any[];
    const data = await Promise.all(products.map((p) => this.attachRelations(p)));

    return {
      data: data as any[],
      meta: { page, per_page: perPage, total, total_pages: Math.ceil(total / perPage) },
    };
  }

  // Uses correlated subqueries to avoid cross-join duplication (no JSONB_AGG DISTINCT in MySQL)
  async findFullProduct(id: string): Promise<any> {
    const [rows] = await this.db.execute(
      `SELECT
         p.*,
         pav.attributes_json,
         (SELECT JSON_ARRAYAGG(
            JSON_OBJECT('id', c.id, 'name', c.name, 'slug', c.slug)
          )
          FROM product_categories pc
          JOIN categories c ON pc.category_id = c.id
          WHERE pc.product_id = p.id
         ) AS categories,
         (SELECT JSON_ARRAYAGG(
            JSON_OBJECT('id', m.id, 'type', m.type, 'url', m.url,
                        'title', m.title, 'order', m.\`order\`)
            ORDER BY m.\`order\`
          )
          FROM media m
          WHERE m.product_id = p.id
         ) AS media
       FROM products p
       LEFT JOIN product_attribute_values pav ON p.id = pav.product_id
       WHERE p.id = ?`,
      [id]
    );
    return (rows as any[])[0] ?? null;
  }
}
