import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productsApi, productTypesApi } from '../services/api';
import { Product, ProductType } from '../types';
import ConfirmDialog from '../components/ConfirmDialog';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [productType, setProductType] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    productsApi.get(id!).then((res) => {
      setProduct(res.data);
      return productTypesApi.get(res.data.product_type_id);
    }).then((res) => {
      setProductType(res.data);
      setLoading(false);
    });
  }, [id]);

  async function handleDelete() {
    await productsApi.delete(id!);
    navigate('/products');
  }

  if (loading) return <p className="loading">Cargando...</p>;
  if (!product) return <p className="error">Producto no encontrado</p>;

  const mainImage = product.media?.find((m) => m.type === 'image');

  return (
    <div>
      <div className="page-header">
        <h1>📦 {product.name}</h1>
        <div className="actions">
          <Link to={`/products/${id}/edit`} className="btn btn-secondary">✏️ Editar</Link>
          <button className="btn btn-danger" onClick={() => setShowDelete(true)}>🗑️ Eliminar</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>
        <div>
          {mainImage && (
            <div style={{
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '1.5rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            }}>
              <img src={mainImage.url} alt={product.name} style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          )}

          <div style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 700, color: '#1a202c' }}>
              ℹ️ Información
            </h3>
            <dl style={{ margin: 0 }}>
              <dt style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginTop: '12px', marginBottom: '4px' }}>Estado</dt>
              <dd style={{ margin: '0 0 12px 0' }}><span className={`badge badge-${product.status}`}>{product.status === 'published' ? 'Publicado' : product.status === 'draft' ? 'Borrador' : 'Archivado'}</span></dd>
              <dt style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginTop: '12px', marginBottom: '4px' }}>Tipo</dt>
              <dd style={{ margin: '0 0 12px 0', color: '#1a202c', fontSize: '14px' }}>{productType?.name || '—'}</dd>
              <dt style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginTop: '12px', marginBottom: '4px' }}>Slug</dt>
              <dd style={{ margin: '0 0 12px 0' }}>
                <code style={{
                  fontSize: '12px',
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  color: '#64748b',
                  display: 'inline-block',
                }}>
                  {product.slug}
                </code>
              </dd>
              {product.description && (
                <>
                  <dt style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginTop: '12px', marginBottom: '4px' }}>Descripción</dt>
                  <dd style={{ margin: 0, color: '#475569', lineHeight: '1.6', fontSize: '14px' }}>{product.description}</dd>
                </>
              )}
            </dl>
          </div>

          {product.categories && product.categories.length > 0 && (
            <div style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 700, color: '#1a202c' }}>
                🏷️ Categorías
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {product.categories.map((c) => (
                  <span key={c.id} style={{
                    background: '#eef2ff',
                    color: '#4f46e5',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 500,
                  }}>
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ position: 'sticky', top: '24px' }}>
          {product.attributes_json && Object.keys(product.attributes_json).length > 0 && (
            <div style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '20px',
              marginBottom: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 700, color: '#1a202c' }}>
                ⚙️ Atributos
              </h3>
              <dl style={{ margin: 0, display: 'grid', gap: '12px' }}>
                {productType?.attributes?.map((attr) => {
                  const val = product.attributes_json![attr.name];
                  if (val === undefined) return null;
                  return (
                    <div key={attr.id} style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      padding: '10px 12px',
                    }}>
                      <dt style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                        {attr.label}
                      </dt>
                      <dd style={{ margin: 0, fontSize: '13px', fontWeight: 500, color: '#1a202c' }}>
                        {String(val)}{attr.unit ? ` ${attr.unit}` : ''}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          )}

          {product.media && product.media.length > 0 && (
            <div style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 700, color: '#1a202c' }}>
                📎 Media
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {product.media.map((m) => (
                  <div key={m.id}>
                    {m.type === 'image' ? (
                      <img src={m.url} alt={m.title || ''} style={{
                        width: '100%',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                      }} />
                    ) : (
                      <a href={m.url} target="_blank" rel="noopener noreferrer" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 12px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        color: '#4f46e5',
                        fontSize: '13px',
                        fontWeight: 500,
                      }}>
                        📄 {m.title || 'Archivo PDF'}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showDelete && (
        <ConfirmDialog
          message={`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </div>
  );
}
