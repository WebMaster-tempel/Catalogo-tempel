# Product Catalog API (Battery PIM)

A scalable REST API for managing complex technical products (batteries) with dynamic attributes, hierarchical categories, and flexible filtering.

## Features

- **Dynamic Product Attributes**: JSONB-based storage for flexible product attributes per product type
- **Product Types**: Define different product types with specific attribute requirements
- **Hierarchical Categories**: Support for nested category structures
- **REST API**: Clean, versioned API endpoints
- **API Key Authentication**: Secure private endpoints
- **Filtering**: Advanced filtering on dynamic attributes
- **Media Management**: Store image and PDF references
- **Scalable**: Designed to handle 10,000+ products

## Architecture

```
src/
├── database/          # Database connection
├── migrations/        # SQL migrations
├── seeds/            # Sample data
├── types/            # TypeScript types
├── validation/       # Joi schemas
├── repositories/     # Data access layer
├── services/         # Business logic
├── middleware/       # Auth, error handling
├── routes/           # API endpoints
└── index.ts          # Express app
```

## Setup

### 1. Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### 2. Installation

```bash
npm install
```

### 3. Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:
```
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=catalog_db
DB_USER=catalog_user
DB_PASSWORD=catalog_password
API_KEY_SECRET=your-secret-key
```

### 4. Database Setup

```bash
# Run migrations
npm run db:migrate

# Seed sample data (optional)
npm run db:seed
```

### 5. Start Server

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

Server runs on `http://localhost:3000`

## API Documentation

### Base URL
```
/api/v1
```

### Authentication

Add header for private endpoints:
```
X-API-Key: your-secret-key
```

### Products

#### List Products
```
GET /api/v1/products
```

Query parameters:
- `page` (default: 1)
- `per_page` (default: 20, max: 100)
- `search` - Search name/description
- `category_id` - Filter by category UUID
- `product_type_id` - Filter by product type UUID
- `status` - Filter by status (draft/published/archived)
- `filters[attribute_name]` - Dynamic attribute filters

Example:
```bash
# Get page 2 with 50 items
curl "http://localhost:3000/api/v1/products?page=2&per_page=50"

# Search and filter
curl "http://localhost:3000/api/v1/products?search=battery&category_id=xxx"

# Filter by dynamic attributes
curl "http://localhost:3000/api/v1/products?filters[voltage]=12&filters[chemistry]=lithium"
```

Response:
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Battery Name",
      "slug": "battery-name",
      "description": "...",
      "product_type_id": "uuid",
      "status": "published",
      "attributes_json": {
        "voltage": 12,
        "capacity": 100000,
        "chemistry": "Lithium Ion"
      },
      "categories": [
        {"id": "uuid", "name": "Category", "slug": "category"}
      ],
      "media": [
        {"id": "uuid", "type": "image", "url": "...", "title": "..."}
      ]
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 1000,
      "total_pages": 50
    }
  }
}
```

#### Get Product Detail
```
GET /api/v1/products/{id}
```

#### Create Product (requires API key)
```
POST /api/v1/products
X-API-Key: your-secret-key
Content-Type: application/json

{
  "name": "Lithium Battery 12V",
  "slug": "li-battery-12v",
  "description": "High-performance battery",
  "product_type_id": "uuid",
  "status": "published",
  "attributes": {
    "voltage": 12,
    "capacity": 100000,
    "chemistry": "Lithium Ion",
    "weight": 15.5
  },
  "category_ids": ["uuid1", "uuid2"]
}
```

#### Update Product (requires API key)
```
PATCH /api/v1/products/{id}
X-API-Key: your-secret-key
Content-Type: application/json

{
  "name": "Updated Name",
  "status": "archived",
  "attributes": {
    "voltage": 12,
    "capacity": 100000
  }
}
```

#### Delete Product (requires API key)
```
DELETE /api/v1/products/{id}
X-API-Key: your-secret-key
```

#### Add Media to Product
```
POST /api/v1/products/{id}/media
X-API-Key: your-secret-key
Content-Type: application/json

