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

  // R5: normalize application keywords sent by the wizard to DB terms
  private static readonly APPLICATION_ALIASES: Record<string, string> = {
    'Movilidad':           'sillas de ruedas',
    'movilidad':           'sillas de ruedas',
    'Bicicletas':          'sillas de ruedas',
    'Náutico':             'marítimo',
    'nautico':             'marítimo',
    'Maritimo':            'marítimo',
    'marítimo':            'marítimo',
    'Industrial':          'industrial',
    'Tracción':            'industrial',
    'traccion':            'industrial',
    'SmartGrid':           'centrales',
    'TV Cable':            'TV por cable',
    'Energías Renovables': 'renovable',
    'renovables':          'renovable',
    'Solar':               'solar',
  };

  /**
   * Normalize technology input to its canonical DB value (case-insensitive).
   * Accepts abbreviations and alternate spellings.
   */
  static normalizeTechnology(raw: string): string {
    const map: Record<string, string> = {
      'vrla-agm':      'VRLA-AGM',
      'vrla agm':      'VRLA-AGM',
      'agm':           'VRLA-AGM',
      'vrla-gel':      'VRLA-GEL',
      'vrla gel':      'VRLA-GEL',
      'gel':           'VRLA-GEL',
      'lifepo4':       'LiFePO4',
      'lfp':           'LiFePO4',
      'litio':         'LiFePO4',
      'lead carbon':   'Lead Carbon',
      'lead-carbon':   'Lead Carbon',
      'plomo carbono': 'Lead Carbon',
      'plomo-carbono': 'Lead Carbon',
    };
    return map[raw.toLowerCase().trim()] ?? raw;
  }

  /**
   * Normalize plate_type input to all possible DB representations.
   * Returns multiple variants because the DB may store either the pre-migration
   * value ('Flat') or the post-migration value ('Plana') depending on when
   * migration 021 was applied. Querying with OR covers both states.
   */
  static normalizePlateType(raw: string): string[] {
    const map: Record<string, string[]> = {
      'plana':      ['Plana', 'Flat'],
      'flat':       ['Plana', 'Flat'],
      'prismatic':  ['Prismática', 'Prismatica', 'Prismatic'],
      'prismatica': ['Prismática', 'Prismatica', 'Prismatic'],
      'prismática': ['Prismática', 'Prismatica', 'Prismatic'],
      'tubular':    ['Tubular'],
      'agm':        ['AGM'],
    };
    return map[raw.toLowerCase().trim()] ?? [raw];
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

    // R5: normalize application aliases before querying
    if (options.application) {
      const app = ProductRepository.APPLICATION_ALIASES[options.application] ?? options.application;
      where.push('c.applications LIKE ?');
      params.push(`%${app}%`);
    }

    if (options.technology) {
      const tech = ProductRepository.normalizeTechnology(options.technology);
      where.push('c.technology LIKE ?');
      params.push(`%${tech}%`);
    }
    if (options.plate_type) {
      const variants = ProductRepository.normalizePlateType(options.plate_type);
      if (variants.length === 1) {
        where.push('c.plate_type LIKE ?');
        params.push(`%${variants[0]}%`);
      } else {
        const conditions = variants.map(() => 'c.plate_type LIKE ?').join(' OR ');
        where.push(`(${conditions})`);
        variants.forEach(v => params.push(`%${v}%`));
      }
    }

    if (options.eurobat !== undefined) { where.push('c.eurobat = ?'); params.push(options.eurobat); }
    if (options.capacity_range) { where.push('c.capacity_range LIKE ?'); params.push(`%${options.capacity_range}%`); }
    if (options.characteristics) { where.push('c.characteristics LIKE ?'); params.push(`%${options.characteristics}%`); }
    if (options.product_type_id) { where.push('p.product_type_id = ?'); params.push(options.product_type_id); }
    if (options.status) { where.push('p.status = ?'); params.push(options.status); }
    if (options.category_id) { where.push('pc.category_id = ?'); params.push(options.category_id); }

    // R3: capacity filter uses COALESCE over both capacity fields so it works across all gammas
    if (options.capacity_min !== undefined) {
      where.push(`COALESCE(
        CAST(JSON_UNQUOTE(JSON_EXTRACT(pav.attributes_json, '$.capacity')) AS DECIMAL(12,4)),
        CAST(JSON_UNQUOTE(JSON_EXTRACT(pav.attributes_json, '$.capacity_nominal_10h')) AS DECIMAL(12,4))
      ) >= ?`);
      params.push(options.capacity_min);
    }
    if (options.capacity_max !== undefined) {
      where.push(`COALESCE(
        CAST(JSON_UNQUOTE(JSON_EXTRACT(pav.attributes_json, '$.capacity')) AS DECIMAL(12,4)),
        CAST(JSON_UNQUOTE(JSON_EXTRACT(pav.attributes_json, '$.capacity_nominal_10h')) AS DECIMAL(12,4))
      ) <= ?`);
      params.push(options.capacity_max);
    }

    // R1: compare as string to avoid decimal cast precision bugs (12.8 != 12.80000...)
    if (options.voltage !== undefined) {
      where.push(`JSON_UNQUOTE(JSON_EXTRACT(pav.attributes_json, '$.voltage')) = ?`);
      params.push(String(options.voltage));
    }

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
