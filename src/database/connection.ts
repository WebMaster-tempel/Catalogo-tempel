import pgPromise from 'pg-promise';

const pgp = pgPromise();

const connection = pgp({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'catalog_db',
  user: process.env.DB_USER || 'catalog_user',
  password: process.env.DB_PASSWORD || 'catalog_password',
});

export const db = connection;
export { pgp };
