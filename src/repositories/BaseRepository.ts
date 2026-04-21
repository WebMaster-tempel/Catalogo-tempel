import { IDatabase } from 'pg-promise';

export class BaseRepository {
  protected db: IDatabase<any>;
  protected table: string;

  constructor(db: IDatabase<any>, table: string) {
    this.db = db;
    this.table = table;
  }

  async findById(id: string): Promise<any> {
    return this.db.oneOrNone(`SELECT * FROM ${this.table} WHERE id = $1`, [id]);
  }

  async findAll(): Promise<any[]> {
    return this.db.any(`SELECT * FROM ${this.table}`);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.result(`DELETE FROM ${this.table} WHERE id = $1`, [id]);
    return result.rowCount > 0;
  }
}
