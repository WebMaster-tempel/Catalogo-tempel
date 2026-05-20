import { useState, useEffect, useCallback } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';
type AuthLevel = 'public' | 'private';

interface Param {
  name: string;
  in: 'path' | 'query' | 'body';
  type: string;
  required?: boolean;
  description: string;
  example?: string;
}

interface EndpointDef {
  method: HttpMethod;
  path: string;
  summary: string;
  description?: string;
  auth: AuthLevel;
  params?: Param[];
  responseExample: unknown;
  requestExample?: unknown;
  statusCode?: number;
}

interface GroupDef {
  id: string;
  label: string;
  icon: string;
  base: string;
  description: string;
  endpoints: EndpointDef[];
}

interface HealthState {
  status: 'idle' | 'loading' | 'ok' | 'error';
  latency: number | null;
  lastChecked: Date | null;
  apiVersion?: string;
  endpointCount?: number;
}

interface TryItState {
  open: boolean;
  loading: boolean;
  response: string | null;
  status: number | null;
  error: string | null;
}

// ── Endpoint Data ─────────────────────────────────────────────────────────────

const GROUPS: GroupDef[] = [
  {
    id: 'products',
    label: 'Productos',
    icon: '📦',
    base: '/api/v1/products',
    description: 'CRUD completo de productos, incluyendo filtros avanzados por tecnología, tensión, capacidad, aplicación y más.',
    endpoints: [
      {
        method: 'GET',
        path: '/api/v1/products',
        summary: 'Listar productos',
        description: 'Devuelve una lista paginada de productos con soporte para múltiples filtros simultáneos.',
        auth: 'public',
        params: [
          { in: 'query', name: 'page', type: 'number', description: 'Número de página (default: 1)', example: '1' },
          { in: 'query', name: 'per_page', type: 'number', description: 'Resultados por página, máximo 500 (default: 20)', example: '20' },
          { in: 'query', name: 'search', type: 'string', description: 'Búsqueda por texto en nombre y descripción', example: 'OPzV' },
          { in: 'query', name: 'status', type: 'draft | published | archived', description: 'Filtrar por estado del producto', example: 'published' },
          { in: 'query', name: 'category_id', type: 'UUID', description: 'ID de categoría (gamma)', example: '' },
          { in: 'query', name: 'product_type_id', type: 'UUID', description: 'ID del tipo de producto', example: '' },
          { in: 'query', name: 'technology', type: 'string', description: 'Tecnología: VRLA-AGM, VRLA-GEL, LiFePO4, Lead Carbon', example: 'VRLA-AGM' },
          { in: 'query', name: 'plate_type', type: 'string', description: 'Tipo de placa: Flat, Tubular, Prismática', example: 'Tubular' },
          { in: 'query', name: 'application', type: 'string', description: 'Aplicación: Solar, Industrial, Telecomunicaciones…', example: 'Solar' },
          { in: 'query', name: 'voltage', type: 'number', description: 'Tensión nominal en V', example: '12' },
          { in: 'query', name: 'capacity_min', type: 'number', description: 'Capacidad mínima en Ah', example: '100' },
          { in: 'query', name: 'capacity_max', type: 'number', description: 'Capacidad máxima en Ah', example: '500' },
          { in: 'query', name: 'eurobat', type: 'boolean', description: 'Solo productos con clasificación Eurobat', example: 'true' },
        ],
        responseExample: {
          data: [
            { id: 'a1b2c3d4-...', name: 'KAISE KS12-100', slug: 'ks12-100', status: 'published', attributes_json: { voltage: 12, capacity: 100, weight: 28.5 }, categories: [{ id: '...', name: 'VRLA-AGM Flat' }] },
          ],
          meta: { pagination: { page: 1, per_page: 20, total: 42, total_pages: 3 } },
        },
      },
      {
        method: 'GET',
        path: '/api/v1/products/:id',
        summary: 'Detalle de producto',
        description: 'Devuelve todos los campos del producto, incluyendo media, categorías y atributos técnicos.',
        auth: 'public',
        params: [
          { in: 'path', name: 'id', type: 'UUID', required: true, description: 'ID único del producto' },
        ],
        responseExample: {
          data: { id: 'uuid', name: 'KAISE KS12-100', slug: 'ks12-100', status: 'published', description: 'Batería VRLA-AGM de ciclo profundo', product_type_id: 'uuid', main_image_id: null, attributes_json: { voltage: 12, capacity: 100, weight: 28.5, terminal_type: 'M8' }, categories: [{ id: 'uuid', name: 'VRLA-AGM Flat', level: 3 }], media: [{ id: 'uuid', type: 'image', url: 'https://…/uploads/abc.jpg', title: 'Vista frontal', order: 0 }] },
        },
      },
      {
        method: 'POST',
        path: '/api/v1/products',
        summary: 'Crear producto',
        auth: 'private',
        params: [
          { in: 'body', name: 'name', type: 'string', required: true, description: 'Nombre del producto' },
          { in: 'body', name: 'slug', type: 'string', required: true, description: 'Slug único (letras minúsculas, números, guiones)' },
          { in: 'body', name: 'product_type_id', type: 'UUID', required: true, description: 'ID del tipo de producto' },
          { in: 'body', name: 'attributes', type: 'object', required: true, description: 'Atributos según el tipo — pares clave:valor' },
          { in: 'body', name: 'status', type: 'draft | published | archived', description: 'Estado (default: draft)' },
          { in: 'body', name: 'description', type: 'string', description: 'Descripción del producto' },
          { in: 'body', name: 'category_ids', type: 'UUID[]', description: 'Lista de IDs de categorías asignadas' },
          { in: 'body', name: 'main_image_id', type: 'UUID', description: 'ID del media como imagen principal' },
        ],
        requestExample: {
          name: 'KAISE KS12-100',
          slug: 'ks12-100',
          product_type_id: '550e8400-e29b-41d4-a716-446655440000',
          status: 'published',
          description: 'Batería VRLA-AGM placa plana de ciclo profundo',
          attributes: { voltage: 12, capacity: 100, weight: 28.5, terminal_type: 'M8' },
          category_ids: ['a11c1e00-1000-4000-8000-000000000001'],
        },
        responseExample: { data: { id: 'new-uuid', name: 'KAISE KS12-100', status: 'published' } },
        statusCode: 201,
      },
      {
        method: 'PATCH',
        path: '/api/v1/products/:id',
        summary: 'Actualizar producto',
        auth: 'private',
        params: [
          { in: 'path', name: 'id', type: 'UUID', required: true, description: 'ID del producto' },
          { in: 'body', name: 'name', type: 'string', description: 'Nuevo nombre' },
          { in: 'body', name: 'status', type: 'draft | published | archived', description: 'Nuevo estado' },
          { in: 'body', name: 'attributes', type: 'object', description: 'Atributos — reemplaza los existentes completamente' },
          { in: 'body', name: 'category_ids', type: 'UUID[]', description: 'Nueva lista de categorías (reemplaza todas)' },
          { in: 'body', name: 'description', type: 'string', description: 'Nueva descripción' },
          { in: 'body', name: 'main_image_id', type: 'UUID', description: 'Nueva imagen principal' },
        ],
        requestExample: { status: 'published', attributes: { voltage: 12, capacity: 100, weight: 29.0 } },
        responseExample: { data: { id: 'uuid', name: 'KAISE KS12-100', status: 'published' } },
      },
      {
        method: 'DELETE',
        path: '/api/v1/products/:id',
        summary: 'Eliminar producto',
        auth: 'private',
        params: [
          { in: 'path', name: 'id', type: 'UUID', required: true, description: 'ID del producto a eliminar' },
        ],
        responseExample: null,
        statusCode: 204,
      },
      {
        method: 'GET',
        path: '/api/v1/products/:id/media',
        summary: 'Media del producto',
        auth: 'public',
        params: [
          { in: 'path', name: 'id', type: 'UUID', required: true, description: 'ID del producto' },
        ],
        responseExample: { data: [{ id: 'uuid', type: 'image', url: 'https://…/uploads/abc.jpg', title: 'Vista frontal', order: 0 }, { id: 'uuid2', type: 'pdf', url: 'https://…/uploads/datasheet.pdf', title: 'Datasheet', order: 1 }] },
      },
      {
        method: 'POST',
        path: '/api/v1/products/:id/media',
        summary: 'Añadir media',
        auth: 'private',
        params: [
          { in: 'path', name: 'id', type: 'UUID', required: true, description: 'ID del producto' },
          { in: 'body', name: 'type', type: 'image | pdf', required: true, description: 'Tipo de archivo' },
          { in: 'body', name: 'url', type: 'string (URI)', required: true, description: 'URL del archivo (obtenida de POST /api/v1/uploads)' },
          { in: 'body', name: 'title', type: 'string', description: 'Título descriptivo' },
          { in: 'body', name: 'order', type: 'number', description: 'Posición en galería (default: 0)' },
        ],
        requestExample: { type: 'image', url: 'https://example.com/uploads/uuid.jpg', title: 'Vista frontal', order: 0 },
        responseExample: { data: { id: 'uuid', type: 'image', url: 'https://…', title: 'Vista frontal', order: 0 } },
        statusCode: 201,
      },
      {
        method: 'DELETE',
        path: '/api/v1/products/:productId/media/:mediaId',
        summary: 'Eliminar media',
        auth: 'private',
        params: [
          { in: 'path', name: 'productId', type: 'UUID', required: true, description: 'ID del producto' },
          { in: 'path', name: 'mediaId', type: 'UUID', required: true, description: 'ID del media' },
        ],
        responseExample: null,
        statusCode: 204,
      },
    ],
  },
  {
    id: 'categories',
    label: 'Categorías',
    icon: '🗂️',
    base: '/api/v1/categories',
    description: 'Árbol jerárquico de gammas de baterías. Nivel 1 = tecnología, nivel 2 = tipo de placa, nivel 3 = gamma específica.',
    endpoints: [
      {
        method: 'GET',
        path: '/api/v1/categories',
        summary: 'Listar categorías (plano)',
        auth: 'public',
        responseExample: { data: [{ id: 'uuid', name: 'VRLA-AGM', slug: 'kaise-vrla-agm', level: 1, parent_id: null }, { id: 'uuid2', name: 'Flat', slug: 'kaise-agm-flat', level: 2, parent_id: 'uuid' }] },
      },
      {
        method: 'GET',
        path: '/api/v1/categories/tree',
        summary: 'Árbol de categorías',
        description: 'Devuelve la jerarquía completa anidada. Útil para construir selectores jerárquicos.',
        auth: 'public',
        responseExample: { data: [{ id: 'uuid', name: 'VRLA-AGM', level: 1, children: [{ id: 'uuid2', name: 'Flat', level: 2, children: [{ id: 'uuid3', name: 'Standard', level: 3, children: [] }] }] }] },
      },
      {
        method: 'GET',
        path: '/api/v1/categories/:id',
        summary: 'Detalle de categoría',
        auth: 'public',
        params: [{ in: 'path', name: 'id', type: 'UUID', required: true, description: 'ID de la categoría' }],
        responseExample: { data: { id: 'uuid', name: 'VRLA-AGM', slug: 'kaise-vrla-agm', level: 1, technology: 'VRLA-AGM', plate_type: null, description: null } },
      },
      {
        method: 'GET',
        path: '/api/v1/categories/:id/children',
        summary: 'Subcategorías directas',
        auth: 'public',
        params: [{ in: 'path', name: 'id', type: 'UUID', required: true, description: 'ID de la categoría padre' }],
        responseExample: { data: [{ id: 'uuid2', name: 'Flat', level: 2, parent_id: 'uuid' }] },
      },
      {
        method: 'GET',
        path: '/api/v1/categories/:id/features',
        summary: 'Características / Aplicaciones',
        description: 'Devuelve las features de la categoría (aplicaciones, características, vídeos). Filtrable por type.',
        auth: 'public',
        params: [
          { in: 'path', name: 'id', type: 'UUID', required: true, description: 'ID de la categoría' },
          { in: 'query', name: 'type', type: 'application | characteristic | compatibility | video', description: 'Filtrar por tipo de feature' },
        ],
        responseExample: { data: [{ id: 'uuid', category_id: 'uuid', type: 'application', label: 'Energía Solar', suitability: 'best', order: 0 }, { id: 'uuid2', type: 'characteristic', label: 'Libre mantenimiento', suitability: null, order: 1 }] },
      },
      {
        method: 'POST',
        path: '/api/v1/categories',
        summary: 'Crear categoría',
        auth: 'private',
        params: [
          { in: 'body', name: 'name', type: 'string', required: true, description: 'Nombre de la categoría' },
          { in: 'body', name: 'slug', type: 'string', required: true, description: 'Slug único (letras minúsculas, números, guiones)' },
          { in: 'body', name: 'parent_id', type: 'UUID', description: 'ID del padre (null = categoría raíz)' },
          { in: 'body', name: 'description', type: 'string', description: 'Descripción' },
        ],
        requestExample: { name: 'High Rate', slug: 'kaise-high-rate', parent_id: 'a11c1e00-1000-4000-8000-000000000002' },
        responseExample: { data: { id: 'new-uuid', name: 'High Rate', slug: 'kaise-high-rate', level: 3 } },
        statusCode: 201,
      },
      {
        method: 'PATCH',
        path: '/api/v1/categories/:id',
        summary: 'Actualizar categoría',
        auth: 'private',
        params: [
          { in: 'path', name: 'id', type: 'UUID', required: true, description: 'ID de la categoría' },
          { in: 'body', name: 'name', type: 'string', description: 'Nuevo nombre' },
          { in: 'body', name: 'slug', type: 'string', description: 'Nuevo slug' },
          { in: 'body', name: 'description', type: 'string', description: 'Nueva descripción' },
        ],
        requestExample: { name: 'High Rate Premium' },
        responseExample: { data: { id: 'uuid', name: 'High Rate Premium' } },
      },
    ],
  },
  {
    id: 'product-types',
    label: 'Tipos',
    icon: '🏷️',
    base: '/api/v1/product-types',
    description: 'Tipos de producto que definen qué atributos técnicos pertenecen a cada familia de producto.',
    endpoints: [
      {
        method: 'GET',
        path: '/api/v1/product-types',
        summary: 'Listar tipos de producto',
        auth: 'public',
        responseExample: { data: [{ id: 'uuid', name: 'Batería VRLA', description: 'Baterías de plomo-ácido selladas' }] },
      },
      {
        method: 'GET',
        path: '/api/v1/product-types/:id',
        summary: 'Tipo con sus atributos',
        description: 'Incluye la lista de atributos configurados para este tipo, con is_required y order.',
        auth: 'public',
        params: [{ in: 'path', name: 'id', type: 'UUID', required: true, description: 'ID del tipo' }],
        responseExample: { data: { id: 'uuid', name: 'Batería VRLA', attributes: [{ id: 'uuid', name: 'voltage', label: 'Tensión', data_type: 'number', unit: 'V', is_required: true, order: 0 }, { id: 'uuid2', name: 'capacity', label: 'Capacidad', data_type: 'number', unit: 'Ah', is_required: true, order: 1 }] } },
      },
      {
        method: 'POST',
        path: '/api/v1/product-types',
        summary: 'Crear tipo',
        auth: 'private',
        params: [
          { in: 'body', name: 'name', type: 'string', required: true, description: 'Nombre del tipo de producto' },
          { in: 'body', name: 'description', type: 'string', description: 'Descripción' },
        ],
        requestExample: { name: 'Batería LiFePO4', description: 'Baterías de litio-fosfato de hierro' },
        responseExample: { data: { id: 'new-uuid', name: 'Batería LiFePO4' } },
        statusCode: 201,
      },
      {
        method: 'POST',
        path: '/api/v1/product-types/:id/attributes',
        summary: 'Asignar atributo al tipo',
        auth: 'private',
        params: [
          { in: 'path', name: 'id', type: 'UUID', required: true, description: 'ID del tipo de producto' },
          { in: 'body', name: 'attribute_id', type: 'UUID', required: true, description: 'ID del atributo a asignar' },
          { in: 'body', name: 'is_required', type: 'boolean', description: 'Si es obligatorio al crear un producto (default: false)' },
          { in: 'body', name: 'order', type: 'number', description: 'Orden en el formulario de creación (default: 0)' },
        ],
        requestExample: { attribute_id: '550e8400-e29b-41d4-a716-446655440001', is_required: true, order: 1 },
        responseExample: { data: { type_id: 'uuid', attribute_id: 'uuid', is_required: true, order: 1 } },
        statusCode: 201,
      },
      {
        method: 'DELETE',
        path: '/api/v1/product-types/:id/attributes/:attributeId',
        summary: 'Desasignar atributo',
        auth: 'private',
        params: [
          { in: 'path', name: 'id', type: 'UUID', required: true, description: 'ID del tipo de producto' },
          { in: 'path', name: 'attributeId', type: 'UUID', required: true, description: 'ID del atributo' },
        ],
        responseExample: null,
        statusCode: 204,
      },
    ],
  },
  {
    id: 'attributes',
    label: 'Atributos',
    icon: '⚙️',
    base: '/api/v1/attributes',
    description: 'Atributos técnicos globales reutilizables. Se asignan a tipos de producto y se usan como filtros de búsqueda.',
    endpoints: [
      {
        method: 'GET',
        path: '/api/v1/attributes',
        summary: 'Listar atributos',
        auth: 'public',
        responseExample: { data: [{ id: 'uuid', name: 'voltage', label: 'Tensión', data_type: 'number', unit: 'V', is_filterable: true }, { id: 'uuid2', name: 'capacity', label: 'Capacidad', data_type: 'number', unit: 'Ah', is_filterable: true }] },
      },
      {
        method: 'GET',
        path: '/api/v1/attributes/filterable',
        summary: 'Solo atributos filtrables',
        description: 'Útil para construir la UI de filtros de búsqueda.',
        auth: 'public',
        responseExample: { data: [{ id: 'uuid', name: 'voltage', label: 'Tensión', data_type: 'number', unit: 'V', is_filterable: true }] },
      },
      {
        method: 'POST',
        path: '/api/v1/attributes',
        summary: 'Crear atributo',
        auth: 'private',
        params: [
          { in: 'body', name: 'name', type: 'string', required: true, description: 'Nombre interno (solo letras minúsculas y guiones bajos, ej. weight_kg)' },
          { in: 'body', name: 'label', type: 'string', required: true, description: 'Etiqueta visible en la UI' },
          { in: 'body', name: 'data_type', type: 'string | number | boolean | date', required: true, description: 'Tipo de dato del atributo' },
          { in: 'body', name: 'unit', type: 'string', description: 'Unidad de medida (ej. V, Ah, kg, °C)' },
          { in: 'body', name: 'is_filterable', type: 'boolean', description: 'Disponible como filtro de búsqueda (default: false)' },
        ],
        requestExample: { name: 'weight', label: 'Peso', data_type: 'number', unit: 'kg', is_filterable: true },
        responseExample: { data: { id: 'new-uuid', name: 'weight', label: 'Peso', data_type: 'number', unit: 'kg', is_filterable: true } },
        statusCode: 201,
      },
      {
        method: 'DELETE',
        path: '/api/v1/attributes/:id',
        summary: 'Eliminar atributo',
        auth: 'private',
        params: [{ in: 'path', name: 'id', type: 'UUID', required: true, description: 'ID del atributo' }],
        responseExample: null,
        statusCode: 204,
      },
    ],
  },
  {
    id: 'uploads',
    label: 'Uploads',
    icon: '📁',
    base: '/api/v1/uploads',
    description: 'Subida de archivos para adjuntar como media a los productos. Devuelve la URL pública para usar en POST /products/:id/media.',
    endpoints: [
      {
        method: 'POST',
        path: '/api/v1/uploads',
        summary: 'Subir archivo',
        description: 'Acepta multipart/form-data con campo "file". Tipos permitidos: JPEG, PNG, WEBP, GIF, PDF. Tamaño máximo: 10 MB.',
        auth: 'private',
        params: [
          { in: 'body', name: 'file', type: 'File (multipart/form-data)', required: true, description: 'Archivo a subir. Formatos: JPEG, PNG, WEBP, GIF, PDF. Límite: 10 MB' },
        ],
        requestExample: { _note: 'Enviar como multipart/form-data con campo "file". No enviar JSON.' },
        responseExample: { data: { url: 'https://tu-api.com/uploads/550e8400.jpg', filename: '550e8400.jpg', original_name: 'foto_producto.jpg', size: 102400, type: 'image' } },
        statusCode: 201,
      },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function highlightJson(json: string): string {
  return json
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      (m) => {
        if (/^"/.test(m)) return /:$/.test(m) ? `<span class="hl-key">${m}</span>` : `<span class="hl-str">${m}</span>`;
        if (/true|false/.test(m)) return `<span class="hl-bool">${m}</span>`;
        if (/null/.test(m)) return `<span class="hl-null">${m}</span>`;
        return `<span class="hl-num">${m}</span>`;
      },
    );
}

function fmtJson(val: unknown): string {
  if (val === null || val === undefined) return '— (204 No Content)';
  return JSON.stringify(val, null, 2);
}

async function copyText(text: string) {
  try { await navigator.clipboard.writeText(text); } catch { /* ignore */ }
}

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: '#22543d',
  POST: '#1a365d',
  PATCH: '#744210',
  DELETE: '#742a2a',
};
const METHOD_BG: Record<HttpMethod, string> = {
  GET: '#c6f6d5',
  POST: '#bee3f8',
  PATCH: '#fefcbf',
  DELETE: '#fed7d7',
};

// ── Sub-components ────────────────────────────────────────────────────────────

function MethodBadge({ method }: { method: HttpMethod }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 4,
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.05em',
      background: METHOD_BG[method],
      color: METHOD_COLORS[method],
      fontFamily: 'monospace',
      minWidth: 56,
      textAlign: 'center',
    }}>
      {method}
    </span>
  );
}

