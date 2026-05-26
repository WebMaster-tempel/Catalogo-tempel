import { randomUUID } from 'crypto';
import { DbPool } from '../database/connection';
import { BaseRepository } from './BaseRepository';

export class UserRepository extends BaseRepository {
  constructor(db: DbPool) {
    super(db, 'users');
  }

  async findByEmail(email: string): Promise<any> {
    const [rows] = await this.db.query('SELECT * FROM users WHERE email = ?', [email]);
    return (rows as any[])[0] || null;
  }

  async create(email: string, passwordHash: string): Promise<any> {
    const id = randomUUID();
    await this.db.query(
      'INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)',
      [id, email, passwordHash]
    );
    return this.findByEmail(email);
  }
}
