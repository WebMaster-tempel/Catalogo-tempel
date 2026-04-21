import { IDatabase } from 'pg-promise';
import { ProductAttributeValues } from '../types';

export class ProductAttributeValuesRepository {
  private db: IDatabase<any>;

  constructor(db: IDatabase<any>) {
    this.db = db;
  }

  async findByProductId(productId: string): Promise<ProductAttributeValues | null> {
    return this.db.oneOrNone(
      'SELECT * FROM product_attribute_values WHERE product_id = $1',
      [productId]
    );
  }

  async create(productId: string, attributes: Record<string, any>): Promise<ProductAttributeValues> {
    return this.db.one(
      `INSERT INTO product_attribute_values (product_id, attributes_json)
       VALUES ($1, $2)
       RETURNING *`,
      [productId, JSON.stringify(attributes)]
    );
  }

  async update(productId: string, attributes: Record<string, any>): Promise<ProductAttributeValues> {
    return this.db.one(
      `UPDATE product_attribute_values
       SET attributes_json = $2, updated_at = NOW()
       WHERE product_id = $1
       RETURNING *`,
      [productId, JSON.stringify(attributes)]
    );
  }

  async upsert(productId: string, attributes: Record<string, any>): Promise<ProductAttributeValues> {
    return this.db.one(
      `INSERT INTO product_attribute_values (product_id, attributes_json)
       VALUES ($1, $2)
       ON CONFLICT (product_id) DO UPDATE SET
         attributes_json = $2,
         updated_at = NOW()
       RETURNING *`,
      [productId, JSON.stringify(attributes)]
    );
  }
}
