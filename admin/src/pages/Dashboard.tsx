import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsApi, categoriesApi, productTypesApi, attributesApi } from '../services/api';
import { Product } from '../types';

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, categories: 0, types: 0, attributes: 0 });
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [perPage, setPerPage] = useState(12);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productsApi.list({ per_page: '1' }),
      categoriesApi.list(),
      productTypesApi.list(),
      attributesApi.list(),
      productsApi.list({ per_page: String(perPage) }),
    ]).then(([products, categories, types, attributes, recents]) => {
      setStats({
        products: products.meta?.pagination?.total || 0,
        categories: categories.data?.length || 0,
        types: types.data?.length || 0,
        attributes: attributes.data?.length || 0,
      });
      setRecentProducts(recents.data || []);
      setLoading(false);
    });
  }, [perPage]);

  return (
    <div>
      <div className="page-header">
        <h1>Panel de administración</h1>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <Link to="/products" className="stat-card">
          <span className="stat-number">{stats.products}</span>
          <span className="stat-label">Productos</span>
        </Link>
        <Link to="/categories" className="stat-card">
          <span className="stat-number">{stats.categories}</span>
          <span className="stat-label">Categorías</span>
        </Link>
        <Link to="/product-types" className="stat-card">
          <span className="stat-number">{stats.types}</span>
          <span className="stat-label">Tipos</span>
        </Link>
        <Link to="/attributes" className="stat-card">
          <span className="stat-number">{stats.attributes}</span>
          <span className="stat-label">Atributos</span>
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
        {/* Products Grid */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)' }}>Productos destacados</h2>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Mostrar:</label>
                <select
                  value={perPage}
                  onChange={(e) => setPerPage(Number(e.target.value))}
                  style={{ fontSize: '13px' }}
                >
                  <option value={6}>6</option>
                  <option value={12}>12</option>
                  <option value={18}>18</option>
                  <option value={24}>24</option>
                </select>
              </div>
              <Link to="/products" className="btn btn-sm" style={{ fontSize: '12px' }}>Ver todos →</Link>
            </div>
          </div>

          {loading ? (
            <p className="loading">Cargando...</p>
          ) : recentProducts.length === 0 ? (
            <div style={{
              background: '#fff',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '32px 24px',
              textAlign: 'center',
              color: 'var(--muted)',
            }}>
              <p style={{ fontSize: '14px', marginBottom: '12px' }}>No hay productos aún.</p>
              <Link to="/products/new" className="btn btn-primary">Crear primer producto</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {recentProducts.map((p) => {
                const mainMedia = p.media?.find((m) => m.type === 'image');
                const categories = p.categories || [];
                return (
                  <Link
                    to={`/products/${p.id}`}
                    key={p.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 'var(--radius)',
                      overflow: 'hidden',
                      border: '1px solid var(--border)',
                      background: '#fff',
                      textDecoration: 'none',
                      color: 'inherit',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    <div style={{
                      height: '120px',
                      background: mainMedia ? `url(${mainMedia.url})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}>
                      {!mainMedia && <span style={{ fontSize: '2em', opacity: 0.5 }}>📦</span>}
                      <span className={`badge badge-${p.status}`} style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        fontSize: '10px',
                      }}>
                        {p.status === 'published' ? 'Publicado' : p.status === 'draft' ? 'Borrador' : 'Archivado'}
                      </span>
                    </div>
                    <div style={{ padding: '10px 12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.name}
                      </h4>
                      {categories.length > 0 && (
                        <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', marginBottom: '6px' }}>
                          {categories.slice(0, 2).map((c) => (
                            <span key={c.id} style={{
                              fontSize: '10px',
                              background: '#eef2ff',
                              color: '#4f46e5',
                              padding: '2px 6px',
                              borderRadius: '3px',
                            }}>
                              {c.name.split(' ').pop()}
                            </span>
                          ))}
                          {categories.length > 2 && (
                            <span style={{
                              fontSize: '10px',
                              color: '#94a3b8',
                            }}>
                              +{categories.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                      {p.description && (
                        <p style={{
                          margin: 0,
                          fontSize: '11px',
                          color: 'var(--muted)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {p.description}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="card">
            <h3 style={{ marginBottom: '12px' }}>Acciones rápidas</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link to="/products/new" className="btn btn-primary" style={{ textAlign: 'center' }}>
                + Nuevo producto
              </Link>
              <Link to="/categories" className="btn" style={{ textAlign: 'center' }}>
                Gestionar categorías
              </Link>
              <Link to="/product-types" className="btn" style={{ textAlign: 'center' }}>
                Gestionar tipos
              </Link>
              <Link to="/attributes" className="btn" style={{ textAlign: 'center' }}>
                Gestionar atributos
              </Link>
            </div>
          </div>

          <div className="card" style={{ background: '#f0fdf4', borderLeft: '4px solid #22c55e' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#15803d' }}>💡 Tip</h4>
            <p style={{ margin: 0, fontSize: '12px', color: '#166534', lineHeight: '1.4' }}>
              Todos los productos incluyen categorías, atributos y media. Utiliza la API para acceder a los datos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
