# Catálogo Kaise — Guía completa de la API

Base URL: `http://localhost:3000/api/v1`

---

## Autenticación

Los endpoints de escritura (POST, PATCH, DELETE) requieren la cabecera:

```
X-API-Key: <tu-clave-secreta>
```

Los endpoints de lectura (GET) son públicos. La clave se configura en
`API_KEY_SECRET` del archivo `.env`.

---

## Índice de endpoints

| Recurso | Método | Ruta | Auth |
|---|---|---|---|
| Productos | GET | `/products` | No |
| Productos | GET | `/products/:id` | No |
| Productos | POST | `/products` | Sí |
| Productos | PATCH | `/products/:id` | Sí |
| Productos | DELETE | `/products/:id` | Sí |
| Media | POST | `/products/:id/media` | Sí |
| Media | DELETE | `/products/:id/media/:mediaId` | Sí |
| Uploads | POST | `/uploads` | Sí |
| Categorías | GET | `/categories` | No |
| Categorías | GET | `/categories/tree` | No |
| Categorías | GET | `/categories/:id` | No |
| Categorías | GET | `/categories/:id/children` | No |
| Categorías | POST | `/categories` | Sí |
| Categorías | PATCH | `/categories/:id` | Sí |
| Categorías | DELETE | `/categories/:id` | Sí |
| Features | GET | `/categories/:id/features` | No |
| Features | POST | `/categories/:id/features` | Sí |
| Features | PATCH | `/categories/:id/features/:fid` | Sí |
| Features | DELETE | `/categories/:id/features/:fid` | Sí |
| Features | POST | `/categories/:id/features/reorder` | Sí |
| Tipos | GET | `/product-types` | No |
| Tipos | GET | `/product-types/:id` | No |
| Tipos | POST | `/product-types` | Sí |
| Tipos | DELETE | `/product-types/:id` | Sí |
| Tipo↔Atributo | POST | `/product-types/:id/attributes` | Sí |
| Tipo↔Atributo | DELETE | `/product-types/:id/attributes/:aid` | Sí |
| Atributos | GET | `/attributes` | No |
| Atributos | GET | `/attributes/filterable` | No |
| Atributos | GET | `/attributes/:id` | No |
| Atributos | POST | `/attributes` | Sí |
| Atributos | DELETE | `/attributes/:id` | Sí |

---

## 1. Productos

### GET /products — Listar productos

```bash
# Todos los productos publicados, paginados
curl "http://localhost:3000/api/v1/products?status=published&page=1&per_page=20"

# Buscar por nombre
curl "http://localhost:3000/api/v1/products?search=KBSG"

# Filtrar por gamma (categoría)
curl "http://localhost:3000/api/v1/products?category_id=a13c1e00-1000-4000-8000-000000000004"

# Filtrar por tipo de producto
curl "http://localhost:3000/api/v1/products?product_type_id=a11c1e00-0000-4000-8000-000000000001"

# Filtros por atributos dinámicos (JSONB)
curl "http://localhost:3000/api/v1/products?filters[voltage]=12"
curl "http://localhost:3000/api/v1/products?filters[capacity]=100"
curl "http://localhost:3000/api/v1/products?filters[voltage]=12&filters[capacity]=100"

# Combinación completa
curl "http://localhost:3000/api/v1/products?search=KBSG&status=published&category_id=a13c1e00-1000-4000-8000-000000000004&page=1&per_page=50"
```

**Parámetros de query:**