function AuthBadge({ level }: { level: AuthLevel }) {
  return level === 'public'
    ? <span className="api-badge api-badge-public">🌐 Público</span>
    : <span className="api-badge api-badge-private">🔒 Requiere API Key</span>;
}

function StatusBadge({ code }: { code: number }) {
  const color = code < 300 ? '#22543d' : code < 400 ? '#744210' : '#742a2a';
  const bg = code < 300 ? '#c6f6d5' : code < 400 ? '#fefcbf' : '#fed7d7';
  return (
    <span style={{ padding: '1px 7px', borderRadius: 4, fontSize: 11, fontWeight: 700, background: bg, color, fontFamily: 'monospace' }}>
      {code}
    </span>
  );
}

function CodeBlock({ code, lang = 'json' }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await copyText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div className="api-codeblock">
      <div className="api-codeblock-header">
        <span className="api-codeblock-lang">{lang}</span>
        <button className="api-copy-btn" onClick={handleCopy}>{copied ? '✓ Copiado' : 'Copiar'}</button>
      </div>
      <pre className="api-pre" dangerouslySetInnerHTML={{ __html: lang === 'json' ? highlightJson(code) : escHtml(code) }} />
    </div>
  );
}

function escHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function ParamsTable({ params, title }: { params: Param[]; title: string }) {
  if (!params.length) return null;
  return (
    <div className="api-section-sub">
      <div className="api-section-sub-title">{title}</div>
      <table className="api-params-table">
        <thead>
          <tr>
            <th>Parámetro</th>
            <th>Tipo</th>
            <th>Req.</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {params.map((p) => (
            <tr key={p.name}>
              <td><code className="api-code">{p.name}</code></td>
              <td><span className="api-type">{p.type}</span></td>
              <td>{p.required ? <span className="required">✓</span> : <span style={{ color: '#a0aec0' }}>—</span>}</td>
              <td>{p.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TryItPanel({ endpoint, apiKey }: { endpoint: EndpointDef; apiKey: string }) {
  const queryParams = (endpoint.params || []).filter((p) => p.in === 'query');
  const bodyParams = (endpoint.params || []).filter((p) => p.in === 'body');
  const hasBody = ['POST', 'PATCH'].includes(endpoint.method);

  const [qValues, setQValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(queryParams.map((p) => [p.name, p.example || ''])),
  );
  const [body, setBody] = useState(endpoint.requestExample ? JSON.stringify(endpoint.requestExample, null, 2) : '{}');
  const [state, setState] = useState<TryItState>({ open: false, loading: false, response: null, status: null, error: null });

  const run = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, response: null, error: null, status: null }));
    try {
      let url = endpoint.path.replace(/:[a-zA-Z]+/g, (m) => `{${m.slice(1)}}`);
      // For demo: strip path params — user sees template
      url = '/api/v1' + endpoint.path.split('/api/v1')[1];
      // Replace any path params with placeholder text
      url = url.replace(/:([a-zA-Z]+)/g, '{$1}');

      // Build query string for GET
      if (endpoint.method === 'GET') {
        const qs = Object.entries(qValues).filter(([, v]) => v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
        if (qs) url += '?' + qs;
      }

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (endpoint.auth === 'private' && apiKey) headers['X-API-Key'] = apiKey;

      const opts: RequestInit = { method: endpoint.method, headers };
      if (hasBody && endpoint.method !== 'DELETE') {
        try { opts.body = JSON.stringify(JSON.parse(body)); } catch { opts.body = body; }
      }

      const t0 = Date.now();
      const res = await fetch(url, opts);
      const elapsed = Date.now() - t0;
      let text = await res.text();
      try { text = JSON.stringify(JSON.parse(text), null, 2); } catch { /* keep raw */ }
      setState({ open: true, loading: false, response: text, status: res.status, error: null });
      void elapsed;
    } catch (e) {
      setState({ open: true, loading: false, response: null, status: null, error: String(e) });
    }
  }, [endpoint, qValues, body, apiKey, hasBody]);

  return (
    <div className="api-tryit">
      <div className="api-tryit-title">🧪 Probar en vivo</div>
      {queryParams.length > 0 && (
        <div className="api-tryit-params">
          {queryParams.map((p) => (
            <div key={p.name} className="api-tryit-field">
              <label>{p.name}</label>
              <input
                type="text"
                value={qValues[p.name] || ''}
                placeholder={p.example || p.type}
                onChange={(e) => setQValues((prev) => ({ ...prev, [p.name]: e.target.value }))}
              />
            </div>
          ))}
        </div>
      )}
      {hasBody && bodyParams.length > 0 && (
        <div className="api-tryit-body">
          <label>Request body (JSON)</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} spellCheck={false} />
        </div>
      )}
      {endpoint.auth === 'private' && !apiKey && (
        <div className="api-tryit-warn">⚠️ Introduce tu API Key en el panel de autenticación para ejecutar endpoints privados.</div>
      )}
      <button className="btn btn-primary btn-sm api-run-btn" onClick={run} disabled={state.loading}>
        {state.loading ? '⏳ Ejecutando…' : '▶ Ejecutar'}
      </button>
      {state.status !== null && (
        <div className="api-tryit-response">
          <div className="api-tryit-response-header">
            <StatusBadge code={state.status} />
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>Respuesta</span>
          </div>
          <pre className="api-pre api-pre-response" dangerouslySetInnerHTML={{ __html: state.response ? highlightJson(state.response) : '' }} />
        </div>
      )}
      {state.error && <div className="api-tryit-error">Error: {state.error}</div>}
    </div>
  );
}

function EndpointCard({ ep, apiKey }: { ep: EndpointDef; apiKey: string }) {
  const [expanded, setExpanded] = useState(false);
  const [showTry, setShowTry] = useState(false);

  const pathParams = (ep.params || []).filter((p) => p.in === 'path');
  const queryParams = (ep.params || []).filter((p) => p.in === 'query');
  const bodyParams = (ep.params || []).filter((p) => p.in === 'body');
  const code = ep.statusCode || (ep.method === 'POST' ? 201 : ep.method === 'DELETE' ? 204 : 200);

  return (
    <div className={`api-endpoint ${expanded ? 'is-open' : ''}`}>
      <div className="api-endpoint-header" onClick={() => setExpanded((v) => !v)}>
        <div className="api-endpoint-left">
          <MethodBadge method={ep.method} />
          <code className="api-path">{ep.path}</code>
        </div>
        <div className="api-endpoint-right">
          <span className="api-endpoint-summary">{ep.summary}</span>
          <AuthBadge level={ep.auth} />
          <StatusBadge code={code} />
          <span className="api-expand-icon">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {expanded && (
        <div className="api-endpoint-body">
          {ep.description && <p className="api-desc">{ep.description}</p>}

          <div className="api-endpoint-cols">
            <div className="api-endpoint-params">
              <ParamsTable params={pathParams} title="Parámetros de ruta" />
              <ParamsTable params={queryParams} title="Query params" />
              <ParamsTable params={bodyParams} title="Body (JSON)" />

              <div className="api-section-sub">
                <div className="api-section-sub-title">Respuesta de ejemplo</div>
                <CodeBlock code={fmtJson(ep.responseExample)} />
              </div>

              {ep.requestExample != null && (
                <div className="api-section-sub">
                  <div className="api-section-sub-title">Request de ejemplo</div>
                  <CodeBlock code={fmtJson(ep.requestExample)} />
                </div>
              )}
            </div>
          </div>

          <div className="api-tryit-toggle">
            <button className="btn btn-secondary btn-sm" onClick={() => setShowTry((v) => !v)}>
              {showTry ? '✕ Cerrar' : '🧪 Probar en vivo'}
            </button>
          </div>

          {showTry && <TryItPanel endpoint={ep} apiKey={apiKey} />}
        </div>
      )}
    </div>
  );
}

// ── Section: Overview ─────────────────────────────────────────────────────────

function OverviewSection({ health, onCheck }: { health: HealthState; onCheck: () => void }) {
  const isOk = health.status === 'ok';
  const isErr = health.status === 'error';
  return (
    <div>
      <div className="api-health-card">
        <div className="api-health-left">
          <div className={`api-status-dot ${isOk ? 'is-ok' : isErr ? 'is-err' : 'is-loading'}`} />
          <div>
            <div className="api-health-title">
              {health.status === 'loading' ? 'Comprobando…' : isOk ? 'API Online' : isErr ? 'API Inaccesible' : 'Estado desconocido'}
            </div>
            {health.lastChecked && (
              <div className="api-health-sub">
                Última comprobación: {health.lastChecked.toLocaleTimeString()}
                {health.latency !== null && ` · ${health.latency} ms`}
                {health.apiVersion && ` · v${health.apiVersion}`}
              </div>
            )}
          </div>
        </div>
        <button className="btn btn-sm" onClick={onCheck} disabled={health.status === 'loading'}>
          {health.status === 'loading' ? '⏳' : '↻ Comprobar'}
        </button>
      </div>

      <div className="api-info-grid">
        <div className="api-info-card">
          <div className="api-info-label">Base URL</div>
          <code className="api-code api-code-lg">/api/v1</code>
          <div className="api-info-hint">Relativa al dominio donde está la API</div>
        </div>
        <div className="api-info-card">
          <div className="api-info-label">Autenticación</div>
          <code className="api-code api-code-lg">X-API-Key: &lt;tu-clave&gt;</code>
          <div className="api-info-hint">Header HTTP requerido solo para escritura</div>
        </div>
        <div className="api-info-card">
          <div className="api-info-label">Formato</div>
          <code className="api-code api-code-lg">application/json</code>
          <div className="api-info-hint">Todas las respuestas son JSON</div>
        </div>
        <div className="api-info-card">
          <div className="api-info-label">Versión</div>
          <code className="api-code api-code-lg">1.0.0</code>
          <div className="api-info-hint">Estable · Sin breaking changes planificados</div>
        </div>
      </div>

      <div className="api-overview-grid">
        {GROUPS.map((g) => (
          <div key={g.id} className="api-overview-item">
            <span className="api-overview-icon">{g.icon}</span>
            <div>
              <div className="api-overview-name">{g.label}</div>
              <div className="api-overview-base">{g.base}</div>
              <div className="api-overview-count">{g.endpoints.length} endpoints</div>
            </div>
          </div>
        ))}
      </div>

      <div className="api-response-format">
        <h3>Formato de respuesta</h3>
        <p>Todos los endpoints siguen la misma envoltura:</p>
        <div className="api-two-col">
          <div>
            <div className="api-section-sub-title">Éxito (2xx)</div>
            <CodeBlock code={`{\n  "data": { ... }  // o array\n}`} />
          </div>
          <div>
            <div className="api-section-sub-title">Lista paginada</div>
            <CodeBlock code={`{\n  "data": [...],\n  "meta": {\n    "pagination": {\n      "page": 1,\n      "per_page": 20,\n      "total": 150,\n      "total_pages": 8\n    }\n  }\n}`} />
          </div>
          <div>
            <div className="api-section-sub-title">Error (4xx / 5xx)</div>
            <CodeBlock code={`{\n  "error": "NOT_FOUND",\n  "message": "Product not found"\n}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Section: Auth ─────────────────────────────────────────────────────────────

function AuthSection({ apiKey, setApiKey }: { apiKey: string; setApiKey: (k: string) => void }) {
  return (
    <div>
      <div className="api-section-intro">
        <p>Los endpoints de <strong>lectura son públicos</strong> — no requieren autenticación. Los endpoints de <strong>escritura (POST, PATCH, DELETE)</strong> requieren el header <code className="api-code">X-API-Key</code>.</p>
      </div>

      <div className="api-auth-key-panel">
        <div className="api-info-label">Tu API Key (para "Probar en vivo")</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
          <input
            type="password"
            className="api-key-input"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="dev-key  (entorno local)"
          />
          {apiKey && <span style={{ color: 'var(--success)', fontSize: 12 }}>✓ Configurada</span>}
        </div>
        <div className="api-info-hint">La clave se guarda solo en memoria de esta sesión, no se envía a ningún servidor externo.</div>
      </div>

      <h3 className="api-h3">Uso del header</h3>
      <CodeBlock lang="bash" code={`curl -X POST https://tu-api.com/api/v1/products \\\n  -H "Content-Type: application/json" \\\n  -H "X-API-Key: tu-clave-secreta" \\\n  -d '{"name": "KAISE KS12-100", ...}'`} />

      <h3 className="api-h3">Configuración del servidor</h3>
      <p className="api-p">La clave se define en el fichero <code className="api-code">.env</code> del servidor de la API:</p>
      <CodeBlock lang="bash" code={`# .env\nAPI_KEY_SECRET=mi-clave-secreta-segura\nPORT=3000`} />

      <h3 className="api-h3">Endpoints públicos vs privados</h3>
      <table className="api-params-table">
        <thead><tr><th>Método</th><th>Requiere API Key</th><th>Descripción</th></tr></thead>
        <tbody>
          <tr><td><MethodBadge method="GET" /></td><td><span style={{ color: 'var(--success)' }}>No</span></td><td>Lectura de cualquier recurso</td></tr>
          <tr><td><MethodBadge method="POST" /></td><td><span style={{ color: 'var(--danger)' }}>Sí</span></td><td>Creación de recursos</td></tr>
          <tr><td><MethodBadge method="PATCH" /></td><td><span style={{ color: 'var(--danger)' }}>Sí</span></td><td>Actualización parcial</td></tr>
          <tr><td><MethodBadge method="DELETE" /></td><td><span style={{ color: 'var(--danger)' }}>Sí</span></td><td>Eliminación de recursos</td></tr>
        </tbody>
      </table>
    </div>
  );
}

// ── Section: Endpoints ────────────────────────────────────────────────────────

function EndpointsSection({ group, apiKey }: { group: GroupDef; apiKey: string }) {
  return (
    <div>
      <div className="api-group-header">
        <span className="api-group-icon">{group.icon}</span>
        <div>
          <div className="api-group-title">{group.label}</div>
          <code className="api-code">{group.base}</code>
        </div>
      </div>
      <p className="api-p" style={{ marginBottom: 20 }}>{group.description}</p>
      <div className="api-endpoints-list">
        {group.endpoints.map((ep) => (
          <EndpointCard key={ep.method + ep.path} ep={ep} apiKey={apiKey} />
        ))}
      </div>
    </div>
  );
}

// ── Section: WordPress Installation ──────────────────────────────────────────

function WPSection() {
  return (
    <div>
      <div className="api-section-intro">
        <p>El plugin <strong>Kaise Catalog</strong> integra el catálogo en cualquier WordPress con un shortcode. Conecta con la API REST y renderiza el buscador interactivo con filtros, wizard guiado y búsqueda por IA.</p>
      </div>

      <h3 className="api-h3">Requisitos</h3>
      <ul className="api-list">
        <li>WordPress 5.0 o superior</li>
        <li>PHP 7.4 o superior</li>
        <li>API Kaise accesible desde el servidor WordPress</li>
        <li>jQuery (incluido en WordPress por defecto)</li>
      </ul>

      <h3 className="api-h3">Instalación</h3>
      <div className="api-steps">
        <div className="api-step">
          <div className="api-step-num">1</div>
          <div className="api-step-content">
            <div className="api-step-title">Copiar el plugin al servidor</div>
            <p>Copia la carpeta <code className="api-code">kaise-catalog/</code> en el directorio de plugins de WordPress:</p>
            <CodeBlock lang="bash" code={`/wp-content/plugins/kaise-catalog/\n  ├── kaise-catalog.php\n  ├── assets/\n  │   ├── kaise-catalog.js\n  │   ├── kaise-catalog.css\n  │   ├── kc-data.js\n  │   ├── kc-compat.js\n  │   └── kc-wizard.js\n  └── templates/\n      └── catalog.php`} />
          </div>
        </div>
        <div className="api-step">
          <div className="api-step-num">2</div>
          <div className="api-step-content">
            <div className="api-step-title">Activar el plugin</div>
            <p>Ve a <strong>WordPress Admin → Plugins</strong> y activa <strong>Kaise Catalog</strong>.</p>
          </div>
        </div>
        <div className="api-step">
          <div className="api-step-num">3</div>
          <div className="api-step-content">
            <div className="api-step-title">Configurar</div>
            <p>Ve a <strong>Ajustes → Kaise Catalog</strong> y configura:</p>
            <table className="api-params-table">
              <thead><tr><th>Campo</th><th>Descripción</th><th>Ejemplo</th></tr></thead>
              <tbody>
                <tr><td><code className="api-code">URL de la API</code></td><td>URL base de tu API (incluyendo /api/v1)</td><td><code className="api-code">https://api.ejemplo.com/api/v1</code></td></tr>
                <tr><td><code className="api-code">Clave Gemini</code></td><td>API Key de Google Gemini para búsqueda por IA (opcional, gratis)</td><td><code className="api-code">AIza…</code></td></tr>
                <tr><td><code className="api-code">Resultados por página</code></td><td>Número de productos por página (5–100)</td><td><code className="api-code">20</code></td></tr>
                <tr><td><code className="api-code">URL de contacto</code></td><td>Página de contacto para el botón "Solicitar información"</td><td><code className="api-code">https://ejemplo.com/contacto</code></td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="api-step">
          <div className="api-step-num">4</div>
          <div className="api-step-content">
            <div className="api-step-title">Insertar el shortcode</div>
            <p>En cualquier página o entrada de WordPress:</p>
            <CodeBlock lang="html" code={`[kaise_catalog]`} />
          </div>
        </div>
      </div>

      <h3 className="api-h3">Funcionalidades del plugin</h3>
      <div className="api-features-grid">
        {[
          { icon: '🔍', title: 'Búsqueda por IA', desc: 'Google Gemini interpreta lenguaje natural ("batería para camper 12V 100Ah") y la convierte en filtros técnicos exactos.' },
          { icon: '🧙', title: 'Asistente guiado', desc: '7 pasos que guían al usuario desde aplicación → tecnología → tensión → capacidad → gamma hasta ver resultados.' },
          { icon: '⚡', title: 'Filtros técnicos', desc: 'Compatibilidad bidireccional: seleccionar una gamma filtra techs disponibles, y viceversa.' },
          { icon: '📋', title: 'Ficha de producto', desc: 'Panel lateral con datos técnicos completos, PDFs descargables e imagen principal.' },
          { icon: '📱', title: 'Responsive', desc: 'Diseño adaptado a móvil, tablet y escritorio.' },
          { icon: '🌐', title: 'Sin dependencias', desc: 'Solo jQuery (WordPress nativo). No requiere React ni frameworks adicionales.' },
        ].map((f) => (
          <div key={f.title} className="api-feature-card">
            <span className="api-feature-icon">{f.icon}</span>
            <div>
              <div className="api-feature-title">{f.title}</div>
              <div className="api-feature-desc">{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Section: Examples ─────────────────────────────────────────────────────────

function ExamplesSection() {
  const examples = [
    {
      title: 'Listar productos publicados (JavaScript / fetch)',
      lang: 'javascript',
      code: `// Obtener productos publicados con paginación
const response = await fetch('/api/v1/products?status=published&page=1&per_page=20');
const { data, meta } = await response.json();

console.log(\`\${meta.pagination.total} productos encontrados\`);
data.forEach(product => {
  console.log(product.name, product.attributes_json);
});`,
    },
    {
      title: 'Filtrar por tecnología y tensión',
      lang: 'javascript',
      code: `// Baterías VRLA-AGM de 12V con capacidad entre 100 y 300 Ah
const params = new URLSearchParams({
  status:       'published',
  technology:   'VRLA-AGM',
  voltage:      '12',
  capacity_min: '100',
  capacity_max: '300',
  per_page:     '50',
});

const res = await fetch(\`/api/v1/products?\${params}\`);
const { data } = await res.json();
console.log(data.map(p => p.name));`,
    },
    {
      title: 'Obtener árbol de categorías',
      lang: 'javascript',
      code: `// Árbol completo para construir un selector jerárquico
const res = await fetch('/api/v1/categories/tree');
const { data } = await res.json();

// data = [ { name: 'VRLA-AGM', children: [ { name: 'Flat', children: [...] } ] } ]
function renderTree(nodes, level = 0) {
  nodes.forEach(node => {
    console.log(' '.repeat(level * 2) + node.name);
    if (node.children?.length) renderTree(node.children, level + 1);
  });
}
renderTree(data);`,
    },
    {
      title: 'Crear producto con autenticación',
      lang: 'javascript',
      code: `const API_KEY = process.env.API_KEY_SECRET; // nunca expongas en frontend

const res = await fetch('/api/v1/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY,
  },
  body: JSON.stringify({
    name:            'KAISE KS12-100',
    slug:            'ks12-100',
    product_type_id: '550e8400-e29b-41d4-a716-446655440000',
    status:          'published',
    attributes: {
      voltage:       12,
      capacity:      100,
      weight:        28.5,
      terminal_type: 'M8',
    },
    category_ids: ['a11c1e00-1000-4000-8000-000000000001'],
  }),
});

const { data } = await res.json(); // { id: 'new-uuid', name: 'KAISE KS12-100', ... }
console.log('Creado:', data.id);`,
    },
    {
      title: 'Subir imagen y asignarla al producto (PHP)',
      lang: 'php',
      code: `<?php
$api_url = get_option('kaise_catalog_api_url');
$api_key = defined('KAISE_API_KEY') ? KAISE_API_KEY : '';

// 1. Subir el archivo
$file_path = '/tmp/foto_producto.jpg';
$response = wp_remote_post("$api_url/uploads", [
    'headers' => ['X-API-Key' => $api_key],
    'body'    => ['file' => new CURLFile($file_path)],
]);
$upload = json_decode(wp_remote_retrieve_body($response), true);
$image_url = $upload['data']['url'];

// 2. Añadir la imagen al producto
$product_id = 'uuid-del-producto';
wp_remote_post("$api_url/products/$product_id/media", [
    'headers' => [
        'Content-Type' => 'application/json',
        'X-API-Key'    => $api_key,
    ],
    'body' => json_encode([
        'type'  => 'image',
        'url'   => $image_url,
        'title' => 'Vista frontal',
        'order' => 0,
    ]),
]);`,
    },
    {
      title: 'Listar productos desde un tema WordPress (PHP)',
      lang: 'php',
      code: `<?php
// functions.php o en cualquier template
function kaise_get_products(array $filters = []): array {
    $api_url = get_option('kaise_catalog_api_url', 'https://api.kaise.com/api/v1');
    $params  = http_build_query(array_merge(['status' => 'published', 'per_page' => 20], $filters));
    $url     = "$api_url/products?$params";

    $response = wp_remote_get($url, ['timeout' => 10]);
    if (is_wp_error($response)) return [];

    $body = json_decode(wp_remote_retrieve_body($response), true);
    return $body['data'] ?? [];
}

// Uso:
$products = kaise_get_products(['technology' => 'LiFePO4', 'voltage' => 24]);
foreach ($products as $p) {
    echo '<h3>' . esc_html($p['name']) . '</h3>';
    echo '<p>' . esc_html($p['description']) . '</p>';
}`,
    },
    {
      title: 'Filtrar por aplicación + tecnología con compatibilidad',
      lang: 'javascript',
      code: `// La API aplica el algoritmo de compatibilidad automáticamente.
// Solo se devuelven productos que encajan con la combinación.

// Baterías solares de litio de 48V
const res = await fetch('/api/v1/products?' + new URLSearchParams({
  status:      'published',
  application: 'Solar',
  technology:  'LiFePO4',
  voltage:     '48',
}));
const { data, meta } = await res.json();
console.log(\`\${meta.pagination.total} resultados:\`, data.map(p => p.name));

// Baterías para telecomunicaciones con clasificación Eurobat
const res2 = await fetch('/api/v1/products?' + new URLSearchParams({
  status:      'published',
  application: 'Telecomunicaciones',
  eurobat:     'true',
}));`,
    },
    {
      title: 'Gestión de atributos (flujo completo)',
      lang: 'javascript',
      code: `const KEY = 'tu-api-key';
const headers = { 'Content-Type': 'application/json', 'X-API-Key': KEY };

// 1. Crear atributo global
const attr = await fetch('/api/v1/attributes', {
  method: 'POST', headers,
  body: JSON.stringify({ name: 'cycles', label: 'Ciclos de vida', data_type: 'number', is_filterable: true }),
}).then(r => r.json());

// 2. Obtener ID del tipo de producto
const types = await fetch('/api/v1/product-types').then(r => r.json());
const typeId = types.data[0].id;

// 3. Asignar el atributo al tipo
await fetch(\`/api/v1/product-types/\${typeId}/attributes\`, {
  method: 'POST', headers,
  body: JSON.stringify({ attribute_id: attr.data.id, is_required: false, order: 5 }),
});

console.log('Atributo creado y asignado al tipo');`,
    },
  ];

  return (
    <div>
      <div className="api-section-intro">
        <p>Ejemplos prácticos listos para usar. Copia el código y adapta las URLs y credenciales a tu entorno.</p>
      </div>
      <div className="api-examples-list">
        {examples.map((ex, i) => (
          <div key={i} className="api-example">
            <div className="api-example-title">
              <span className="api-example-num">{i + 1}</span>
              {ex.title}
            </div>
            <CodeBlock code={ex.code} lang={ex.lang} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

type SectionId = 'overview' | 'auth' | string;

const NAV_ITEMS: { id: SectionId; label: string; icon: string }[] = [
  { id: 'overview', label: 'Estado', icon: '📡' },
  { id: 'auth', label: 'Autenticación', icon: '🔐' },
  ...GROUPS.map((g) => ({ id: g.id, label: g.label, icon: g.icon })),
  { id: 'wp', label: 'Plugin WordPress', icon: '🔌' },
  { id: 'examples', label: 'Ejemplos', icon: '💡' },
];

export default function ApiReference() {
  const [section, setSection] = useState<SectionId>('overview');
  const [apiKey, setApiKey] = useState('dev-key');
  const [health, setHealth] = useState<HealthState>({ status: 'idle', latency: null, lastChecked: null });

  const checkHealth = useCallback(async () => {
    setHealth((h) => ({ ...h, status: 'loading' }));
    const t0 = Date.now();
    try {
      const [healthRes, infoRes] = await Promise.all([
        fetch('/health'),
        fetch('/api/v1'),
      ]);
      const latency = Date.now() - t0;
      const info = await infoRes.json().catch(() => ({}));
      setHealth({
        status: healthRes.ok ? 'ok' : 'error',
        latency,
        lastChecked: new Date(),
        apiVersion: info.version,
        endpointCount: Object.keys(info.endpoints || {}).length,
      });
    } catch {
      setHealth({ status: 'error', latency: null, lastChecked: new Date() });
    }
  }, []);

  useEffect(() => { checkHealth(); }, [checkHealth]);

  const activeGroup = GROUPS.find((g) => g.id === section);

  return (
    <div className="api-ref">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>API Reference</h1>
          <div style={{ color: 'var(--muted)', fontSize: 13 }}>
            Documentación completa · Pruebas en vivo · Guía de integración WordPress
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className={`api-status-pill ${health.status === 'ok' ? 'is-ok' : health.status === 'error' ? 'is-err' : 'is-loading'}`}>
            <span className="api-status-dot-sm" />
            {health.status === 'ok' ? 'Online' : health.status === 'error' ? 'Offline' : 'Comprobando…'}
            {health.latency !== null && ` · ${health.latency}ms`}
          </div>
        </div>
      </div>

      <div className="api-layout">
        {/* Sidebar nav */}
        <nav className="api-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`api-nav-item ${section === item.id ? 'is-active' : ''}`}
              onClick={() => setSection(item.id)}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="api-content">
          {section === 'overview' && <OverviewSection health={health} onCheck={checkHealth} />}
          {section === 'auth' && <AuthSection apiKey={apiKey} setApiKey={setApiKey} />}
          {section === 'wp' && <WPSection />}
          {section === 'examples' && <ExamplesSection />}
          {activeGroup && <EndpointsSection group={activeGroup} apiKey={apiKey} />}
        </div>
      </div>
    </div>
  );
}
