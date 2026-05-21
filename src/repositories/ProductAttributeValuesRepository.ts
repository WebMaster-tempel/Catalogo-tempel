import { DbPool } from '../database/connection';
import { ProductAttributeValues } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class ProductAttributeValuesRepository {
  private db: DbPool;

  constructor(db: DbPool) {
    this.db = db;
  }

  async findByProductId(productId: string): Promise<ProductAttributeValues | null> {
    const [rows] = await this.db.query(
      'SELECT * FROM product_attribute_values WHERE product_id = ?',
      [productId]
    );
    const row = (rows as any[])[0];
    if (row && typeof row.attributes_json === 'string') {
      row.attributes_json = JSON.parse(row.attributes_json);
    }
    return row || null;
  }

  async create(productId: string, attributes: Record<string, any>): Promise<ProductAttributeValues> {
    const id = uuidv4();
    await this.db.query(
      `INSERT INTO product_attribute_values (id, product_id, attributes_json) VALUES (?, ?, ?)`,
      [id, productId, JSON.stringify(attributes)]
    );
    return this.findByProductId(productId) as any;
  }

  async update(productId: string, attributes: Record<string, any>): Promise<ProductAttributeValues> {
    await this.db.query(
      `UPDATE product_attribute_values SET attributes_json = ?, updated_at = NOW() WHERE product_id = ?`,
      [JSON.stringify(attributes), productId]
    );
    return this.findByProductId(productId) as any;
  }

  async upsert(productId: string, attributes: Record<string, any>): Promise<ProductAttributeValues> {
    await this.db.query(
      `INSERT INTO product_attribute_values (id, product_id, attributes_json)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE attributes_json = VALUES(attributes_json), updated_at = NOW()`,
      [uuidv4(), productId, JSON.stringify(attributes)]
    );
    return this.findByProductId(productId) as any;
  }
}
