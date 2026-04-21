# Development Guide

## Quick Start

### 1. Setup

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Ensure PostgreSQL is running on localhost:5432
# Update .env with your database credentials

# Create database (in PostgreSQL)
createdb catalog_db
createuser -P catalog_user
```

### 2. Database Setup

```bash
# Run migrations
npm run db:migrate

# Seed sample data (optional)
npm run db:seed
```

### 3. Start Development Server

```bash
npm run dev
```

Server: `http://localhost:3000`

## Project Structure

Each layer follows a consistent pattern for maintainability.

### Adding a New Entity

Example: Adding a "Supplier" entity

#### 1. Create Type Definition

File: `src/types/index.ts`

```typescript
export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: Date;
  updated_at: Date;
}
```

#### 2. Create Database Migration

File: `src/migrations/002_add_suppliers.sql`

```sql
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_suppliers_email ON suppliers(email);

-- Link products to suppliers (optional)
ALTER TABLE products ADD COLUMN supplier_id UUID REFERENCES suppliers(id);
CREATE INDEX idx_products_supplier_id ON products(supplier_id);
```

#### 3. Create Validation Schema

File: `src/validation/schemas.ts`

```typescript
export const createSupplierSchema = Joi.object({
  name: Joi.string().required().max(255),
  email: Joi.string().required().email().unique(),
  phone: Joi.string().optional().max(20),
  address: Joi.string().optional(),
});

export const updateSupplierSchema = Joi.object({
  name: Joi.string().optional().max(255),
  email: Joi.string().optional().email(),
  phone: Joi.string().optional().max(20),
  address: Joi.string().optional(),
}).min(1);
```

#### 4. Create Repository

File: `src/repositories/SupplierRepository.ts`

```typescript
import { IDatabase } from 'pg-promise';
import { BaseRepository } from './BaseRepository';
import { Supplier } from '../types';

export class SupplierRepository extends BaseRepository {
  constructor(db: IDatabase<any>) {
    super(db, 'suppliers');
  }

  async create(data: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>): Promise<Supplier> {
    return this.db.one(
      `INSERT INTO suppliers (name, email, phone, address)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.name, data.email, data.phone, data.address]
    );
  }

  async findByEmail(email: string): Promise<Supplier | null> {
    return this.db.oneOrNone('SELECT * FROM suppliers WHERE email = $1', [email]);
  }

  async update(id: string, data: Partial<Supplier>): Promise<Supplier> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id' && key !== 'created_at') {
        fields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });

    if (fields.length === 0) {
      return this.db.one('SELECT * FROM suppliers WHERE id = $1', [id]);
    }

    fields.push(`updated_at = $${paramIndex}`);
    values.push(new Date());
    values.push(id);

    return this.db.one(
      `UPDATE suppliers SET ${fields.join(', ')} WHERE id = $${paramIndex + 1} RETURNING *`,
      values
    );
  }

  async getSupplierProducts(supplierId: string): Promise<any[]> {
    return this.db.any(
      'SELECT * FROM products WHERE supplier_id = $1 ORDER BY created_at DESC',
      [supplierId]
    );
  }
}
```

#### 5. Create Service

File: `src/services/SupplierService.ts`

```typescript
import { SupplierRepository } from '../repositories/SupplierRepository';
import { Supplier } from '../types';
import { IDatabase } from 'pg-promise';

export class SupplierService {
  private supplierRepo: SupplierRepository;

  constructor(db: IDatabase<any>) {
    this.supplierRepo = new SupplierRepository(db);
  }

  async createSupplier(data: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>): Promise<Supplier> {
    const existing = await this.supplierRepo.findByEmail(data.email);
    if (existing) {
      throw new Error(`Supplier with email '${data.email}' already exists`);
    }
    return this.supplierRepo.create(data);
  }

  async getSupplier(id: string): Promise<Supplier> {
    const supplier = await this.supplierRepo.findById(id);
    if (!supplier) {
      throw new Error('Supplier not found');
    }
    return supplier;
  }

  async listSuppliers(): Promise<Supplier[]> {
    return this.supplierRepo.findAll();
  }

  async updateSupplier(id: string, data: Partial<Supplier>): Promise<Supplier> {
    return this.supplierRepo.update(id, data);
  }

  async deleteSupplier(id: string): Promise<boolean> {
    return this.supplierRepo.delete(id);
  }

  async getSupplierProducts(id: string): Promise<any[]> {
    return this.supplierRepo.getSupplierProducts(id);
  }
}
```

#### 6. Create Routes

File: `src/routes/suppliers.ts`

```typescript
import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../database/connection';
import { SupplierService } from '../services/SupplierService';
import { apiKeyMiddleware, AuthRequest } from '../middleware/auth';
import { ApiError } from '../middleware/errorHandler';
import { createSupplierSchema, updateSupplierSchema } from '../validation/schemas';

const router = Router();
const supplierService = new SupplierService(db);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const suppliers = await supplierService.listSuppliers();
    res.json({ data: suppliers });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const supplier = await supplierService.getSupplier(req.params.id);
    res.json({ data: supplier });
  } catch (err) {
    next(err);
  }
});

router.get('/:id/products', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await supplierService.getSupplierProducts(req.params.id);
    res.json({ data: products });
  } catch (err) {
    next(err);
  }
});