| Parámetro | Tipo | Default | Descripción |
|---|---|---|---|
| `page` | integer | 1 | Página (≥1) |
| `per_page` | integer | 20 | Resultados por página (1–100) |
| `search` | string | — | Texto libre — busca en nombre, descripción del producto **y** nombre, aplicaciones, características y descripción de su categoría (ILIKE) |
| `category_id` | UUID | — | Filtrar por ID de categoría exacto |
| `product_type_id` | UUID | — | Filtrar por tipo de producto |
| `status` | string | — | `draft`, `published`, `archived` |
| `filters[campo]` | any | — | Filtro exacto por atributo dinámico JSONB del producto |
| **Filtros de categoría** | | | |
| `application` | string | — | Keyword en `categories.applications` (ILIKE) — ej: `Telecomunicaciones` |
| `technology` | string | — | Tecnología de la categoría (ILIKE) — ej: `VRLA-AGM`, `LiFePO4`, `VRLA-GEL` |
| `plate_type` | string | — | Tipo de placa (ILIKE) — ej: `Tubular`, `Flat`, `Prismática` |
| `eurobat` | boolean | — | Solo gammas certificadas Eurobat (`true`/`false`) |
| `capacity_range` | string | — | Keyword en rango de capacidad textual de la categoría — ej: `3000`, `C10` |
| `characteristics` | string | — | Keyword en características técnicas de la categoría — ej: `-40°C`, `gel puro`, `PSoC` |
| **Filtros numéricos del producto** | | | |
| `capacity_min` | number | — | Capacidad mínima en Ah (filtra `attributes_json.capacity_nominal_10h`) |
| `capacity_max` | number | — | Capacidad máxima en Ah (filtra `attributes_json.capacity_nominal_10h`) |
| `voltage` | number | — | Tensión exacta en V (filtra `attributes_json.voltage`) — usar `12.8` para Litio |

> Todos los parámetros son combinables. La lógica es `AND` entre parámetros.

**Respuesta:**

```json
{
  "data": [
    {
      "id": "a13c1e00-3000-4000-8000-000000000001",
      "name": "KBSG12100",
      "slug": "kbsg12100",
      "description": "Batería VRLA-GEL 12V 100Ah Solar Gel",
      "product_type_id": "a11c1e00-0000-4000-8000-000000000001",
      "status": "published",
      "main_image_id": null,
      "attributes_json": {
        "model_code": "KBSG12100",
        "voltage": 12,
        "capacity": 100,
        "capacity_rate": "C100",
        "weight": 31.5
      },
      "categories": [
        {
          "id": "a13c1e00-1000-4000-8000-000000000004",
          "name": "KAISE SOLAR GEL",
          "slug": "kaise-solar-gel"
        }
      ],
      "media": [],
      "created_at": "2024-10-01T10:00:00Z",
      "updated_at": "2024-10-01T10:00:00Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 847,
      "total_pages": 43
    }
  }
}
```

---

### GET /products/:id — Detalle de producto

```bash
curl "http://localhost:3000/api/v1/products/a13c1e00-3000-4000-8000-000000000001"
```

**Respuesta:** igual que un ítem del listado, con todos los campos expandidos.

---

### POST /products — Crear producto

```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -H "X-API-Key: tu-clave" \
  -d '{
    "name": "KBSG12200",
    "slug": "kbsg12200",
    "description": "Batería VRLA-GEL 12V 200Ah Solar Gel — terminal M8",
    "product_type_id": "a11c1e00-0000-4000-8000-000000000001",
    "status": "published",
    "attributes": {
      "model_code": "KBSG12200",
      "voltage": 12,
      "capacity": 200,
      "capacity_rate": "C100",
      "length": 522,
      "width": 240,
      "height": 219,
      "total_height": 224,
      "terminal_type": "M8",
      "weight": 65.0
    },
    "category_ids": ["a13c1e00-1000-4000-8000-000000000004"]
  }'
```

**Campos requeridos:** `name`, `slug`, `product_type_id`, `attributes`

**Respuesta (201):**

```json
{
  "data": {
    "id": "nuevo-uuid",
    "name": "KBSG12200",
    "slug": "kbsg12200",
    "status": "published",
    "attributes_json": { "voltage": 12, "capacity": 200, ... },
    "categories": [{ "id": "...", "name": "KAISE SOLAR GEL" }],
    "media": [],
    "created_at": "2025-04-24T12:00:00Z",
    "updated_at": "2025-04-24T12:00:00Z"
  }
}
```

---

### PATCH /products/:id — Actualizar producto

Solo se envían los campos a modificar.

