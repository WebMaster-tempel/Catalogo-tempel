import { v4 as uuidv4 } from 'uuid';
import { DbPool } from '../database/connection';
import { ProductAttributeValues } from '../types';

export class ProductAttributeValuesRepository {
  private db: DbPool;

  constructor(db: DbPool) {
    this.db = db;
  }

  async findByProductId(productId: string): Promise<ProductAttributeValues | null> {
    const [rows] = await this.db.execute(
      'SELECT * FROM product_attribute_values WHERE product_id = ?',
      [productId]
    );
    return (rows as any[])[0] ?? null;
  }

  async create(productId: string, attributes: Record<string, any>): Promise<ProductAttributeValues> {
    const id = uuidv4();
    await this.db.execute(
      `INSERT INTO product_attribute_values (id, product_id, attributes_json)
       VALUES (?, ?, ?)`,
      [id, productId, JSON.stringify(attributes)]
    );
    const [rows] = await this.db.execute(
      'SELECT * FROM product_attribute_values WHERE id = ?',
      [id]
    );
    return (rows as any[])[0];
  }

  async update(productId: string, attributes: Record<string, any>): Promise<ProductAttributeValues> {
    await this.db.execute(
      `UPDATE product_attribute_values
       SET attributes_json = ?, updated_at = NOW()
       WHERE product_id = ?`,
      [JSON.stringify(attributes), productId]
    );
    const [rows] = await this.db.execute(
      'SELECT * FROM product_attribute_values WHERE product_id = ?',
      [productId]
    );
    return (rows as any[])[0];
  }

  async upsert(productId: string, attributes: Record<string, any>): Promise<ProductAttributeValues> {
    const id = uuidv4();
    // ON DUPLICATE KEY UPDATE targets the UNIQUE KEY on product_id
    await this.db.execute(
      `INSERT INTO product_attribute_values (id, product_id, attributes_json)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE
         attributes_json = VALUES(attributes_json),
         updated_at = NOW()`,
      [id, productId, JSON.stringify(attributes)]
    );
    const [rows] = await this.db.execute(
      'SELECT * FROM product_attribute_values WHERE product_id = ?',
      [productId]
    );
    return (rows as any[])[0];
  }
}
