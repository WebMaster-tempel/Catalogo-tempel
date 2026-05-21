import { DbPool } from '../database/connection';

export class BaseRepository {
  protected db: DbPool;
  protected table: string;

  constructor(db: DbPool, table: string) {
    this.db = db;
    this.table = table;
  }

  async findById(id: string): Promise<any> {
    const [rows] = await this.db.query(`SELECT * FROM ${this.table} WHERE id = ?`, [id]);
    return (rows as any[])[0] || null;
  }

  async findAll(): Promise<any[]> {
    const [rows] = await this.db.query(`SELECT * FROM ${this.table}`);
    return rows as any[];
  }

  async delete(id: string): Promise<boolean> {
    const [result] = await this.db.query(`DELETE FROM ${this.table} WHERE id = ?`, [id]);
    return (result as any).affectedRows > 0;
  }
}
