import { v4 as uuidv4 } from 'uuid';
import { BaseRepository } from './BaseRepository';
import { DbPool } from '../database/connection';
import { ProductType, ProductTypeAttribute } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class ProductTypeRepository extends BaseRepository {
  constructor(db: DbPool) {
    super(db, 'product_types');
  }

  async create(data: Omit<ProductType, 'id' | 'created_at' | 'updated_at'>): Promise<ProductType> {
    const id = uuidv4();
    await this.db.execute(
      'INSERT INTO product_types (id, name, description) VALUES (?, ?, ?)',
      [id, data.name, data.description ?? null]
    );
    return this.findById(id);
  }

  async findByName(name: string): Promise<ProductType | null> {
    const [rows] = await this.db.execute(
      'SELECT * FROM product_types WHERE name = ?',
      [name]
    );
    return (rows as any[])[0] ?? null;
  }

  // Uses JSON_ARRAYAGG + JSON_OBJECT (MySQL 8.0+); returns null JSON array if no attributes
  async getWithAttributes(id: string): Promise<any> {
    const [rows] = await this.db.execute(
      `SELECT
         pt.*,
         JSON_ARRAYAGG(
           JSON_OBJECT(
             'id',           a.id,
             'name',         a.name,
             'label',        a.label,
             'data_type',    a.data_type,
             'unit',         a.unit,
             'is_filterable',a.is_filterable,
             'is_required',  pta.is_required,
             'order',        pta.\`order\`
           )
           ORDER BY pta.\`order\` ASC
         ) AS attributes
       FROM product_types pt
       LEFT JOIN product_type_attributes pta ON pt.id = pta.product_type_id
       LEFT JOIN attributes a ON pta.attribute_id = a.id
       WHERE pt.id = ?
       GROUP BY pt.id`,
      [id]
    );
    return (rows as any[])[0] ?? null;
  }

  async assignAttribute(
    productTypeId: string,
    attributeId: string,
    isRequired: boolean,
    order: number
  ): Promise<ProductTypeAttribute> {
    const id = uuidv4();
    await this.db.execute(
      `INSERT INTO product_type_attributes (id, product_type_id, attribute_id, is_required, \`order\`)
       VALUES (?, ?, ?, ?, ?)`,
      [id, productTypeId, attributeId, isRequired ? 1 : 0, order]
    );
    const [rows] = await this.db.execute(
      'SELECT * FROM product_type_attributes WHERE id = ?',
      [id]
    );
    return (rows as any[])[0];
  }

  async removeAttribute(productTypeId: string, attributeId: string): Promise<boolean> {
    const [result] = await this.db.execute(
      'DELETE FROM product_type_attributes WHERE product_type_id = ? AND attribute_id = ?',
      [productTypeId, attributeId]
    ) as any[];
    return result.affectedRows > 0;
  }
}
