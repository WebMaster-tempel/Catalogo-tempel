# Product Catalog API - Usage Examples

Complete examples for using the Product Catalog API.

## Setup

First, ensure the server is running:

```bash
npm run dev
```

Server: `http://localhost:3000`

## Authentication

Private endpoints require the `X-API-Key` header:

```
X-API-Key: your-secret-key
```

## Complete Workflow Example

### 1. Create Product Type

```bash
curl -X POST http://localhost:3000/api/v1/product-types \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-key" \
  -d '{
    "name": "Lithium Battery",
    "description": "High-performance lithium batteries"
  }'
```

Response:
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Lithium Battery",
    "description": "High-performance lithium batteries",
    "created_at": "2024-04-21T10:00:00Z",
    "updated_at": "2024-04-21T10:00:00Z"
  }
}
```

### 2. Create Attributes

```bash
# Create voltage attribute
curl -X POST http://localhost:3000/api/v1/attributes \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-key" \
  -d '{
    "name": "voltage",
    "label": "Voltage",
    "data_type": "number",
    "unit": "V",
    "is_filterable": true
  }'

# Create capacity attribute
curl -X POST http://localhost:3000/api/v1/attributes \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-key" \
  -d '{
    "name": "capacity",
    "label": "Capacity",
    "data_type": "number",
    "unit": "mAh",
    "is_filterable": true
  }'

# Create chemistry attribute
curl -X POST http://localhost:3000/api/v1/attributes \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-key" \
  -d '{
    "name": "chemistry",
    "label": "Chemistry Type",
    "data_type": "string",
    "is_filterable": true
  }'
```

### 3. Assign Attributes to Product Type

```bash
# Voltage attribute (required, order 0)
curl -X POST http://localhost:3000/api/v1/product-types/550e8400-e29b-41d4-a716-446655440000/attributes \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-key" \
  -d '{
    "attribute_id": "voltage-uuid",
    "is_required": true,
    "order": 0
  }'

# Capacity attribute (required, order 1)
curl -X POST http://localhost:3000/api/v1/product-types/550e8400-e29b-41d4-a716-446655440000/attributes \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-key" \
  -d '{
    "attribute_id": "capacity-uuid",
    "is_required": true,
    "order": 1
  }'

# Chemistry attribute (optional, order 2)
curl -X POST http://localhost:3000/api/v1/product-types/550e8400-e29b-41d4-a716-446655440000/attributes \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-key" \
  -d '{
    "attribute_id": "chemistry-uuid",
    "is_required": false,
    "order": 2
  }'
```

### 4. Get Product Type with Attributes

```bash
curl http://localhost:3000/api/v1/product-types/550e8400-e29b-41d4-a716-446655440000
```

Response:
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Lithium Battery",
    "description": "High-performance lithium batteries",
    "created_at": "2024-04-21T10:00:00Z",
    "updated_at": "2024-04-21T10:00:00Z",
    "attributes": [
      {
        "id": "voltage-uuid",
        "name": "voltage",
        "label": "Voltage",
        "data_type": "number",
        "unit": "V",
        "is_filterable": true,
        "is_required": true,
        "order": 0
      },
      {
        "id": "capacity-uuid",
        "name": "capacity",
        "label": "Capacity",
        "data_type": "number",
        "unit": "mAh",
        "is_filterable": true,
        "is_required": true,
        "order": 1
      },
      {
        "id": "chemistry-uuid",
        "name": "chemistry",
        "label": "Chemistry Type",
        "data_type": "string",
        "is_filterable": true,
        "is_required": false,
        "order": 2
      }
    ]
  }
}
```

### 5. Create Categories

```bash
# Main category
curl -X POST http://localhost:3000/api/v1/categories \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-key" \
  -d '{
    "name": "Consumer",
    "slug": "consumer",
    "description": "Consumer batteries"
  }'

# Sub-category
curl -X POST http://localhost:3000/api/v1/categories \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-key" \
  -d '{
    "name": "Lithium Ion",
    "slug": "lithium-ion",
    "parent_id": "consumer-uuid",
    "description": "Lithium Ion batteries"
  }'
```

