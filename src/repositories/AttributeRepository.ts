import { v4 as uuidv4 } from 'uuid';
import { BaseRepository } from './BaseRepository';
import { DbPool } from '../database/connection';
import { Attribute } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class AttributeRepository extends BaseRepository {
  constructor(db: DbPool) {
    super(db, 'attributes');
  }

  async create(data: Omit<Attribute, 'id' | 'created_at' | 'updated_at'>): Promise<Attribute> {
    const id = uuidv4();
    await this.db.execute(
      `INSERT INTO attributes (id, name, label, data_type, unit, is_filterable)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, data.name, data.label, data.data_type, data.unit ?? null, data.is_filterable ? 1 : 0]
    );
    return this.findById(id);
  }

  async findByName(name: string): Promise<Attribute | null> {
    const [rows] = await this.db.execute(
      'SELECT * FROM attributes WHERE name = ?',
      [name]
    );
    return (rows as any[])[0] ?? null;
  }

  async getFilterableAttributes(): Promise<Attribute[]> {
    const [rows] = await this.db.execute(
      'SELECT * FROM attributes WHERE is_filterable = 1'
    );
    return rows as Attribute[];
  }

  async getAttributesByProductType(productTypeId: string): Promise<Attribute[]> {
    const [rows] = await this.db.execute(
      `SELECT a.* FROM attributes a
       JOIN product_type_attributes pta ON a.id = pta.attribute_id
       WHERE pta.product_type_id = ?
       ORDER BY pta.\`order\` ASC`,
      [productTypeId]
    );
    return rows as Attribute[];
  }
}
