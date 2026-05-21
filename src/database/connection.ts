import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host:             process.env.DB_HOST     || 'localhost',
  port:             parseInt(process.env.DB_PORT || '3306'),
  database:         process.env.DB_NAME     || 'catalog_db',
  user:             process.env.DB_USER     || 'root',
  password:         process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit:  10,
  charset:          'utf8mb4',
  timezone:         '+00:00',
});

export const db = pool;
export type DbPool = mysql.Pool;