### 6. Create Products

```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-key" \
  -d '{
    "name": "Premium Lithium Battery 12V 100Ah",
    "slug": "premium-li-12v-100ah",
    "description": "High-performance lithium battery suitable for renewable energy storage",
    "product_type_id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "published",
    "attributes": {
      "voltage": 12,
      "capacity": 100000,
      "chemistry": "Lithium Ion"
    },
    "category_ids": ["lithium-ion-uuid"]
  }'
```

Response:
```json
{
  "data": {
    "id": "product-uuid-1",
    "name": "Premium Lithium Battery 12V 100Ah",
    "slug": "premium-li-12v-100ah",
    "description": "High-performance lithium battery suitable for renewable energy storage",
    "product_type_id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "published",
    "created_at": "2024-04-21T10:05:00Z",
    "updated_at": "2024-04-21T10:05:00Z",
    "attributes_json": {
      "voltage": 12,
      "capacity": 100000,
      "chemistry": "Lithium Ion"
    },
    "categories": [
      {
        "id": "lithium-ion-uuid",
        "name": "Lithium Ion",
        "slug": "lithium-ion"
      }
    ],
    "media": []
  }
}
```

### 7. Add Media to Product

```bash
# Add product image
curl -X POST http://localhost:3000/api/v1/products/product-uuid-1/media \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-key" \
  -d '{
    "type": "image",
    "url": "https://storage.example.com/products/li-battery-1.jpg",
    "title": "Product Image 1",
    "order": 0
  }'

# Add technical specifications PDF
curl -X POST http://localhost:3000/api/v1/products/product-uuid-1/media \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-key" \
  -d '{
    "type": "pdf",
    "url": "https://storage.example.com/products/li-battery-specs.pdf",
    "title": "Technical Specifications",
    "order": 1
  }'
```

### 8. List Products

```bash
# Get first page of products
curl "http://localhost:3000/api/v1/products?page=1&per_page=20"

# Search products
curl "http://localhost:3000/api/v1/products?search=lithium"

# Filter by product type
curl "http://localhost:3000/api/v1/products?product_type_id=550e8400-e29b-41d4-a716-446655440000"

# Filter by category
curl "http://localhost:3000/api/v1/products?category_id=lithium-ion-uuid"

# Filter by status
curl "http://localhost:3000/api/v1/products?status=published"
```

### 9. Dynamic Attribute Filtering

```bash
# Filter by voltage
curl "http://localhost:3000/api/v1/products?filters[voltage]=12"

# Filter by capacity
curl "http://localhost:3000/api/v1/products?filters[capacity]=100000"

# Filter by chemistry
curl "http://localhost:3000/api/v1/products?filters[chemistry]=Lithium%20Ion"

# Multiple filters combined
curl "http://localhost:3000/api/v1/products?filters[voltage]=12&filters[chemistry]=Lithium%20Ion"

# With search and filters
curl "http://localhost:3000/api/v1/products?search=battery&filters[voltage]=12&page=1&per_page=50"
```

### 10. Get Product Detail

```bash
curl "http://localhost:3000/api/v1/products/product-uuid-1"
```

Response:
```json
{
  "data": {
    "id": "product-uuid-1",
    "name": "Premium Lithium Battery 12V 100Ah",
    "slug": "premium-li-12v-100ah",
    "description": "High-performance lithium battery suitable for renewable energy storage",
    "product_type_id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "published",
    "created_at": "2024-04-21T10:05:00Z",
    "updated_at": "2024-04-21T10:05:00Z",
    "attributes_json": {
      "voltage": 12,
      "capacity": 100000,
      "chemistry": "Lithium Ion"
    },
    "categories": [
      {
        "id": "lithium-ion-uuid",
        "name": "Lithium Ion",
        "slug": "lithium-ion"
      }
    ],
    "media": [
      {
        "id": "media-uuid-1",
        "type": "image",
        "url": "https://storage.example.com/products/li-battery-1.jpg",
        "title": "Product Image 1",
        "order": 0,
        "created_at": "2024-04-21T10:10:00Z"
      },
      {
        "id": "media-uuid-2",
        "type": "pdf",
        "url": "https://storage.example.com/products/li-battery-specs.pdf",
        "title": "Technical Specifications",
        "order": 1,
        "created_at": "2024-04-21T10:11:00Z"
      }
    ]
  }
}
```