```bash
# Publicar un borrador
curl -X PATCH http://localhost:3000/api/v1/products/nuevo-uuid \
  -H "Content-Type: application/json" \
  -H "X-API-Key: tu-clave" \
  -d '{ "status": "published" }'

# Actualizar atributos
curl -X PATCH http://localhost:3000/api/v1/products/nuevo-uuid \
  -H "Content-Type: application/json" \
  -H "X-API-Key: tu-clave" \
  -d '{
    "attributes": { "voltage": 12, "capacity": 200, "weight": 66.5 },
    "category_ids": [
      "a13c1e00-1000-4000-8000-000000000004",
      "a13c1e00-1000-4000-8000-000000000005"
    ]
  }'
```

---

### DELETE /products/:id — Eliminar producto

```bash
curl -X DELETE http://localhost:3000/api/v1/products/nuevo-uuid \
  -H "X-API-Key: tu-clave"
```

**Respuesta (200):** `{ "data": { "id": "...", "deleted": true } }`

---

## 2. Media de productos

### POST /products/:id/media — Añadir imagen o PDF

```bash
# Añadir imagen
curl -X POST http://localhost:3000/api/v1/products/nuevo-uuid/media \
  -H "Content-Type: application/json" \
  -H "X-API-Key: tu-clave" \
  -d '{
    "type": "image",
    "url": "https://cdn.example.com/kbsg12200-front.jpg",
    "title": "Vista frontal",
    "order": 0
  }'

# Añadir ficha técnica PDF
curl -X POST http://localhost:3000/api/v1/products/nuevo-uuid/media \
  -H "Content-Type: application/json" \
  -H "X-API-Key: tu-clave" \
  -d '{
    "type": "pdf",
    "url": "https://cdn.example.com/kbsg12200-datasheet.pdf",
    "title": "Ficha técnica KBSG12200",
    "order": 1
  }'
```

### DELETE /products/:id/media/:mediaId — Eliminar media

```bash
curl -X DELETE http://localhost:3000/api/v1/products/nuevo-uuid/media/media-uuid \
  -H "X-API-Key: tu-clave"
```

---

## 3. Subida de archivos

### POST /uploads — Subir archivo (multipart)

```bash
curl -X POST http://localhost:3000/api/v1/uploads \
  -H "X-API-Key: tu-clave" \
  -F "file=@/ruta/local/foto.jpg"
```

**Respuesta:**

```json
{
  "data": {
    "url": "https://cdn.example.com/uploads/foto-uuid.jpg",
    "type": "image"
  }
}
```

---

## 4. Categorías

### GET /categories — Lista plana de todas las categorías

```bash
curl "http://localhost:3000/api/v1/categories"
```

**Respuesta:**

```json
{
  "data": [
    {
      "id": "a15c1e00-1000-4000-8000-000000000001",
      "name": "Litio",
      "slug": "litio",
      "parent_id": null,
      "level": 0,
      "technology": null,
      "plate_type": null,
      "design_life_years": null,
      "cycles": null,
      "capacity_range": null,
      "eurobat": false
    },
    {
      "id": "a11c1e00-1000-4000-8000-000000000001",
      "name": "KAISE LITIO",
      "slug": "kaise-litio",
      "parent_id": "a15c1e00-1000-4000-8000-000000000002",
      "level": 2,
      "technology": "LiFePO4",
      "plate_type": "Prismática",
      "design_life_years": "+10 años",
      "cycles": "+6000 (algunos 48V: +5000)",
      "capacity_range": "7 – 300 Ah",
      "eurobat": false
    }
  ]
}
```

---

### GET /categories/tree — Árbol jerárquico

```bash
curl "http://localhost:3000/api/v1/categories/tree"
```

Devuelve la lista plana ordenada por nivel (útil para reconstruir el árbol en el cliente).

---

### GET /categories/:id — Detalle de categoría

```bash
# Gamma KAISE SOLAR GEL
curl "http://localhost:3000/api/v1/categories/a13c1e00-1000-4000-8000-000000000004"
```

**Respuesta:**

```json
{
  "data": {
    "id": "a13c1e00-1000-4000-8000-000000000004",
    "name": "KAISE SOLAR GEL",
    "slug": "kaise-solar-gel",
    "parent_id": "a15c1e00-1000-4000-8000-000000000009",
    "technology": "VRLA-GEL",
    "plate_type": "Flat",
    "design_life_years": "10-12 años",
    "cycles": "≈1200",
    "capacity_range": "80 – 250 Ah (C100)",
    "eurobat": true,
    "description": "Las baterías de la serie Solar GEL..."
  }
}
```

