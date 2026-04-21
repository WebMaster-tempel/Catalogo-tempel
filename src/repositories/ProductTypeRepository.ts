import { IDatabase } from 'pg-promise';
import { BaseRepository } from './BaseRepository';
import { ProductType, ProductTypeAttribute } from '../types';

export class ProductTypeRepository extends BaseRepository {
  constructor(db: IDatabase<any>) {
    super(db, 'product_types');
  }

  async create(data: Omit<ProductType, 'id' | 'created_at' | 'updated_at'>): Promise<ProductType> {
    return this.db.one(
      `INSERT INTO product_types (name, description)
       VALUES ($1, $2)
       RETURNING *`,
      [data.name, data.description]
    );
  }

  async findByName(name: string): Promise<ProductType | null> {
    return this.db.oneOrNone('SELECT * FROM product_types WHERE name = $1', [name]);
  }

  async getWithAttributes(id: string): Promise<any> {
    return this.db.one(
      `SELECT
         pt.*,
         jsonb_agg(jsonb_build_object(
           'id', a.id,
           'name', a.name,
           'label', a.label,
           'data_type', a.data_type,
           'unit', a.unit,
           'is_filterable', a.is_filterable,
           'is_required', pta.is_required,
           'order', pta."order"
         ) ORDER BY pta."order" ASC) as attributes
       FROM product_types pt
       LEFT JOIN product_type_attributes pta ON pt.id = pta.product_type_id
       LEFT JOIN attributes a ON pta.attribute_id = a.id
       WHERE pt.id = $1
       GROUP BY pt.id`,
      [id]
    );
  }

  async assignAttribute(
    productTypeId: string,
    attributeId: string,
    isRequired: boolean,
    order: number
  ): Promise<ProductTypeAttribute> {
    return this.db.one(
      `INSERT INTO product_type_attributes (product_type_id, attribute_id, is_required, "order")
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [productTypeId, attributeId, isRequired, order]
    );
  }

  async removeAttribute(productTypeId: string, attributeId: string): Promise<boolean> {
    const result = await this.db.result(
      `DELETE FROM product_type_attributes WHERE product_type_id = $1 AND attribute_id = $2`,
      [productTypeId, attributeId]
    );
    return result.rowCount > 0;
  }
}
