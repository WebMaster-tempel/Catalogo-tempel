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
        <h1>{product.name}</h1>
        <div className="actions">
          <Link to={`/products/${id}/edit`} className="btn btn-secondary">Editar</Link>
          <button className="btn btn-danger" onClick={() => setShowDelete(true)}>Eliminar</button>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-main">
          {mainImage && <img src={mainImage.url} alt={product.name} className="detail-image" />}

          <div className="card">
            <h3>Información</h3>
            <dl>
              <dt>Estado</dt>
              <dd><span className={`badge badge-${product.status}`}>{product.status}</span></dd>
              <dt>Tipo</dt>
              <dd>{productType?.name || '—'}</dd>
              <dt>Slug</dt>
              <dd><code>{product.slug}</code></dd>
              {product.description && (
                <>
                  <dt>Descripción</dt>
                  <dd>{product.description}</dd>
                </>
              )}
            </dl>
          </div>

          {product.categories && product.categories.length > 0 && (
            <div className="card">
              <h3>Categorías</h3>
              <div className="tag-list">
                {product.categories.map((c) => (
                  <span key={c.id} className="tag">{c.name}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="detail-aside">
          {product.attributes_json && Object.keys(product.attributes_json).length > 0 && (
            <div className="card">
              <h3>Atributos técnicos</h3>
              <dl>
                {productType?.attributes?.map((attr) => {
                  const val = product.attributes_json![attr.name];
                  if (val === undefined) return null;
                  return (
                    <>
                      <dt key={`dt-${attr.id}`}>{attr.label}</dt>
                      <dd key={`dd-${attr.id}`}>
                        {String(val)}{attr.unit ? ` ${attr.unit}` : ''}
                      </dd>
                    </>
                  );
                })}
              </dl>
            </div>
          )}

          {product.media && product.media.length > 0 && (
            <div className="card">
              <h3>Archivos</h3>
              <div className="media-grid-small">
                {product.media.map((m) => (
                  <div key={m.id}>
                    {m.type === 'image' ? (
                      <img src={m.url} alt={m.title || ''} />
                    ) : (
                      <a href={m.url} target="_blank" rel="noopener noreferrer" className="pdf-link">
                        📄 {m.title || 'PDF'}
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
