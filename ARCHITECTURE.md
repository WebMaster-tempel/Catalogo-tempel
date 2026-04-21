# Product Catalog API - Architecture Documentation

## System Overview

The Product Catalog API is a scalable REST API for managing complex technical products with dynamic attributes. The system uses a modular architecture with clear separation of concerns.

```
┌─────────────────────────────────────────────────────────────┐
│                        Express.js Server                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │               Route Handlers (Controllers)            │  │
│  │  /products  /categories  /attributes  /product-types │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Middleware Layer                           │  │
│  │  - Authentication (API Key)                          │  │
│  │  - Validation (Joi schemas)                          │  │
│  │  - Error Handling                                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Service Layer (Business Logic)               │  │
│  │  - ProductService                                    │  │
│  │  - AttributeService                                  │  │
│  │  - CategoryService                                   │  │
│  │  - ProductTypeService                                │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │      Repository Layer (Data Access)                  │  │
│  │  - ProductRepository                                 │  │
│  │  - AttributeRepository                               │  │
│  │  - CategoryRepository                                │  │
│  │  - ProductTypeRepository                             │  │
│  │  - MediaRepository                                   │  │
│  │  - ProductAttributeValuesRepository                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         PostgreSQL Database                          │  │
│  │  - Relational tables for entities                    │  │
│  │  - JSONB for dynamic attributes                      │  │
│  │  - GIN indexes for performance                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
src/
├── database/
│   └── connection.ts              # PostgreSQL connection setup
├── migrations/
│   ├── 001_initial_schema.sql     # Database schema
│   └── runner.ts                  # Migration executor
├── seeds/
│   └── index.ts                   # Sample data
├── types/
│   └── index.ts                   # TypeScript interfaces
├── validation/
│   └── schemas.ts                 # Joi validation schemas
├── repositories/
│   ├── BaseRepository.ts          # Base class for all repos
│   ├── ProductRepository.ts       # Product queries
│   ├── AttributeRepository.ts     # Attribute queries
│   ├── ProductTypeRepository.ts   # Product type queries
│   ├── CategoryRepository.ts      # Category queries
│   ├── MediaRepository.ts         # Media queries
│   └── ProductAttributeValuesRepository.ts  # Attribute values
├── services/
│   ├── ProductService.ts          # Product business logic
│   ├── AttributeService.ts        # Attribute business logic
│   ├── ProductTypeService.ts      # Product type business logic
│   └── CategoryService.ts         # Category business logic
├── routes/
│   ├── products.ts                # Product endpoints
│   ├── attributes.ts              # Attribute endpoints
│   ├── product-types.ts           # Product type endpoints
│   └── categories.ts              # Category endpoints
├── middleware/
│   ├── auth.ts                    # API key authentication
│   └── errorHandler.ts            # Error handling
└── index.ts                       # Express app entry point
```

## Core Concepts

### 1. Product Type System

Products are organized by **Product Types**. Each type defines which attributes are relevant for that product category.

```
Product Type: "Battery"
├── Attributes:
│   ├── Voltage (required, number)
│   ├── Capacity (required, number)
│   ├── Chemistry (optional, string)
│   └── Weight (optional, number)
└── Products:
    ├── Li-ion Battery 12V 100Ah
    ├── Lead Acid 24V
    └── ...
```

### 2. Dynamic Attributes

Attributes are flexible and stored in JSONB columns, allowing:
- Product types to have different attribute sets
- Validation based on data type
- Required/optional fields per type
- Filtering on JSON values

Schema:
```sql
ProductTypeAttribute {
  product_type_id UUID
  attribute_id UUID
  is_required BOOLEAN
  order INT
}

ProductAttributeValues {
  product_id UUID
  attributes_json JSONB  -- {"voltage": 12, "capacity": 100000}
}
```

### 3. Hierarchical Categories

Categories support parent-child relationships for nested structures.

```
Industrial
├── Lead Acid
└── Ni-MH
Consumer
├── Lithium Ion
└── Lithium Polymer
```

Query: `WITH RECURSIVE` for tree traversal.

### 4. Media Management

Products can have associated images and PDFs. Only URLs are stored; actual files reside in S3-like storage.

```json
{
  "id": "media-1",
  "product_id": "product-1",
  "type": "image",
  "url": "https://storage.example.com/...",
  "title": "Product Image",
  "order": 0
}
```

## Data Model

### Key Tables

1. **products** - Core product data
   - id, name, slug, description, product_type_id, status, main_image_id
   - Indexes: product_type_id, status, slug, full-text search

2. **product_types** - Product categories/types
   - id, name, description

3. **attributes** - Global attribute definitions
   - id, name, label, data_type, unit, is_filterable

4. **product_type_attributes** - Mapping of attributes to types
   - product_type_id, attribute_id, is_required, order

5. **product_attribute_values** - Dynamic attribute values (JSONB)
   - product_id, attributes_json
   - Indexed with GIN for fast JSON queries

6. **categories** - Hierarchical category structure
   - id, name, slug, parent_id, description

7. **product_categories** - Many-to-many relationship
   - product_id, category_id

8. **media** - Associated images and documents
   - id, product_id, type, url, title, order

## Key Design Decisions

### 1. JSONB for Dynamic Attributes

**Why**: Different product types need different attributes. JSONB allows flexibility without schema migrations.

**Trade-offs**:
- ✅ Schema flexibility
- ✅ No null columns for unused attributes
- ✅ Fast GIN indexing
- ❌ Type safety at database level (mitigated with application validation)

### 2. Repositories Pattern

Each entity has a dedicated repository class with database queries.

**Benefits**:
- Single source of truth for data access
- Easy to test with mocks
- Reusable query logic

