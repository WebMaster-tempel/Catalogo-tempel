import { useState, useEffect, useCallback } from 'react';
import { categoriesApi } from '../services/api';
import { Category, CategoryFeature } from '../types';
import ConfirmDialog from '../components/ConfirmDialog';
import CategoryTree from '../components/CategoryTree';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<Category | null>(null);
  const [features, setFeatures] = useState<CategoryFeature[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteFeatureId, setDeleteFeatureId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', slug: '', parent_id: '' });
  const [featureLabel, setFeatureLabel] = useState('');
  const [saving, setSaving] = useState(false);
  const [showNewCatForm, setShowNewCatForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'application' | 'characteristic'>('application');

  const load = useCallback(async () => {
    try {
      const res = await categoriesApi.list();
      setCategories(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error cargando categorías');
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function loadFeatures(categoryId: string) {
    try {
      const res = await categoriesApi.getFeatures(categoryId);
      setFeatures(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error cargando features');
    }
  }

  function autoSlug(name: string) {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function selectCategory(cat: Category) {
    setSelected(cat);
    loadFeatures(cat.id);
    setActiveTab('application');
    setFeatureLabel('');
  }

  async function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await categoriesApi.create({
        name: form.name,
        slug: form.slug,
        parent_id: form.parent_id || undefined,
      });
      setForm({ name: '', slug: '', parent_id: '' });
      setShowNewCatForm(false);
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error creando categoría');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteCategory() {
    if (!deleteId) return;
    try {
      await categoriesApi.delete(deleteId);
      setDeleteId(null);
      setSelected(null);
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error eliminando');
    }
  }

  async function handleCreateFeature(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !featureLabel.trim()) return;
    setSaving(true);
    try {
      await categoriesApi.createFeature(selected.id, { type: activeTab, label: featureLabel.trim() });
      setFeatureLabel('');
      await loadFeatures(selected.id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error creando feature');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteFeature() {
    if (!deleteFeatureId || !selected) return;
    try {
      await categoriesApi.deleteFeature(selected.id, deleteFeatureId);
      setDeleteFeatureId(null);
      await loadFeatures(selected.id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error eliminando feature');
    }
  }

  const applications    = features.filter(f => f.type === 'application').sort((a, b) => a.order - b.order);
  const characteristics = features.filter(f => f.type === 'characteristic').sort((a, b) => a.order - b.order);
  const compatibility   = features.filter(f => f.type === 'compatibility').sort((a, b) => a.order - b.order);
  const activeFeatures  = activeTab === 'application' ? applications : characteristics;

  function getBreadcrumb(category: Category): Category[] {
    const path: Category[] = [category];
    let current = category;
    while (current.parent_id) {
      const parent = categories.find(c => c.id === current.parent_id);
      if (!parent) break;
      path.unshift(parent);
      current = parent;
    }
    return path;
  }

  const breadcrumb = selected ? getBreadcrumb(selected) : [];
  const hasTechInfo = selected && (
    selected.technology ||
    selected.plate_type ||
    selected.eurobat === true ||
    selected.design_life_years ||
    selected.capacity_range ||
    selected.cycles
  );

  return (
    <div>
      <div className="page-header">
        <h1>Categorías ({categories.length})</h1>
        <button className="btn btn-primary" onClick={() => setShowNewCatForm(v => !v)}>
          {showNewCatForm ? '✕ Cancelar' : '+ Nueva categoría'}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {showNewCatForm && (
        <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Nueva categoría</h3>
          <form onSubmit={handleCreateCategory} className="form">
            <div className="form-row">
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value, slug: autoSlug(e.target.value) })}
                  placeholder="Ej. KAISE HIGH RATE"
                />
              </div>
              <div className="form-group">
                <label>Slug *</label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={e => setForm({ ...form, slug: e.target.value })}
                  placeholder="kaise-high-rate"
                />
              </div>
            </div>
            <div className="form-group" style={{ maxWidth: '360px' }}>
              <label>Categoría padre</label>
              <select value={form.parent_id} onChange={e => setForm({ ...form, parent_id: e.target.value })}>
                <option value="">— Sin padre (nodo raíz) —</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {'  '.repeat(c.level ?? 0)}{c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Guardando...' : 'Crear categoría'}
              </button>
              <button type="button" className="btn" onClick={() => setShowNewCatForm(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* ── Workspace ─────────────────────────────────── */}
      <div className="catalog-workspace">

        {/* Left: tree navigator */}
        <div className="catalog-tree-panel">
          <CategoryTree
            categories={categories}
            selected={selected}
            onSelect={selectCategory}
          />
        </div>

        {/* Right: detail panel */}
        {selected ? (
          <div className="catalog-detail-panel">

            {/* Breadcrumb */}
            <div className="detail-breadcrumb">
              {breadcrumb.map((cat, i) => (
                <span key={cat.id} style={{ display: 'inline-flex', alignItems: 'center' }}>
                  {i > 0 && <span className="breadcrumb-sep">›</span>}
                  <span
                    className={cat.id === selected.id ? 'breadcrumb-current' : 'breadcrumb-link'}
                    onClick={() => cat.id !== selected.id && selectCategory(cat)}
                  >
                    {cat.name}
                  </span>
                </span>
              ))}
            </div>

            {/* Header */}
            <div className="detail-header">
              <div style={{ minWidth: 0 }}>
                <h2 className="detail-title">{selected.name}</h2>
                <code className="detail-slug">{selected.slug}</code>
              </div>
              <div className="actions" style={{ flexShrink: 0 }}>
                <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(selected.id)}>
                  Eliminar
                </button>
                <button className="btn btn-sm" onClick={() => setSelected(null)} title="Cerrar">
                  ✕
                </button>
              </div>
            </div>

            {/* Technical info */}
            {hasTechInfo && (
              <div className="detail-section">
                <p className="detail-section-title">Especificaciones técnicas</p>
                <dl className="tech-dl">
                  {selected.technology && (
                    <><dt>Tecnología</dt><dd>{selected.technology}</dd></>
                  )}
                  {selected.plate_type && (
                    <><dt>Tipo de placa</dt><dd>{selected.plate_type}</dd></>
                  )}
                  {selected.eurobat === true && (
                    <><dt>Clasif. Eurobat</dt><dd><span className="badge-eurobat">✓ Certificada</span></dd></>
                  )}
                  {selected.design_life_years && (
                    <><dt>Vida de diseño</dt><dd>{selected.design_life_years}</dd></>
                  )}
                  {selected.capacity_range && (
                    <><dt>Capacidad</dt><dd>{selected.capacity_range}</dd></>
                  )}
                  {selected.cycles && (
                    <><dt>Nº de ciclos</dt><dd>{selected.cycles}</dd></>
                  )}
                </dl>
              </div>
            )}

            {/* Compatibility matrix */}
            {compatibility.length > 0 && (
              <div className="detail-section">
                <p className="detail-section-title">Compatibilidad de aplicaciones</p>
                <div className="compat-grid">
                  {compatibility.map(f => (
                    <div key={f.id} className={`compat-item compat-item--${f.suitability}`}>
                      <span className="compat-badge">
                        {f.suitability === 'best' ? 'XX' : '×'}
                      </span>
                      <span className="compat-label">{f.label}</span>
                    </div>
                  ))}
                </div>
                <p className="compat-legend">
                  <span className="compat-badge compat-badge--best">XX</span> Aplicación óptima
                  &nbsp;&nbsp;
                  <span className="compat-badge compat-badge--suitable">×</span> Compatible
                </p>
              </div>
            )}

            {/* Features */}
            <div className="detail-section detail-section--features">
              {/* Tabs */}
              <div className="detail-tabs">
                {(['application', 'characteristic'] as const).map(tab => (
                  <button
                    key={tab}
                    className={`detail-tab${activeTab === tab ? ' detail-tab--active' : ''}`}
                    onClick={() => { setActiveTab(tab); setFeatureLabel(''); }}
                  >
                    {tab === 'application'
                      ? `Aplicaciones (${applications.length})`
                      : `Características (${characteristics.length})`}
                  </button>
                ))}
              </div>

              {/* List */}
              <div className="detail-features">
                {activeFeatures.length === 0 ? (
                  <p className="tree-empty">
                    No hay {activeTab === 'application' ? 'aplicaciones' : 'características'} todavía.
                  </p>
                ) : (
                  <ul className="feature-list">
                    {activeFeatures.map((f, i) => (
                      <li key={f.id} className="feature-item">
                        <span className="feature-num">{i + 1}</span>
                        <span className="feature-label">{f.label}</span>
                        <button
                          className="feature-delete"
                          onClick={() => setDeleteFeatureId(f.id)}
                          title="Eliminar"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Add form */}
              <form className="feature-add-form" onSubmit={handleCreateFeature}>
                <input
                  type="text"
                  placeholder={`+ Añadir ${activeTab === 'application' ? 'aplicación' : 'característica'}...`}
                  value={featureLabel}
                  onChange={e => setFeatureLabel(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                  {saving ? '...' : 'Añadir'}
                </button>
              </form>
            </div>

          </div>
        ) : (
          <div className="detail-empty">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px', opacity: 0.3 }}>◆</div>
              <p>Selecciona una categoría del árbol</p>
              <p style={{ fontSize: '12px', marginTop: '4px', opacity: 0.7 }}>para ver sus detalles y features</p>
            </div>
          </div>
        )}
      </div>

      {deleteId && (
        <ConfirmDialog
          message="¿Eliminar esta categoría? Se perderán todos sus datos y características."
          onConfirm={handleDeleteCategory}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {deleteFeatureId && (
        <ConfirmDialog
          message="¿Eliminar este punto?"
          onConfirm={handleDeleteFeature}
          onCancel={() => setDeleteFeatureId(null)}
        />
      )}
    </div>
  );
}