router.post('/', apiKeyMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { error, value } = createSupplierSchema.validate(req.body);
    if (error) throw error;
    const supplier = await supplierService.createSupplier(value);
    res.status(201).json({ data: supplier });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', apiKeyMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { error, value } = updateSupplierSchema.validate(req.body);
    if (error) throw error;
    const supplier = await supplierService.updateSupplier(req.params.id, value);
    res.json({ data: supplier });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', apiKeyMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const deleted = await supplierService.deleteSupplier(req.params.id);
    if (!deleted) throw new ApiError(404, 'Supplier not found', 'NOT_FOUND');
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
```

#### 7. Register Routes

File: `src/index.ts`

```typescript
import supplierRoutes from './routes/suppliers';

// ... existing code ...

app.use('/api/v1/suppliers', supplierRoutes);
```

## Common Development Tasks

### Add a New Attribute Type

1. Update `src/types/index.ts`:
```typescript
export type DataType = 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';
```

2. Update validation in `ProductService`:
```typescript
case 'array':
  if (!Array.isArray(value)) {
    throw new Error(`${attr.label} must be an array`);
  }
  break;
```

3. Update schema in `src/validation/schemas.ts`

### Add Filtering Support for New Attribute

Already supported! Dynamic filters work automatically for all attributes:

```bash
curl "http://localhost:3000/api/v1/products?filters[new_attribute]=value"
```

### Add Required Validation

Already implemented in `ProductService.validateProductAttributes()`:

- Required attributes are enforced per product type
- Set `is_required: true` in `ProductTypeAttribute`

### Add New Index

1. Create migration file: `src/migrations/NNN_add_indexes.sql`
2. Run: `npm run db:migrate`

Example:
```sql
CREATE INDEX idx_products_created_at ON products(created_at DESC);
```

### Add Soft Delete

1. Add column to products table:
```sql
ALTER TABLE products ADD COLUMN deleted_at TIMESTAMP;
```

2. Update queries to exclude deleted:
```typescript
async findAll() {
  return this.db.any(
    'SELECT * FROM products WHERE deleted_at IS NULL'
  );
}
```

### Add Audit Logging

1. Create audit table:
```sql
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  entity_type VARCHAR(50),
  entity_id UUID,
  action VARCHAR(20),
  old_values JSONB,
  new_values JSONB,
  changed_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

2. Add to service methods:
```typescript
async logAudit(entityType: string, entityId: string, action: string, oldValues: any, newValues: any) {
  await this.db.none(
    `INSERT INTO audit_logs (entity_type, entity_id, action, old_values, new_values)
     VALUES ($1, $2, $3, $4, $5)`,
    [entityType, entityId, action, JSON.stringify(oldValues), JSON.stringify(newValues)]
  );
}
```

## Testing

### Unit Test Example

```typescript
import { ProductService } from '../services/ProductService';
import { ProductRepository } from '../repositories/ProductRepository';

jest.mock('../repositories/ProductRepository');

describe('ProductService', () => {
  let service: ProductService;
  let mockDb: jest.Mocked<IDatabase<any>>;

  beforeEach(() => {
    mockDb = {} as jest.Mocked<IDatabase<any>>;
    service = new ProductService(mockDb);
  });

  test('createProduct should validate attributes', async () => {
    const invalidData = {
      name: 'Product',
      slug: 'product',
      product_type_id: 'type-1',
      attributes: { voltage: 'invalid' }, // Should be number
      category_ids: [],
    };

    await expect(service.createProduct(invalidData)).rejects.toThrow();
  });
});
```

## Debugging

### Enable SQL Logging

In `src/database/connection.ts`:

```typescript
const pgp = pgPromise({
  query(e) {
    console.log('SQL:', e.query); // Log queries
  }
});
```

### Use TypeScript Strict Mode

Already enabled in `tsconfig.json`:

```json
"strict": true,
"noImplicitAny": true,
"strictNullChecks": true
```

### Error Breakpoints

In VS Code launch config (`.vscode/launch.json`):

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "program": "${workspaceFolder}/dist/index.js",
      "preLaunchTask": "npm: build",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"]
    }
  ]
}
```

## Performance Optimization Tips

### 1. Add Pagination

Always paginate list endpoints:
```typescript
const { page = 1, per_page = 20 } = query;
const offset = (page - 1) * per_page;
```

### 2. Use Indexes

Create indexes for frequently filtered columns:
```sql
CREATE INDEX idx_table_column ON table(column);
CREATE INDEX idx_table_json ON table USING gin(json_column);
```

### 3. Avoid N+1 Queries

Use joins instead of separate queries:

**Bad**:
```typescript
const products = await getProducts();
for (const product of products) {
  product.categories = await getCategories(product.id);
}
```

**Good**:
```typescript
const products = await db.any(`
  SELECT p.*, jsonb_agg(c.*)
  FROM products p
  LEFT JOIN product_categories pc ON p.id = pc.product_id
  LEFT JOIN categories c ON pc.category_id = c.id
  GROUP BY p.id
`);
```

### 4. Use Transactions

Group related operations:
```typescript
await db.tx(async (t) => {
  await t.none('UPDATE products SET status = $1', ['published']);
  await t.none('INSERT INTO audit_logs ...');
});
```

## Code Style

- Use TypeScript strictly
- Follow REST conventions
- Use snake_case for database columns
- Use camelCase for API responses (if converting)
- Keep functions small and focused
- Add comments only for non-obvious logic

## Deployment Checklist

- [ ] Build passes: `npm run build`
- [ ] Linting passes: `npm run lint` (if enabled)
- [ ] Environment variables configured
- [ ] Database migrations run: `npm run db:migrate`
- [ ] Connection pooling configured
- [ ] Error logging setup
- [ ] API key rotated
- [ ] CORS configured for production
- [ ] HTTPS enabled
- [ ] Health checks passing

## Support

For questions or issues:
1. Check existing code patterns in `/src`
2. Review type definitions in `/src/types/index.ts`
3. Look at similar implementations for guidance
4. Refer to API_EXAMPLES.md for endpoint patterns
