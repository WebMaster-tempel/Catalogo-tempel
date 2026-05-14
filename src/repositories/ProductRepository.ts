import { IDatabase } from 'pg-promise';
import { BaseRepository } from './BaseRepository';
import { Product, QueryOptions, PaginationMeta } from '../types';

export class ProductRepository extends BaseRepository {
  constructor(db: IDatabase<any>) {
    super(db, 'products');
  }

  async findBySlug(slug: string): Promise<Product | null> {
    return this.db.oneOrNone('SELECT * FROM products WHERE slug = $1', [slug]);
  }

  async create(data: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const result = await this.db.one(
      `INSERT INTO products (name, slug, description, product_type_id, status, main_image_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [data.name, data.slug, data.description, data.product_type_id, data.status, data.main_image_id]
    );
    return result;
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
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
      return this.db.one('SELECT * FROM products WHERE id = $1', [id]);
    }

    fields.push(`updated_at = $${paramIndex}`);
    values.push(new Date());
    values.push(id);

    return this.db.one(
      `UPDATE products SET ${fields.join(', ')} WHERE id = $${paramIndex + 1} RETURNING *`,
      values
    );
  }

  async search(options: QueryOptions): Promise<{ data: any[]; meta: PaginationMeta }> {
    const page = options.page || 1;
    const perPage = options.per_page || 20;
    const offset = (page - 1) * perPage;

    const where: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (options.search) {
      params.push(`%${options.search}%`);
      where.push(`(
        p.name ILIKE $${paramIndex} OR
        p.description ILIKE $${paramIndex} OR
        c.name ILIKE $${paramIndex} OR
        c.applications ILIKE $${paramIndex} OR
        c.characteristics ILIKE $${paramIndex} OR
        c.description ILIKE $${paramIndex}
      )`);
      paramIndex++;
    }

    if (options.application) {
      params.push(`%${options.application}%`);
      where.push(`c.applications ILIKE $${paramIndex}`);
      paramIndex++;
    }

    if (options.technology) {
      params.push(`%${options.technology}%`);
      where.push(`c.technology ILIKE $${paramIndex}`);
      paramIndex++;
    }

    if (options.plate_type) {
      params.push(`%${options.plate_type}%`);
      where.push(`c.plate_type ILIKE $${paramIndex}`);
      paramIndex++;
    }

    if (options.eurobat !== undefined) {
      params.push(options.eurobat);
      where.push(`c.eurobat = $${paramIndex}`);
      paramIndex++;
    }

    if (options.capacity_range) {
      params.push(`%${options.capacity_range}%`);
      where.push(`c.capacity_range ILIKE $${paramIndex}`);
      paramIndex++;
    }

    if (options.characteristics) {
      params.push(`%${options.characteristics}%`);
      where.push(`c.characteristics ILIKE $${paramIndex}`);
      paramIndex++;
    }

    if (options.product_type_id) {
      params.push(options.product_type_id);
      where.push(`p.product_type_id = $${paramIndex}`);
      paramIndex++;
    }

    if (options.status) {
      params.push(options.status);
      where.push(`p.status = $${paramIndex}`);
      paramIndex++;
    }

    if (options.category_id) {
      params.push(options.category_id);
      where.push(`pc.category_id = $${paramIndex}`);
      paramIndex++;
    }

    if (options.capacity_min !== undefined) {
      params.push(options.capacity_min);
      where.push(`(pav.attributes_json->>'capacity_nominal_10h')::numeric >= $${paramIndex}`);
      paramIndex++;
    }

    if (options.capacity_max !== undefined) {
      params.push(options.capacity_max);
      where.push(`(pav.attributes_json->>'capacity_nominal_10h')::numeric <= $${paramIndex}`);
      paramIndex++;
    }

    if (options.voltage !== undefined) {
      params.push(options.voltage);
      where.push(`(pav.attributes_json->>'voltage')::numeric = $${paramIndex}`);
      paramIndex++;
    }

    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        where.push(`pav.attributes_json->>'${key.replace(/'/g, "''")}' = $${paramIndex}`);
        params.push(String(value));
        paramIndex++;
      });
    }

    const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

    const countResult = await this.db.one(
      `SELECT COUNT(DISTINCT p.id) as total
       FROM products p
       LEFT JOIN product_attribute_values pav ON p.id = pav.product_id
       LEFT JOIN product_categories pc ON p.id = pc.product_id
       LEFT JOIN categories c ON pc.category_id = c.id
       ${whereClause}`,
      params
    );
    const total = parseInt(countResult.total, 10);

    const data = await this.db.any(
      `SELECT DISTINCT ON (p.id) p.*,
         pav.attributes_json,
         COALESCE(
           (SELECT jsonb_agg(jsonb_build_object('id', c2.id, 'name', c2.name, 'slug', c2.slug))
            FROM product_categories pc2
            JOIN categories c2 ON pc2.category_id = c2.id
            WHERE pc2.product_id = p.id), '[]'::jsonb
         ) AS categories,
         COALESCE(
           (SELECT jsonb_agg(jsonb_build_object('id', m.id, 'type', m.type, 'url', m.url, 'order', m."order")
                             ORDER BY m."order")
            FROM media m
            WHERE m.product_id = p.id), '[]'::jsonb
         ) AS media
       FROM products p
       LEFT JOIN product_attribute_values pav ON p.id = pav.product_id
       LEFT JOIN product_categories pc ON p.id = pc.product_id
       LEFT JOIN categories c ON pc.category_id = c.id
       ${whereClause}
       ORDER BY p.id, p.name ASC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, perPage, offset]
    );

    return {
      data,
      meta: {
        page,
        per_page: perPage,
        total,
        total_pages: Math.ceil(total / perPage),
      },
    };
  }

  async findFullProduct(id: string): Promise<any> {
    return this.db.oneOrNone(
      `SELECT
         p.*,
         pav.attributes_json,
         jsonb_agg(DISTINCT jsonb_build_object('id', c.id, 'name', c.name, 'slug', c.slug)) FILTER (WHERE c.id IS NOT NULL) as categories,
         jsonb_agg(DISTINCT jsonb_build_object('id', m.id, 'type', m.type, 'url', m.url, 'title', m.title, 'order', m."order")) FILTER (WHERE m.id IS NOT NULL) as media
       FROM products p
       LEFT JOIN product_attribute_values pav ON p.id = pav.product_id
       LEFT JOIN product_categories pc ON p.id = pc.product_id
       LEFT JOIN categories c ON pc.category_id = c.id
       LEFT JOIN media m ON p.id = m.product_id
       WHERE p.id = $1
       GROUP BY p.id, pav.id`,
      [id]
    );
  }
}
