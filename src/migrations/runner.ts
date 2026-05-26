import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { db } from '../database/connection';

async function runMigrations() {
  try {
    console.log('Running MySQL migrations...');

    await db.execute(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        name        VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_migration_name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    const migrationsDir = path.join(__dirname);
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      const [rows] = await db.execute(
        'SELECT id FROM _migrations WHERE name = ?',
        [file]
      );

      if ((rows as any[]).length === 0) {
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
        console.log(`Executing migration: ${file}`);
        const statements = sql
          .split(';')
          .map((s) =>
            s
              .split('\n')
              .filter((line) => !line.trim().startsWith('--'))
              .join('\n')
              .trim()
          )
          .filter((s) => s.length > 0);
        for (const stmt of statements) {
          await db.query(stmt);
        }
        await db.query('INSERT INTO _migrations (name) VALUES (?)', [file]);
        console.log(`✓ ${file}`);
      } else {
        console.log(`⊘ ${file} (already executed)`);
      }
    }

    console.log('Migrations completed');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

runMigrations();
