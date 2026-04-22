import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { productsApi, categoriesApi, productTypesApi } from '../services/api';
import { Product, Category, ProductType, PaginationMeta } from '../types';
import Pagination from '../components/Pagination';
import ConfirmDialog from '../components/ConfirmDialog';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, per_page: 20, total: 0, total_pages: 0 });
  const [categories, setCategories] = useState<Category[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [typeId, setTypeId] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, string> = { page: String(page), per_page: '20' };
      if (search) params.search = search;
      if (categoryId) params.category_id = categoryId;
      if (typeId) params.product_type_id = typeId;

      const res = await productsApi.list(params);
      setProducts(res.data);
      setMeta(res.meta.pagination);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error cargando productos');
    } finally {
      setLoading(false);
    }
  }, [page, search, categoryId, typeId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    Promise.all([categoriesApi.list(), productTypesApi.list()]).then(([cat, types]) => {
      setCategories(cat.data);
      setProductTypes(types.data);
    });
  }, []);

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await productsApi.delete(deleteId);
      setDeleteId(null);
      fetchProducts();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  }

  return (
    <div>
      <div className="page-header">
        <h1>Productos ({meta.total})</h1>
        <Link to="/products/new" className="btn btn-primary">+ Nuevo producto</Link>
      </div>

      <form className="filters" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}>
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select value={typeId} onChange={(e) => { setTypeId(e.target.value); setPage(1); }}>
          <option value="">Todos los tipos</option>
          {productTypes.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        <button type="submit" className="btn">Buscar</button>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', borderLeft: '1px solid #ddd', paddingLeft: '1rem' }}>
          <button
            type="button"
            className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setViewMode('list')}
            title="Vista de lista"
          >
            ☰ Lista
          </button>
          <button
            type="button"
            className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setViewMode('grid')}
            title="Vista de cuadrícula"
          >
            ⊞ Grid
          </button>
        </div>
      </form>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p className="loading">Cargando...</p>
      ) : (
        <>
          {viewMode === 'list' ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr><td colSpan={5} className="empty">No hay productos</td></tr>
                ) : (
                  products.map((p) => {
                    const mainMedia = p.media?.find((m) => m.type === 'image');
                    const productCategories = p.categories || [];
                    return (
                      <tr key={p.id}>
                        <td>
                          {mainMedia ? (
                            <img src={mainMedia.url} alt={p.name} className="table-thumb" />
                          ) : (
                            <div className="no-image">Sin imagen</div>
                          )}
                        </td>
                        <td>
                          <strong>{p.name}</strong>
                          {p.description && <p className="text-muted">{p.description.slice(0, 80)}...</p>}
                        </td>
                        <td>
                          {productCategories.length > 0
                            ? productCategories.map((c) => (
                                <span key={c.id} className="tag" style={{ marginRight: '4px', fontSize: '11px' }}>{c.name}</span>
                              ))
                            : <span style={{ color: '#999' }}>—</span>
                          }
                        </td>
                        <td>
                          <span className={`badge badge-${p.status}`}>{p.status}</span>
                        </td>
                        <td>
                          <div className="actions">
                            <Link to={`/products/${p.id}`} className="btn btn-sm">Ver</Link>
                            <Link to={`/products/${p.id}/edit`} className="btn btn-sm btn-secondary">Editar</Link>
                            <button className="btn btn-sm btn-danger" onClick={() => setDeleteId(p.id)}>
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              {products.map((p) => {
                const mainMedia = p.media?.find((m) => m.type === 'image');
                const productCategories = p.categories || [];
                return (
                  <div
                    key={p.id}
                    style={{
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      backgroundColor: '#fff',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                      (e.currentTarget as HTMLElement).style.transform = 'none';
                    }}
                  >
                    <div style={{ minHeight: '140px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {mainMedia ? (
                        <img src={mainMedia.url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '3em' }}>⚡</span>
                      )}
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <h4 style={{ margin: '0.5rem 0', fontSize: '0.95em' }}>
                        <Link to={`/products/${p.id}`} style={{ color: '#007bff', textDecoration: 'none' }}>
                          {p.name}
                        </Link>
                      </h4>
                      <p style={{ fontSize: '0.85em', color: '#666', marginBottom: '0.5rem' }}>
                        {p.description?.slice(0, 60)}...
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <small style={{ color: '#999' }}>
                          {productCategories.length > 0 ? productCategories.map((c) => c.name).join(', ') : '—'}
                        </small>
                        <span className={`badge badge-${p.status}`}>{p.status}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <Link to={`/products/${p.id}`} className="btn btn-sm" style={{ flex: 1, textAlign: 'center' }}>Ver</Link>
                        <Link to={`/products/${p.id}/edit`} className="btn btn-sm btn-secondary" style={{ flex: 1, textAlign: 'center' }}>Editar</Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <Pagination meta={meta} onChange={setPage} />
        </>
      )}

      {deleteId && (
        <ConfirmDialog
          message="¿Eliminar este producto? Esta acción no se puede deshacer."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