---

### GET /categories/:id/children — Hijos directos

```bash
# Subcategorías directas de AGM
curl "http://localhost:3000/api/v1/categories/a15c1e00-1000-4000-8000-000000000006/children"
```

---

### POST /categories — Crear categoría

```bash
# Crear nodo estructural
curl -X POST http://localhost:3000/api/v1/categories \
  -H "Content-Type: application/json" \
  -H "X-API-Key: tu-clave" \
  -d '{
    "name": "Gel Híbrido",
    "slug": "gel-hibrido",
    "parent_id": "a15c1e00-1000-4000-8000-000000000005",
    "description": "Baterías VRLA de electrolito gel híbrido"
  }'

# Crear gamma (nodo hoja)
curl -X POST http://localhost:3000/api/v1/categories \
  -H "Content-Type: application/json" \
  -H "X-API-Key: tu-clave" \
  -d '{
    "name": "KAISE GEL PLUS",
    "slug": "kaise-gel-plus",
    "parent_id": "gel-hibrido-uuid"
  }'
```

---

### PATCH /categories/:id — Actualizar categoría

```bash
curl -X PATCH http://localhost:3000/api/v1/categories/kaise-gel-plus-uuid \
  -H "Content-Type: application/json" \
  -H "X-API-Key: tu-clave" \
  -d '{
    "name": "KAISE GEL PLUS PRO",
    "slug": "kaise-gel-plus-pro"
  }'
```

---

### DELETE /categories/:id — Eliminar categoría

```bash
curl -X DELETE http://localhost:3000/api/v1/categories/kaise-gel-plus-uuid \
  -H "X-API-Key: tu-clave"
```

> **Advertencia:** Eliminar una categoría elimina también todas sus features (ON DELETE CASCADE).

---

## 5. Features de categorías

Las features almacenan tres tipos de información por gamma:

| `type` | Descripción |
|---|---|
| `application` | Aplicaciones descriptivas (texto libre) |
| `characteristic` | Características técnicas (texto libre) |
| `compatibility` | Matriz de compatibilidad con suitability |

### GET /categories/:id/features — Listar features

```bash
# Todas las features de KAISE OPzV
curl "http://localhost:3000/api/v1/categories/a15c1e00-1000-4000-8000-00000000000b/features"

# Solo aplicaciones
curl "http://localhost:3000/api/v1/categories/a15c1e00-1000-4000-8000-00000000000b/features?type=application"

# Solo características
curl "http://localhost:3000/api/v1/categories/a15c1e00-1000-4000-8000-00000000000b/features?type=characteristic"

# Solo matriz de compatibilidad
curl "http://localhost:3000/api/v1/categories/a15c1e00-1000-4000-8000-00000000000b/features?type=compatibility"
```

**Respuesta:**

```json
{
  "data": [
    {
      "id": "a15c1e00-700b-4000-8000-000000000001",
      "category_id": "a15c1e00-1000-4000-8000-00000000000b",
      "type": "application",
      "label": "Sistemas de telecomunicaciones",
      "order": 1,
      "suitability": null
    },
    {
      "id": "uuid-compat",
      "category_id": "a15c1e00-1000-4000-8000-00000000000b",
      "type": "compatibility",
      "label": "Telecomunicaciones",
      "order": 1,
      "suitability": "best"
    },
    {
      "id": "uuid-compat-2",
      "category_id": "a15c1e00-1000-4000-8000-00000000000b",
      "type": "compatibility",
      "label": "UPS",
      "order": 2,
      "suitability": "best"
    }
  ]
}
```

---

### POST /categories/:id/features — Añadir feature

```bash
# Aplicación descriptiva
curl -X POST http://localhost:3000/api/v1/categories/a15c1e00-1000-4000-8000-00000000000b/features \
  -H "Content-Type: application/json" \
  -H "X-API-Key: tu-clave" \
  -d '{
    "type": "application",
    "label": "Instalaciones fotovoltaicas en cubierta"
  }'

# Característica técnica
curl -X POST http://localhost:3000/api/v1/categories/a15c1e00-1000-4000-8000-00000000000b/features \
  -H "Content-Type: application/json" \
  -H "X-API-Key: tu-clave" \
  -d '{
    "type": "characteristic",
    "label": "Electrolito inmovilizado en gel puro — sin riesgo de derrame"
  }'
```

