import { DbPool } from '../database/connection';
import { BaseRepository } from './BaseRepository';
import { Media } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class MediaRepository extends BaseRepository {
  constructor(db: DbPool) {
    super(db, 'media');
  }

  async create(data: Omit<Media, 'id' | 'created_at' | 'updated_at'>): Promise<Media> {
    const id = uuidv4();
    await this.db.query(
      `INSERT INTO media (id, product_id, type, url, title, \`order\`) VALUES (?, ?, ?, ?, ?, ?)`,
      [id, data.product_id, data.type, data.url, data.title, data.order]
    );
    return this.findById(id);
  }

  async getProductMedia(productId: string): Promise<Media[]> {
    const [rows] = await this.db.query(
      'SELECT * FROM media WHERE product_id = ? ORDER BY `order` ASC',
      [productId]
    );
    return rows as any[];
  }

  async update(id: string, data: Partial<Media>): Promise<Media> {
    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id' && key !== 'created_at' && key !== 'product_id') {
        fields.push(`\`${key}\` = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) return this.findById(id);

    fields.push('updated_at = ?');
    values.push(new Date());
    values.push(id);

    await this.db.query(`UPDATE media SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }
}
