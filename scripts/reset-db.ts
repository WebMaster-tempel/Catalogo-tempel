import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new pg.Client({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'catalog_user',
  password: process.env.DB_PASSWORD || 'catalog_password',
  database: 'postgres', // Connect to default postgres database
});

async function resetDatabase() {
  try {
    console.log('Connecting to PostgreSQL...');
    await client.connect();

    const dbName = process.env.DB_NAME || 'catalog_db';
    console.log(`Dropping database ${dbName} if exists...`);

    // Terminate any existing connections
    await client.query(`
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = $1
      AND pid <> pg_backend_pid()
    `, [dbName]);

    // Drop the database
    await client.query(`DROP DATABASE IF EXISTS "${dbName}"`);
    console.log(`✓ Database ${dbName} dropped`);

    // Create the database
    await client.query(`CREATE DATABASE "${dbName}"`);
    console.log(`✓ Database ${dbName} created`);

    console.log('\nDatabase reset complete!');
    console.log('Run "npm run db:migrate" to apply all migrations fresh.');

    await client.end();
    process.exit(0);
  } catch (err) {
    console.error('Error resetting database:', err);
    await client.end();
    process.exit(1);
  }
}

resetDatabase();