### 3. Services Layer

Services contain business logic: validation, transactions, error handling.

**Responsibilities**:
- Validate product attributes against type definition
- Manage relationships (categories, media)
- Enforce required fields
- Handle transactions

### 4. API Key Authentication

Simple but effective for internal APIs.

**Implementation**:
- Header: `X-API-Key`
- Middleware: `apiKeyMiddleware`
- Routes: Apply to write endpoints only

### 5. Pagination Enforced

All list endpoints return paginated results.

**Benefits**:
- Memory efficient
- Prevents timeout on large queries
- Consistent API response

### 6. Standardized Error Format

All errors follow consistent JSON structure.

```json
{
  "error": "ERROR_CODE",
  "message": "Human readable message",
  "details": [{"path": "field", "message": "error"}]
}
```

## Performance Considerations

### Indexes

1. **Single Column**:
   - `products(product_type_id)` - Filter by type
   - `products(status)` - Filter by status
   - `products(slug)` - Lookup by slug
   - `categories(parent_id)` - Tree traversal
   - `media(product_id)` - Get product media

2. **Full-Text Search**:
   - `products(name gin_trgm_ops)` - Trigram index on name
   - `products(description gin_trgm_ops)` - Search description

3. **JSON**:
   - `product_attribute_values(attributes_json)` - GIN index for JSON queries

### Query Optimization

1. **Pagination**:
   ```sql
   SELECT * FROM products LIMIT 20 OFFSET 0
   ```

2. **Dynamic Filtering**:
   ```sql
   SELECT p.* FROM products p
   LEFT JOIN product_attribute_values pav ON p.id = pav.product_id
   WHERE pav.attributes_json->>'voltage' = '12'
   ```

3. **Aggregation**:
   ```sql
   SELECT p.*, jsonb_agg(c.*) FROM products p
   LEFT JOIN product_categories pc ON p.id = pc.product_id
   LEFT JOIN categories c ON pc.category_id = c.id
   GROUP BY p.id
   ```

### Caching Opportunities (Future)

1. **Product Types with Attributes**: Cache ~1 minute
2. **Categories Tree**: Cache ~5 minutes
3. **Filterable Attributes**: Cache ~10 minutes
4. **Popular Products**: Cache ~1 hour

## API Design Principles

### 1. RESTful Endpoints

```
GET    /api/v1/products           # List
GET    /api/v1/products/:id       # Get
POST   /api/v1/products           # Create
PATCH  /api/v1/products/:id       # Update
DELETE /api/v1/products/:id       # Delete
```

### 2. Consistent Response Format

```json
{
  "data": {...},
  "meta": {"pagination": {...}}
}
```

### 3. Query Parameters

- Filtering: `?filters[attribute]=value`
- Pagination: `?page=1&per_page=20`
- Search: `?search=term`
- Relations: `?category_id=uuid&product_type_id=uuid`

### 4. Authentication

- Public endpoints: No authentication
- Private endpoints: Require `X-API-Key` header

## Transaction Management

Using `pg-promise` transactions for data consistency:

```typescript
await db.tx(async (t) => {
  // Create product
  const product = await productRepo.create(data);
  
  // Create attribute values
  await attributeValuesRepo.create(product.id, attributes);
  
  // Assign categories
  for (const categoryId of categoryIds) {
    await categoryRepo.assignProduct(product.id, categoryId);
  }
});
```

## Error Handling

1. **Validation Errors** (400):
   - Missing required fields
   - Invalid data types
   - Schema violations

2. **Authentication Errors** (401/403):
   - Missing API key
   - Invalid API key

3. **Not Found** (404):
   - Resource doesn't exist

4. **Conflict** (409):
   - Duplicate entries
   - Constraint violations

5. **Server Errors** (500):
   - Database connection failures
   - Unexpected exceptions

## Scalability

### Current Design Handles

- 10,000+ products without performance issues
- Pagination ensures memory efficiency
- GIN indexes optimize JSON queries
- Connection pooling via pg-promise

### Future Enhancements

1. **Read Replicas**: Database scaling
2. **Caching Layer**: Redis for hot data
3. **Queue**: Background jobs (exports, imports)
4. **Search Engine**: Elasticsearch for advanced search
5. **GraphQL**: Alternative API layer
6. **Webhooks**: Real-time integrations

## Security

1. **API Key Authentication**: Header-based
2. **Input Validation**: Joi schemas
3. **SQL Injection Prevention**: Parameterized queries
4. **Error Messages**: Non-sensitive in responses
5. **HTTPS**: Use in production
6. **CORS**: Configure for specific origins

## Testing Strategy

### Unit Tests (Future)
- Service business logic
- Repository queries
- Validation schemas

### Integration Tests (Future)
- API endpoints
- Database transactions
- Error scenarios

### Load Tests (Future)
- Pagination with 10k+ products
- Concurrent requests
- Complex filtering

## Deployment

### Requirements

- Node.js 18+
- PostgreSQL 12+
- Environment variables (.env)

### Build Process

```bash
npm install
npm run build
npm run db:migrate
npm start
```

### Environment Setup

```env
NODE_ENV=production
PORT=3000
DB_HOST=prod.db.example.com
DB_PORT=5432
DB_NAME=catalog_db
DB_USER=catalog_user
DB_PASSWORD=secure_password
API_KEY_SECRET=random_secret_key
```

## Monitoring (Future)

- Request logging
- Error tracking (Sentry)
- Performance monitoring (New Relic)
- Database query monitoring
- Uptime monitoring

## Documentation

- **README.md**: Setup and quick start
- **API_EXAMPLES.md**: Complete usage examples
- **ARCHITECTURE.md**: This document
- **Code comments**: Critical logic only
