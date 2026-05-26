import 'dotenv/config';
import mysql from 'mysql2/promise';
import fs from 'fs';

const OUTPUT = 'C:/Users/SergiMallen/Desktop/catalog_db.sql';

const TABLES = [
  'product_types',
  'attributes',
  'product_type_attributes',
  'categories',
  'category_features',
  'tags',
  'category_tags',
  'products',
  'product_attribute_values',
  'product_categories',
  'media',
];

async function dump() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'catalog_db',
    charset: 'utf8mb4',
  });

  let sql = `-- catalog_db dump ${new Date().toISOString()}\n`;
  sql += `SET FOREIGN_KEY_CHECKS=0;\n\n`;

  for (const table of TABLES) {
    console.log(`Dumping ${table}...`);

    // Schema
    const [createRows] = await db.query(`SHOW CREATE TABLE \`${table}\``);
    const createSql = (createRows as any[])[0]['Create Table'];
    sql += `DROP TABLE IF EXISTS \`${table}\`;\n`;
    sql += createSql + ';\n\n';

    // Data
    const [rows] = await db.query(`SELECT * FROM \`${table}\``);
    const data = rows as any[];
    if (data.length > 0) {
      const cols = Object.keys(data[0]).map(c => `\`${c}\``).join(', ');
      const values = data.map(row => {
        const vals = Object.values(row).map(v => {
          if (v === null) return 'NULL';
          if (typeof v === 'number') return v;
          if (typeof v === 'boolean') return v ? 1 : 0;
          if (v instanceof Date) return `'${v.toISOString().slice(0, 19).replace('T', ' ')}'`;
          return `'${String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
        });
        return `(${vals.join(', ')})`;
      });
      sql += `INSERT INTO \`${table}\` (${cols}) VALUES\n${values.join(',\n')};\n\n`;
    }
  }

  sql += `SET FOREIGN_KEY_CHECKS=1;\n`;

  fs.writeFileSync(OUTPUT, sql, 'utf8');
  console.log(`\nExported to ${OUTPUT}`);
  console.log(`Lines: ${sql.split('\n').length}`);
  await db.end();
}

dump().catch(console.error);