---

### PATCH /categories/:id/features/:featureId — Actualizar feature

```bash
curl -X PATCH http://localhost:3000/api/v1/categories/categoria-uuid/features/feature-uuid \
  -H "Content-Type: application/json" \
  -H "X-API-Key: tu-clave" \
  -d '{ "label": "Etiqueta corregida", "order": 3 }'
```

---

### DELETE /categories/:id/features/:featureId — Eliminar feature

```bash
curl -X DELETE http://localhost:3000/api/v1/categories/categoria-uuid/features/feature-uuid \
  -H "X-API-Key: tu-clave"
```

---

### POST /categories/:id/features/reorder — Reordenar features

```bash
curl -X POST http://localhost:3000/api/v1/categories/categoria-uuid/features/reorder \
  -H "Content-Type: application/json" \
  -H "X-API-Key: tu-clave" \
  -d '{
    "featureIds": [
      "uuid-feature-3",
      "uuid-feature-1",
      "uuid-feature-2"
    ]
  }'
```

El array define el nuevo orden (posición 0 = order 1).

---

## 6. Tipos de producto

### GET /product-types — Listar tipos

```bash
curl "http://localhost:3000/api/v1/product-types"
```

### GET /product-types/:id — Detalle con atributos asignados

```bash
# Tipo "Batería"
curl "http://localhost:3000/api/v1/product-types/a11c1e00-0000-4000-8000-000000000001"
```

**Respuesta:**

```json
{
  "data": {
    "id": "a11c1e00-0000-4000-8000-000000000001",
    "name": "Batería",
    "description": "Tipos de baterías Kaise",
    "attributes": [
      {
        "id": "a11c1e00-2000-4000-8000-000000000001",
        "name": "voltage",
        "label": "Tensión nominal",
        "data_type": "number",
        "unit": "V",
        "is_filterable": true,
        "is_required": true,
        "order": 1
      },
      {
        "id": "a11c1e00-2000-4000-8000-000000000002",
        "name": "model_code",
        "label": "Código de modelo",
        "data_type": "string",
        "unit": null,
        "is_filterable": false,
        "is_required": true,
        "order": 2
      }
    ]
  }
}
```

### POST /product-types — Crear tipo

```bash
curl -X POST http://localhost:3000/api/v1/product-types \
  -H "Content-Type: application/json" \
  -H "X-API-Key: tu-clave" \
  -d '{
    "name": "Cargador",
    "description": "Cargadores de baterías Kaise"
  }'
```

### POST /product-types/:id/attributes — Asignar atributo a tipo

```bash
curl -X POST http://localhost:3000/api/v1/product-types/tipo-uuid/attributes \
  -H "Content-Type: application/json" \
  -H "X-API-Key: tu-clave" \
  -d '{
    "attribute_id": "a11c1e00-2000-4000-8000-000000000001",
    "is_required": true,
    "order": 1
  }'
```

### DELETE /product-types/:id/attributes/:attributeId — Desasignar atributo

```bash
curl -X DELETE http://localhost:3000/api/v1/product-types/tipo-uuid/attributes/attr-uuid \
  -H "X-API-Key: tu-clave"
```

---

## 7. Atributos globales

### GET /attributes — Todos los atributos

```bash
curl "http://localhost:3000/api/v1/attributes"
```

### GET /attributes/filterable — Solo los filtrables

```bash
# Útil para construir formularios de filtro en el frontend
curl "http://localhost:3000/api/v1/attributes/filterable"
```

### POST /attributes — Crear atributo

```bash
curl -X POST http://localhost:3000/api/v1/attributes \
  -H "Content-Type: application/json" \
  -H "X-API-Key: tu-clave" \
  -d '{
    "name": "self_discharge",
    "label": "Autodescarga mensual",
    "data_type": "number",
    "unit": "%/mes",
    "is_filterable": false
  }'
```

