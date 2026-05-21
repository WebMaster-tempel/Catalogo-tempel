import { DbPool } from '../database/connection';
import { BaseRepository } from './BaseRepository';
import { ProductType, ProductTypeAttribute } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class ProductTypeRepository extends BaseRepository {
  constructor(db: DbPool) {
    super(db, 'product_types');
  }

  async create(data: Omit<ProductType, 'id' | 'created_at' | 'updated_at'>): Promise<ProductType> {
    const id = uuidv4();
    await this.db.query(
      `INSERT INTO product_types (id, name, description) VALUES (?, ?, ?)`,
      [id, data.name, data.description]
    );
    return this.findById(id);
  }

  async findByName(name: string): Promise<ProductType | null> {
    const [rows] = await this.db.query('SELECT * FROM product_types WHERE name = ?', [name]);
    return (rows as any[])[0] || null;
  }

  async getWithAttributes(id: string): Promise<any> {
    const pt = await this.findById(id);
    if (!pt) return null;

    const [rows] = await this.db.query(
      `SELECT a.*, pta.is_required, pta.\`order\`
       FROM attributes a
       JOIN product_type_attributes pta ON a.id = pta.attribute_id
       WHERE pta.product_type_id = ?
       ORDER BY pta.\`order\` ASC`,
      [id]
    );
    pt.attributes = rows;
    return pt;
  }

  async assignAttribute(
    productTypeId: string,
    attributeId: string,
    isRequired: boolean,
    order: number
  ): Promise<ProductTypeAttribute> {
    const id = uuidv4();
    await this.db.query(
      `INSERT INTO product_type_attributes (id, product_type_id, attribute_id, is_required, \`order\`) VALUES (?, ?, ?, ?, ?)`,
      [id, productTypeId, attributeId, isRequired, order]
    );
    const [rows] = await this.db.query('SELECT * FROM product_type_attributes WHERE id = ?', [id]);
    return (rows as any[])[0];
  }

  async removeAttribute(productTypeId: string, attributeId: string): Promise<boolean> {
    const [result] = await this.db.query(
      `DELETE FROM product_type_attributes WHERE product_type_id = ? AND attribute_id = ?`,
      [productTypeId, attributeId]
    );
    return (result as any).affectedRows > 0;
  }
}
