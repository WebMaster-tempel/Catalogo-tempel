import { v4 as uuidv4 } from 'uuid';
import { BaseRepository } from './BaseRepository';
import { DbPool } from '../database/connection';
import { Media } from '../types';

export class MediaRepository extends BaseRepository {
  constructor(db: DbPool) {
    super(db, 'media');
  }

  async create(data: Omit<Media, 'id' | 'created_at' | 'updated_at'>): Promise<Media> {
    const id = uuidv4();
    await this.db.execute(
      `INSERT INTO media (id, product_id, type, url, title, \`order\`)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, data.product_id, data.type, data.url, data.title ?? null, data.order ?? 0]
    );
    return this.findById(id);
  }

  async getProductMedia(productId: string): Promise<Media[]> {
    const [rows] = await this.db.execute(
      'SELECT * FROM media WHERE product_id = ? ORDER BY `order` ASC',
      [productId]
    );
    return rows as Media[];
  }

  async update(id: string, data: Partial<Media>): Promise<Media> {
    const setClauses: string[] = [];
    const values: any[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id' && key !== 'created_at' && key !== 'product_id') {
        setClauses.push(`\`${key}\` = ?`);
        values.push(value);
      }
    });

    if (setClauses.length > 0) {
      setClauses.push('updated_at = NOW()');
      values.push(id);
      await this.db.execute(
        `UPDATE media SET ${setClauses.join(', ')} WHERE id = ?`,
        values
      );
    }

    return this.findById(id);
  }
}