**`data_type` válidos:** `string`, `number`, `boolean`, `date`

**`name` válido:** solo minúsculas, dígitos y `_` (regex `/^[a-z_]+$/`).

---

## 8. Búsqueda avanzada — Casos de uso reales verificados

> Todos los resultados a continuación son reales contra la base de datos de producción.

---

### Por aplicación: baterías para Telecomunicaciones

Busca en el campo `applications` de todas las categorías del catálogo.

```bash
curl "http://localhost:3000/api/v1/products?application=Telecomunicaciones&status=published"
```

**Resultado:** `total: 119` — incluye KAISE LITIO, LONG LIFE, HIGH RATE, FRONT TERMINAL, OPzV, HIGH TEMPERATURE, etc.

```json
{
  "meta": { "pagination": { "total": 119, "total_pages": 6 } },
  "data": [
    { "name": "KBLI1270F1", "categories": [{"name": "KAISE LITIO"}] },
    { "name": "KBLL7200", "categories": [{"name": "KAISE LONG LIFE"}] }
  ]
}
```

---

### Por aplicación: baterías para Bicicletas eléctricas

```bash
curl "http://localhost:3000/api/v1/products?application=Bicicletas"
```

**Resultado:** `total: 11` — toda la gama KAISE ELECTRIC VEHICLE.

---

### Por aplicación: baterías para energía solar

```bash
curl "http://localhost:3000/api/v1/products?application=solar&status=published"
```

**Resultado:** `total: 80` — KAISE SOLAR, SOLAR GEL, LEAD CARBON, DEEP CYCLE GEL, LITIO, etc.

---

### Por aplicación + tecnología: solar con tecnología GEL

```bash
curl "http://localhost:3000/api/v1/products?application=solar&technology=VRLA-GEL"
```

**Resultado:** `total: 31` — solo KAISE SOLAR GEL y KAISE DEEP CYCLE GEL.

---

### Por tipo de placa: todas las baterías Tubular

```bash
curl "http://localhost:3000/api/v1/products?plate_type=Tubular"
```

**Resultado:** `total: 28` — KAISE OPzV (GEL Tubular 2V/12V) + KAISE EV TRACCIÓN.

---

### Por tipo de placa + rango de capacidad: Tubular con capacidades hasta 3000 Ah

La consulta exacta del usuario: "capacidad de 60 – 3000 Ah (C10) y que sea Tubular".

```bash
curl "http://localhost:3000/api/v1/products?plate_type=Tubular&capacity_range=3000"
```

**Resultado:** `total: 20` — exclusivamente KAISE OPzV (la única gamma Tubular con ese rango).

```json
{
  "meta": { "pagination": { "total": 20, "total_pages": 1 } },
  "data": [
    { "name": "KBOPZV2200",  "attributes_json": { "voltage": 2,  "capacity": 200  } },
    { "name": "KBOPZV2300",  "attributes_json": { "voltage": 2,  "capacity": 300  } },
    { "name": "KBOPZV23000", "attributes_json": { "voltage": 2,  "capacity": 3000 } },
    { "name": "KBOPZV1260",  "attributes_json": { "voltage": 12, "capacity": 60   } }
  ]
}
```

---

### Por características: rango de temperatura de funcionamiento -40°C a +80°C

Busca en el campo `characteristics` de la categoría.

```bash
# Buscar por rango de temperatura en las características
curl "http://localhost:3000/api/v1/products?characteristics=-40%C2%B0C"

# Alternativa — también funciona con search general
curl "http://localhost:3000/api/v1/products?search=-40%C2%B0C"
```

**Resultado:** `total: 19` — exclusivamente KAISE HIGH TEMPERATURE (cuyo campo `characteristics` contiene `Rango de temperatura: -40°C a +80°C`).

---

### Por características: tecnología gel puro

```bash
curl "http://localhost:3000/api/v1/products?characteristics=gel+puro"
```

**Resultado:** baterías KAISE OPzV y KAISE DEEP CYCLE GEL (ambas con electrolito gel puro en sus características).

---

### Por características: comportamiento PSoC (Partial State of Charge)