{
  "type": "image",
  "url": "https://storage.example.com/product-1.jpg",
  "title": "Product Image",
  "order": 0
}
```

### Categories

#### List Categories
```
GET /api/v1/categories
```

#### Get Category Tree (hierarchical)
```
GET /api/v1/categories/tree
```

#### Create Category (requires API key)
```
POST /api/v1/categories
X-API-Key: your-secret-key
Content-Type: application/json

{
  "name": "Lithium Batteries",
  "slug": "lithium-batteries",
  "parent_id": "uuid",
  "description": "..."
}
```

### Product Types

#### List Product Types
```
GET /api/v1/product-types
```

#### Get Product Type with Attributes
```
GET /api/v1/product-types/{id}
```

Response:
```json
{
  "data": {
    "id": "uuid",
    "name": "Battery",
    "description": "...",
    "attributes": [
      {
        "id": "uuid",
        "name": "voltage",
        "label": "Voltage",
        "data_type": "number",
        "unit": "V",
        "is_filterable": true,
        "is_required": true,
        "order": 0
      }
    ]
  }
}
```

#### Create Product Type (requires API key)
```
POST /api/v1/product-types
X-API-Key: your-secret-key
Content-Type: application/json

{
  "name": "Power Bank",
  "description": "Portable power banks"
}
```

#### Assign Attribute to Product Type (requires API key)
```
POST /api/v1/product-types/{id}/attributes
X-API-Key: your-secret-key
Content-Type: application/json

{
  "attribute_id": "uuid",
  "is_required": true,
  "order": 0
}
```

### Attributes

#### List Attributes
```
GET /api/v1/attributes
```

#### Get Filterable Attributes
```
GET /api/v1/attributes/filterable
```

#### Create Attribute (requires API key)
```
POST /api/v1/attributes
X-API-Key: your-secret-key
Content-Type: application/json

{
  "name": "voltage",
  "label": "Voltage",
  "data_type": "number",
  "unit": "V",
  "is_filterable": true
}
```

## Example Queries

### Search batteries with specific voltage
```bash
curl "http://localhost:3000/api/v1/products?search=battery&filters[voltage]=12"
```

### Get published lithium batteries
```bash
curl "http://localhost:3000/api/v1/products?status=published&category_id=lithium-uuid&filters[chemistry]=lithium"
```

### Get products from category with pagination
```bash
curl "http://localhost:3000/api/v1/products?category_id=uuid&page=2&per_page=50"
```

## Performance Considerations

1. **Pagination**: Always use pagination for large datasets
2. **Indexes**: JSONB queries use GIN indexes for fast filtering
3. **Filtering**: Dynamic attribute filters work on indexed JSON columns
4. **Search**: Full-text search uses trigram indexes (pg_trgm)
5. **Media**: Store only URLs, actual files in S3-like storage

## Data Validation

- Product attributes validated against product type definition
- Required attributes enforced
- Data types validated (number, string, boolean, date)
- Slugs must be lowercase alphanumeric with hyphens

## Error Handling

All errors follow consistent format:
```json
{
  "error": "ERROR_CODE",
  "message": "Human readable message",
  "details": [
    {
      "path": "field.name",
      "message": "validation error"
    }
  ]
}
```

Common status codes:
- `200 OK` - Success
- `201 Created` - Resource created
- `204 No Content` - Resource deleted
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Missing API key
- `403 Forbidden` - Invalid API key
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate entry
- `500 Internal Server Error` - Server error

## Development

```bash
# Run in watch mode
npm run dev

# Build TypeScript
npm run build

# Lint code
npm run lint
```

## Future Enhancements

- [ ] Admin panel UI
- [ ] Public catalog frontend
- [ ] Caching layer (Redis)
- [ ] Rate limiting
- [ ] Batch product import/export
- [ ] Advanced analytics
- [ ] Webhook support
- [ ] GraphQL API

## License

ISC
