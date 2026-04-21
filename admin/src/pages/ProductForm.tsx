import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productsApi, productTypesApi, categoriesApi } from '../services/api';
import { ProductType, Category, Media, AttributeWithMeta } from '../types';
import DynamicAttributeFields from '../components/DynamicAttributeFields';
import MediaManager from '../components/MediaManager';

interface FormState {
  name: string;
  slug: string;
  description: string;
  product_type_id: string;
  status: 'draft' | 'published' | 'archived';
  category_ids: string[];
  attributes: Record<string, unknown>;
}

const EMPTY: FormState = {
  name: '',
  slug: '',
  description: '',
  product_type_id: '',
  status: 'draft',
  category_ids: [],
  attributes: {},
};

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id && id !== 'new';
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(EMPTY);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [typeAttributes, setTypeAttributes] = useState<AttributeWithMeta[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Load product types and categories once
  useEffect(() => {
    Promise.all([productTypesApi.list(), categoriesApi.list()]).then(([types, cats]) => {
      setProductTypes(types.data);
      setCategories(cats.data);
    });
  }, []);

  // Load product data if editing
  useEffect(() => {
    if (!isEdit) return;
    productsApi.get(id!).then((res) => {
      const p = res.data;
      setForm({
        name: p.name,
        slug: p.slug,
        description: p.description || '',
        product_type_id: p.product_type_id,
        status: p.status,
        category_ids: (p.categories || []).map((c: Category) => c.id),
        attributes: p.attributes_json || {},
      });
      setMedia(p.media || []);
      setLoading(false);
    });
  }, [id, isEdit]);

  // Load type attributes when type changes
  useEffect(() => {
    if (!form.product_type_id) {
      setTypeAttributes([]);
      return;
    }
    productTypesApi.get(form.product_type_id).then((res) => {
      setTypeAttributes(res.data.attributes || []);
    });
  }, [form.product_type_id]);

  function set(field: keyof FormState, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleTypeChange(typeId: string) {
    set('product_type_id', typeId);
    set('attributes', {}); // reset attributes when type changes
  }

  function handleAttrChange(name: string, value: unknown) {
    setForm((prev) => ({
      ...prev,
      attributes: { ...prev.attributes, [name]: value },
    }));
  }

  function toggleCategory(catId: string) {
    setForm((prev) => ({
      ...prev,
      category_ids: prev.category_ids.includes(catId)
        ? prev.category_ids.filter((c) => c !== catId)
        : [...prev.category_ids, catId],
    }));
  }

  function autoSlug(name: string) {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // Remove undefined values from attributes
      const cleanAttrs: Record<string, unknown> = {};
      Object.entries(form.attributes).forEach(([k, v]) => {
        if (v !== undefined && v !== '') cleanAttrs[k] = v;
      });

      const payload = { ...form, attributes: cleanAttrs };

      if (isEdit) {
        await productsApi.update(id!, payload);
      } else {
        await productsApi.create(payload);
      }
      navigate('/products');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error guardando');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="loading">Cargando...</p>;

  return (
    <div>
      <div className="page-header">
        <h1>{isEdit ? 'Editar producto' : 'Nuevo producto'}</h1>
      </div>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="form">
        {/* Basic info */}
        <fieldset className="fieldset">
          <legend>Información básica</legend>

          <div className="form-group">
            <label>Nombre *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => {
                set('name', e.target.value);
                if (!isEdit) set('slug', autoSlug(e.target.value));
              }}
            />
          </div>

          <div className="form-group">
            <label>Slug *</label>
            <input
              type="text"
              required
              pattern="[a-z0-9-]+"
              value={form.slug}
              onChange={(e) => set('slug', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tipo de producto *</label>
              <select
                required
                value={form.product_type_id}
                onChange={(e) => handleTypeChange(e.target.value)}
              >
                <option value="">— Seleccionar tipo —</option>
                {productTypes.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Estado</label>
              <select
                value={form.status}
                onChange={(e) => set('status', e.target.value)}
              >
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
                <option value="archived">Archivado</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* Dynamic attributes */}
        {typeAttributes.length > 0 && (
          <DynamicAttributeFields
            attributes={typeAttributes}
            values={form.attributes}
            onChange={handleAttrChange}
          />
        )}

        {/* Categories */}
        <fieldset className="fieldset">
          <legend>Categorías</legend>
          <div className="checkbox-grid">
            {categories.map((c) => (
              <label key={c.id} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={form.category_ids.includes(c.id)}
                  onChange={() => toggleCategory(c.id)}
                />
                {c.name}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Media (only on edit) */}
        {isEdit && (
          <MediaManager
            productId={id!}
            media={media}
            onUpdate={() =>
              productsApi.get(id!).then((res) => setMedia(res.data.media || []))
            }
          />
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear producto'}
          </button>
          <button type="button" className="btn" onClick={() => navigate('/products')}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
