import { useState, useEffect, useCallback } from 'react';
import { categoriesApi } from '../services/api';
import { Category, CategoryFeature } from '../types';
import ConfirmDialog from '../components/ConfirmDialog';
import CategoryTree from '../components/CategoryTree';
import { useAuth } from '../context/AuthContext';

export default function Categories() {
  const { isAuthenticated } = useAuth();
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
  const [activeTab, setActiveTab] = useState<'application' | 'characteristic' | 'video'>('application');
  const [videoForm, setVideoForm] = useState({ title: '', url: '' });

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
    setVideoForm({ title: '', url: '' });
  }

  function extractYouTubeId(url: string): string | null {
    let m = url.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
    m = url.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
    m = url.match(/[?&]v=([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
    return null;
  }

  function parseVideoLabel(label: string): { title: string; url: string } {
    try { return JSON.parse(label); } catch { return { title: '', url: label }; }
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

  async function handleCreateVideo(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !videoForm.url.trim()) return;
    setSaving(true);
    try {
      const label = JSON.stringify({ title: videoForm.title.trim(), url: videoForm.url.trim() });
      await categoriesApi.createFeature(selected.id, { type: 'video', label });
      setVideoForm({ title: '', url: '' });
      await loadFeatures(selected.id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error añadiendo video');
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
  const videos          = features.filter(f => f.type === 'video').sort((a, b) => a.order - b.order);
  const activeFeatures  = activeTab === 'application' ? applications : activeTab === 'characteristic' ? characteristics : [];

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
        {isAuthenticated && (
          <button className="btn btn-primary" onClick={() => setShowNewCatForm(v => !v)}>
            {showNewCatForm ? '✕ Cancelar' : '+ Nueva categoría'}
          </button>
        )}
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
                {isAuthenticated && (
                  <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(selected.id)}>
                    Eliminar
                  </button>
                )}
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
                <button
                  className={`detail-tab${activeTab === 'application' ? ' detail-tab--active' : ''}`}
                  onClick={() => { setActiveTab('application'); setFeatureLabel(''); }}
                >
                  Aplicaciones ({applications.length})
                </button>
                <button
                  className={`detail-tab${activeTab === 'characteristic' ? ' detail-tab--active' : ''}`}
                  onClick={() => { setActiveTab('characteristic'); setFeatureLabel(''); }}
                >
                  Características ({characteristics.length})
                </button>
                <button
                  className={`detail-tab${activeTab === 'video' ? ' detail-tab--active' : ''}`}
                  onClick={() => { setActiveTab('video'); setFeatureLabel(''); }}
                >
                  🎬 Videos ({videos.length})
                </button>
              </div>

              {/* Text feature list (application / characteristic) */}
              {activeTab !== 'video' && (
                <>
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
                            {isAuthenticated && (
                              <button
                                className="feature-delete"
                                onClick={() => setDeleteFeatureId(f.id)}
                                title="Eliminar"
                              >✕</button>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {isAuthenticated && (
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
                  )}
                </>
              )}

              {/* Video tab */}
              {activeTab === 'video' && (
                <>
                  {videos.length === 0 ? (
                    <p className="tree-empty">No hay videos todavía.</p>
                  ) : (
                    <div className="video-admin-grid">
                      {videos.map(f => {
                        const { title, url } = parseVideoLabel(f.label);
                        const vid = extractYouTubeId(url);
                        const thumb = vid
                          ? `https://img.youtube.com/vi/${vid}/mqdefault.jpg`
                          : null;
                        const isShort = url.includes('/shorts/');
                        return (
                          <div key={f.id} className="video-admin-card">
                            <div className="video-admin-thumb">
                              {thumb
                                ? <img src={thumb} alt={title} />
                                : <div className="video-admin-no-thumb">▶</div>
                              }
                              {isShort && <span className="video-admin-badge">Short</span>}
                            </div>
                            <div className="video-admin-info">
                              <div className="video-admin-title">{title || '(sin título)'}</div>
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="video-admin-url"
                              >{url}</a>
                            </div>
                            {isAuthenticated && (
                              <button
                                className="feature-delete"
                                onClick={() => setDeleteFeatureId(f.id)}
                                title="Eliminar"
                              >✕</button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {isAuthenticated && (
                    <form className="video-add-form" onSubmit={handleCreateVideo}>
                      <div className="video-add-fields">
                        <input
                          type="text"
                          placeholder="Título (ej. Kaise Solar GEL)"
                          value={videoForm.title}
                          onChange={e => setVideoForm(v => ({ ...v, title: e.target.value }))}
                        />
                        <input
                          type="url"
                          placeholder="URL de YouTube (youtu.be/... o youtube.com/shorts/...)"
                          value={videoForm.url}
                          onChange={e => setVideoForm(v => ({ ...v, url: e.target.value }))}
                          required
                        />
                      </div>
                      <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                        {saving ? '...' : '+ Añadir video'}
                      </button>
                    </form>
                  )}
                </>
              )}
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
