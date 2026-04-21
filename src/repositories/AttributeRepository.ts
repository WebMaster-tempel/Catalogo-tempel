import { IDatabase } from 'pg-promise';
import { BaseRepository } from './BaseRepository';
import { Attribute } from '../types';

export class AttributeRepository extends BaseRepository {
  constructor(db: IDatabase<any>) {
    super(db, 'attributes');
  }

  async create(data: Omit<Attribute, 'id' | 'created_at' | 'updated_at'>): Promise<Attribute> {
    return this.db.one(
      `INSERT INTO attributes (name, label, data_type, unit, is_filterable)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [data.name, data.label, data.data_type, data.unit, data.is_filterable]
    );
  }

  async findByName(name: string): Promise<Attribute | null> {
    return this.db.oneOrNone('SELECT * FROM attributes WHERE name = $1', [name]);
  }

  async getFilterableAttributes(): Promise<Attribute[]> {
    return this.db.any('SELECT * FROM attributes WHERE is_filterable = true');
  }

  async getAttributesByProductType(productTypeId: string): Promise<Attribute[]> {
    return this.db.any(
      `SELECT a.* FROM attributes a
       JOIN product_type_attributes pta ON a.id = pta.attribute_id
       WHERE pta.product_type_id = $1
       ORDER BY pta."order" ASC`,
      [productTypeId]
    );
  }
}
