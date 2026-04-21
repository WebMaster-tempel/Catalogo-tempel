import fs from 'fs';
import path from 'path';
import { db } from '../database/connection';

async function runMigrations() {
  try {
    console.log('Running migrations...');

    // Create migrations table if it doesn't exist
    await db.none(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Get all migration files
    const migrationsDir = path.join(__dirname);
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql') && f !== 'runner.ts')
      .sort();

    for (const file of files) {
      // Check if migration has been run
      const result = await db.oneOrNone('SELECT * FROM _migrations WHERE name = $1', [file]);

      if (!result) {
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf-8');

        console.log(`Executing migration: ${file}`);
        await db.none(sql);

        // Record migration
        await db.none('INSERT INTO _migrations (name) VALUES ($1)', [file]);
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