### 11. Update Product

```bash
curl -X PATCH http://localhost:3000/api/v1/products/product-uuid-1 \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-key" \
  -d '{
    "status": "archived",
    "description": "Updated description",
    "attributes": {
      "voltage": 12,
      "capacity": 100000,
      "chemistry": "Lithium Ion Polymer"
    }
  }'
```

### 12. Get Categories Tree

```bash
curl "http://localhost:3000/api/v1/categories/tree"
```

Response:
```json
{
  "data": [
    {
      "id": "consumer-uuid",
      "name": "Consumer",
      "slug": "consumer",
      "parent_id": null,
      "level": 0
    },
    {
      "id": "lithium-ion-uuid",
      "name": "Lithium Ion",
      "slug": "lithium-ion",
      "parent_id": "consumer-uuid",
      "level": 1
    }
  ]
}
```

### 13. Delete Product

```bash
curl -X DELETE http://localhost:3000/api/v1/products/product-uuid-1 \
  -H "X-API-Key: your-secret-key"
```

## Advanced Filtering Scenarios

### Scenario 1: Find all 12V batteries with 100Ah capacity

```bash
curl "http://localhost:3000/api/v1/products?filters[voltage]=12&filters[capacity]=100000"
```

### Scenario 2: Find lithium batteries in consumer category

```bash
curl "http://localhost:3000/api/v1/products?category_id=consumer-uuid&filters[chemistry]=Lithium%20Ion"
```

### Scenario 3: Search and filter published batteries

```bash
curl "http://localhost:3000/api/v1/products?search=premium&status=published&filters[voltage]=12"
```

### Scenario 4: Paginated product listing with filters

```bash
curl "http://localhost:3000/api/v1/products?page=2&per_page=50&product_type_id=battery-uuid&status=published"
```

## Error Examples

### Missing Required Field

Request:
```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-key" \
  -d '{
    "name": "Battery",
    "slug": "battery"
  }'
```

Response (400):
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": [
    {
      "path": "product_type_id",
      "message": "\"product_type_id\" is required"
    },
    {
      "path": "attributes",
      "message": "\"attributes\" is required"
    }
  ]
}
```

### Invalid Attribute Data Type

Request:
```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-key" \
  -d '{
    "name": "Battery",
    "slug": "battery",
    "product_type_id": "type-uuid",
    "attributes": {
      "voltage": "twelve"
    }
  }'
```

Response (400):
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Voltage must be a number"
}
```

### Missing API Key

Request:
```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Battery"
  }'
```

Response (401):
```json
{
  "error": "Unauthorized",
  "message": "Missing API key"
}
```

### Invalid API Key

Response (403):
```json
{
  "error": "Invalid API key",
  "message": "The provided API key is not valid"
}
```

### Resource Not Found

Response (404):
```json
{
  "error": "NOT_FOUND",
  "message": "Product not found"
}
```

### Duplicate Entry

Request:
```bash
curl -X POST http://localhost:3000/api/v1/categories \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-key" \
  -d '{
    "name": "Consumer",
    "slug": "consumer"
  }'
```

Response (409):
```json
{
  "error": "DUPLICATE_ENTRY",
  "message": "Category with slug 'consumer' already exists"
}
```

## Testing with cURL Script

Save as `test-api.sh`:

```bash
#!/bin/bash

API_URL="http://localhost:3000/api/v1"
API_KEY="your-secret-key"

echo "=== Testing Product Catalog API ==="

echo "\n1. List products"
curl -s "$API_URL/products" | jq .

echo "\n2. List attributes"
curl -s "$API_URL/attributes" | jq .

echo "\n3. List product types"
curl -s "$API_URL/product-types" | jq .

echo "\n4. List categories"
curl -s "$API_URL/categories" | jq .

echo "\n=== Test completed ==="
```

Run:
```bash
chmod +x test-api.sh
./test-api.sh
```