```bash
curl "http://localhost:3000/api/v1/products?characteristics=PSoC"
```

**Resultado:** KAISE LEAD CARBON, KAISE LITIO y otras gammas con comportamiento PSoC documentado.

---

### Por tecnología: todas las baterías LiFePO4

```bash
curl "http://localhost:3000/api/v1/products?technology=LiFePO4&status=published"
```

**Resultado:** toda la gama KAISE LITIO.

---

### Certficación Eurobat + capacidad entre 200 y 500 Ah

```bash
curl "http://localhost:3000/api/v1/products?eurobat=true&capacity_min=200&capacity_max=500"
```

**Resultado:** `total: 5` — baterías EV y Lead Carbon en ese rango de capacidad con certificación Eurobat.

---

### Voltage exacto + tecnología: baterías Litio a 12.8V

> Nota: las baterías LiFePO4 tienen `voltage: 12.8`, no `12`. Usar el valor exacto del atributo.

```bash
curl "http://localhost:3000/api/v1/products?technology=LiFePO4&voltage=12.8&per_page=50"
```

---

### Por atributos dinámicos exactos (JSONB)

```bash
# Baterías 12V de 100Ah exactos (campo capacity en attributes_json)
curl "http://localhost:3000/api/v1/products?filters[voltage]=12&filters[capacity]=100"

# Baterías 2V OPzV de 1000Ah
curl "http://localhost:3000/api/v1/products?filters[voltage]=2&filters[capacity]=1000"

# Por código de modelo exacto
curl "http://localhost:3000/api/v1/products?filters[model_code]=KBOPZV2200"
```

---

### Búsqueda libre con `search` (cubre todos los campos de texto)

El parámetro `search` busca simultáneamente en:
- `products.name` y `products.description`
- `categories.name`, `categories.applications`, `categories.characteristics`, `categories.description`

```bash
# Encuentra cualquier producto cuya categoría mencione "SAI" en aplicaciones o características
curl "http://localhost:3000/api/v1/products?search=SAI"

# Encuentra High Temperature por sus características técnicas
curl "http://localhost:3000/api/v1/products?search=alta+temperatura"

# Resultado equivalente al filtro directo
curl "http://localhost:3000/api/v1/products?search=Telecomunicaciones"
# total: 119 — igual que ?application=Telecomunicaciones
```

---

### Combinaciones multi-parámetro

```bash
# Baterías Tubular, para telecomunicaciones, certificadas Eurobat
curl "http://localhost:3000/api/v1/products?plate_type=Tubular&application=Telecomunicaciones&eurobat=true"

# Baterías GEL para energías renovables publicadas, página 2
curl "http://localhost:3000/api/v1/products?technology=VRLA-GEL&application=renovable&status=published&page=2&per_page=20"

# Baterías AGM de larga vida para UPS, entre 100 y 250 Ah
curl "http://localhost:3000/api/v1/products?technology=VRLA-AGM&application=SAI&capacity_min=100&capacity_max=250&eurobat=true"

# Paginación: página 3, 50 resultados por página, solo publicados
curl "http://localhost:3000/api/v1/products?status=published&page=3&per_page=50"
```

---

### Baterías de la gama KAISE SOLAR GEL, 12V (filtro por categoría + atributo)

```bash
curl "http://localhost:3000/api/v1/products?category_id=a13c1e00-1000-4000-8000-000000000004&filters[voltage]=12&status=published"
```

### Baterías OPzV de 2V (por categoría exacta + voltage)

```bash
curl "http://localhost:3000/api/v1/products?category_id=a15c1e00-1000-4000-8000-00000000000b&voltage=2"
```

---

## 9. IDs de referencia del catálogo Kaise

### Tipo de producto

| Recurso | ID |
|---|---|
| Batería (tipo único) | `a11c1e00-0000-4000-8000-000000000001` |

### Gammas (categorías hoja)

