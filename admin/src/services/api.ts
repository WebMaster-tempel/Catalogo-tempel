const BASE_URL = '/api/v1';

function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers as Record<string, string>),
    },
  });

  const data = await res.json();

  if (!res.ok) {
    if (res.status === 401) {
      window.dispatchEvent(new CustomEvent('auth:required'));
    }
    throw new Error(data.message || 'API error');
  }

  return data;
}

// --- Auth ---
export const authApi = {
  login: (email: string, password: string) =>
    request<{ token: string; user: object }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (email: string, password: string) =>
    request<{ token: string; user: object }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

// --- Products ---
export const productsApi = {
  list: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request<any>(`/products${qs ? `?${qs}` : ''}`);
  },
  get: (id: string) => request<any>(`/products/${id}`),
  create: (body: object) =>
    request<any>('/products', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: object) =>
    request<any>(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (id: string) =>
    request<any>(`/products/${id}`, { method: 'DELETE' }),
  addMedia: (id: string, body: object) =>
    request<any>(`/products/${id}/media`, { method: 'POST', body: JSON.stringify(body) }),
  deleteMedia: (productId: string, mediaId: string) =>
    request<any>(`/products/${productId}/media/${mediaId}`, { method: 'DELETE' }),
};

// --- Product Types ---
export const productTypesApi = {
  list: () => request<any>('/product-types'),
  get: (id: string) => request<any>(`/product-types/${id}`),
  create: (body: object) =>
    request<any>('/product-types', { method: 'POST', body: JSON.stringify(body) }),
  delete: (id: string) =>
    request<any>(`/product-types/${id}`, { method: 'DELETE' }),
  assignAttribute: (typeId: string, body: object) =>
    request<any>(`/product-types/${typeId}/attributes`, { method: 'POST', body: JSON.stringify(body) }),
  removeAttribute: (typeId: string, attrId: string) =>
    request<any>(`/product-types/${typeId}/attributes/${attrId}`, { method: 'DELETE' }),
};

// --- Categories ---
export const categoriesApi = {
  list: () => request<any>('/categories'),
  tree: () => request<any>('/categories/tree'),
  get: (id: string) => request<any>(`/categories/${id}`),
  create: (body: object) =>
    request<any>('/categories', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: object) =>
    request<any>(`/categories/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (id: string) =>
    request<any>(`/categories/${id}`, { method: 'DELETE' }),
  getFeatures: (categoryId: string, type?: string) =>
    request<any>(`/categories/${categoryId}/features${type ? `?type=${type}` : ''}`),
  createFeature: (categoryId: string, body: object) =>
    request<any>(`/categories/${categoryId}/features`, { method: 'POST', body: JSON.stringify(body) }),
  updateFeature: (categoryId: string, featureId: string, body: object) =>
    request<any>(`/categories/${categoryId}/features/${featureId}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteFeature: (categoryId: string, featureId: string) =>
    request<any>(`/categories/${categoryId}/features/${featureId}`, { method: 'DELETE' }),
  reorderFeatures: (categoryId: string, featureIds: string[]) =>
    request<any>(`/categories/${categoryId}/features/reorder`, { method: 'POST', body: JSON.stringify({ featureIds }) }),
};

// --- Attributes ---
export const attributesApi = {
  list: () => request<any>('/attributes'),
  get: (id: string) => request<any>(`/attributes/${id}`),
  create: (body: object) =>
    request<any>('/attributes', { method: 'POST', body: JSON.stringify(body) }),
  delete: (id: string) =>
    request<any>(`/attributes/${id}`, { method: 'DELETE' }),
};

// --- Uploads ---
export const uploadsApi = {
  upload: async (file: File): Promise<{ data: { url: string; type: string } }> => {
    const token = getToken();
    const form = new FormData();
    form.append('file', file);
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${BASE_URL}/uploads`, {
      method: 'POST',
      headers,
      body: form,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Upload failed');
    return data;
  },
};
