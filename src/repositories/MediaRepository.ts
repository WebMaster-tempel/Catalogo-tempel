import { IDatabase } from 'pg-promise';
import { BaseRepository } from './BaseRepository';
import { Media } from '../types';

export class MediaRepository extends BaseRepository {
  constructor(db: IDatabase<any>) {
    super(db, 'media');
  }

  async create(data: Omit<Media, 'id' | 'created_at' | 'updated_at'>): Promise<Media> {
    return this.db.one(
      `INSERT INTO media (product_id, type, url, title, "order")
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [data.product_id, data.type, data.url, data.title, data.order]
    );
  }

  async getProductMedia(productId: string): Promise<Media[]> {
    return this.db.any(
      `SELECT * FROM media WHERE product_id = $1 ORDER BY "order" ASC`,
      [productId]
    );
  }

  async update(id: string, data: Partial<Media>): Promise<Media> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id' && key !== 'created_at' && key !== 'product_id') {
        fields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });

    if (fields.length === 0) {
      return this.db.one('SELECT * FROM media WHERE id = $1', [id]);
    }

    fields.push(`updated_at = $${paramIndex}`);
    values.push(new Date());
    values.push(id);

    return this.db.one(
      `UPDATE media SET ${fields.join(', ')} WHERE id = $${paramIndex + 1} RETURNING *`,
      values
    );
  }
}