| Gamma | ID |
|---|---|
| KAISE LITIO | `a11c1e00-1000-4000-8000-000000000001` |
| KAISE STANDARD | `a11c1e00-1000-4000-8000-000000000002` |
| KAISE LONG LIFE | `a11c1e00-1000-4000-8000-000000000003` |
| KAISE ULTRA LONG LIFE | `a11c1e00-1000-4000-8000-000000000004` |
| KAISE HIGH RATE | `a11c1e00-1000-4000-8000-000000000005` |
| KAISE SOLAR | `a11c1e00-1000-4000-8000-000000000006` |
| KAISE DEEP CYCLE | `a11c1e00-1000-4000-8000-000000000007` |
| KAISE FRONT TERMINAL | `a11c1e00-1000-4000-8000-000000000008` |
| KAISE HIGH TEMPERATURE | `a11c1e00-1000-4000-8000-000000000009` |
| KAISE ELECTRIC VEHICLE | `a13c1e00-1000-4000-8000-000000000001` |
| KAISE EV TRACCIÓN | `a13c1e00-1000-4000-8000-000000000002` |
| KAISE LEAD CARBON | `a13c1e00-1000-4000-8000-000000000003` |
| KAISE SOLAR GEL | `a13c1e00-1000-4000-8000-000000000004` |
| KAISE DEEP CYCLE GEL | `a13c1e00-1000-4000-8000-000000000005` |
| KAISE WIND POWER | `a13c1e00-1000-4000-8000-000000000006` |
| KAISE OPzV | `a15c1e00-1000-4000-8000-00000000000b` |

### Nodos estructurales

| Nodo | ID |
|---|---|
| Litio | `a15c1e00-1000-4000-8000-000000000001` |
| LFP | `a15c1e00-1000-4000-8000-000000000002` |
| Plomo Ácido | `a15c1e00-1000-4000-8000-000000000003` |
| Plomo Carbono | `a15c1e00-1000-4000-8000-000000000004` |
| VRLA | `a15c1e00-1000-4000-8000-000000000005` |
| AGM | `a15c1e00-1000-4000-8000-000000000006` |
| Tracción | `a15c1e00-1000-4000-8000-000000000007` |
| Alta Temperatura | `a15c1e00-1000-4000-8000-000000000008` |
| Gel Puro | `a15c1e00-1000-4000-8000-000000000009` |

---

## 10. Respuestas de error

### 400 — Validación fallida

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": [
    { "path": "product_type_id", "message": "\"product_type_id\" is required" },
    { "path": "attributes", "message": "\"attributes\" is required" }
  ]
}
```

### 401 — Falta API Key

```json
{ "error": "Unauthorized", "message": "Missing API key" }
```

### 403 — API Key inválida

```json
{ "error": "Forbidden", "message": "Invalid API key" }
```

### 404 — Recurso no encontrado

```json
{ "error": "NOT_FOUND", "message": "Product not found" }
```

### 409 — Conflicto (slug duplicado)

```json
{
  "error": "DUPLICATE_ENTRY",
  "message": "Category with slug 'kaise-standard' already exists"
}
```

### 500 — Error interno

```json
{ "error": "INTERNAL_ERROR", "message": "An unexpected error occurred" }
```

---

## 11. Script de prueba rápida

Guarda como `smoke-test.sh` y ejecuta con `bash smoke-test.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

API="http://localhost:3000/api/v1"
KEY="your-secret-key-here"

echo "─── Productos (pág. 1) ───"
curl -s "$API/products?per_page=5" | jq '.meta.pagination'

echo "─── Árbol de categorías ───"
curl -s "$API/categories/tree" | jq '[.data[] | {name, level}]'

echo "─── Gammas KAISE SOLAR GEL ───"
curl -s "$API/products?category_id=a13c1e00-1000-4000-8000-000000000004" \
  | jq '[.data[] | {name, attributes_json}]'

echo "─── Features OPzV ───"
curl -s "$API/categories/a15c1e00-1000-4000-8000-00000000000b/features" \
  | jq '.data | group_by(.type) | map({type: .[0].type, count: length})'

echo "─── Atributos filtrables ───"
curl -s "$API/attributes/filterable" | jq '[.data[] | {name, label, unit}]'

echo "─── Buscar batería 12V 100Ah ───"
curl -s "$API/products?filters[voltage]=12&filters[capacity]=100&status=published" \
  | jq '.meta.pagination'

echo "OK — todas las comprobaciones pasaron"
```
