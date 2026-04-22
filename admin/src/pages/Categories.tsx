import { useState, useEffect, useCallback } from 'react';
import { categoriesApi } from '../services/api';
import { Category, CategoryFeature } from '../types';
import ConfirmDialog from '../components/ConfirmDialog';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<Category | null>(null);
  const [features, setFeatures] = useState<CategoryFeature[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteFeatureId, setDeleteFeatureId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', slug: '', parent_id: '' });
  const [featureForm, setFeatureForm] = useState({ type: 'application', label: '' });
  const [saving, setSaving] = useState(false);
  const [showNewCatForm, setShowNewCatForm] = useState(false);
  const [activeFeatureTab, setActiveFeatureTab] = useState<'application' | 'characteristic'>('application');

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
    return name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function selectCategory(cat: Category) {
    setSelected(cat);
    loadFeatures(cat.id);
    setActiveFeatureTab('application');
    setFeatureForm({ type: 'application', label: '' });
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
    if (!selected) return;
    setSaving(true);
    try {
      await categoriesApi.createFeature(selected.id, {
        type: activeFeatureTab,
        label: featureForm.label,
      });
      setFeatureForm({ type: activeFeatureTab, label: '' });
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

  const applications = features.filter((f) => f.type === 'application').sort((a, b) => a.order - b.order);
  const characteristics = features.filter((f) => f.type === 'characteristic').sort((a, b) => a.order - b.order);
  const activeFeatures = activeFeatureTab === 'application' ? applications : characteristics;

  const seriesColors: Record<string, { bg: string; border: string; text: string }> = {
    'kaise-litio':           { bg: '#eff6ff', border: '#3b82f6', text: '#1d4ed8' },
    'kaise-standard':        { bg: '#f0fdf4', border: '#22c55e', text: '#15803d' },
    'kaise-long-life':       { bg: '#faf5ff', border: '#a855f7', text: '#7e22ce' },
    'kaise-ultra-long-life': { bg: '#fefce8', border: '#eab308', text: '#854d0e' },
    'kaise-high-rate':       { bg: '#fff7ed', border: '#f97316', text: '#c2410c' },
    'kaise-solar-agm':       { bg: '#f0fdf4', border: '#10b981', text: '#065f46' },
    'kaise-deep-cycle':      { bg: '#fdf4ff', border: '#c084fc', text: '#6b21a8' },
    'kaise-front-terminal':  { bg: '#f0f9ff', border: '#0ea5e9', text: '#0c4a6e' },
    'kaise-high-temperature':{ bg: '#fef2f2', border: '#ef4444', text: '#991b1b' },
  };

  function getSeriesColor(slug: string) {
    return seriesColors[slug] || { bg: '#f8fafc', border: '#94a3b8', text: '#334155' };
  }

  return (
    <div>
      <div className="page-header">
        <h1>Categorías ({categories.length})</h1>
        <button className="btn btn-primary" onClick={() => setShowNewCatForm(!showNewCatForm)}>
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
                  onChange={(e) => setForm({ ...form, name: e.target.value, slug: autoSlug(e.target.value) })}
                  placeholder="Ej. KAISE HIGH RATE"
                />
              </div>
              <div className="form-group">
                <label>Slug *</label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="kaise-high-rate"
                />
              </div>
            </div>
            <div className="form-group" style={{ maxWidth: '320px' }}>
              <label>Categoría padre</label>
              <select value={form.parent_id} onChange={(e) => setForm({ ...form, parent_id: e.target.value })}>
                <option value="">— Sin padre —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
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

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Category list */}
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
            {categories.map((c) => {
              const parent = categories.find((p) => p.id === c.parent_id);
              const isSelected = selected?.id === c.id;
              const colors = getSeriesColor(c.slug);
              return (
                <div
                  key={c.id}
                  onClick={() => selectCategory(c)}
                  style={{
                    border: `2px solid ${isSelected ? colors.border : '#e2e8f0'}`,
                    borderLeft: `4px solid ${colors.border}`,
                    borderRadius: '8px',
                    padding: '14px 16px',
                    background: isSelected ? colors.bg : '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    boxShadow: isSelected ? `0 0 0 3px ${colors.border}33` : '0 1px 3px rgba(0,0,0,0.06)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) (e.currentTarget as HTMLElement).style.background = colors.bg;
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) (e.currentTarget as HTMLElement).style.background = '#fff';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '14px', color: colors.text, marginBottom: '4px' }}>
                        {c.name}
                      </div>
                      <code style={{
                        fontSize: '11px',
                        background: '#f1f5f9',
                        border: '1px solid #e2e8f0',
                        borderRadius: '4px',
                        padding: '1px 6px',
                        color: '#64748b',
                      }}>{c.slug}</code>
                      {parent && (
                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                          Subcategoría de: {parent.name}
                        </div>
                      )}
                    </div>
                    <button
                      className="btn btn-sm btn-danger"
                      style={{ marginLeft: '8px', flexShrink: 0 }}
                      onClick={(e) => { e.stopPropagation(); setDeleteId(c.id); }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature panel */}
        {selected && (
          <div style={{ position: 'sticky', top: '24px' }}>
            <div style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            }}>
              {/* Header */}
              <div style={{
                background: `linear-gradient(135deg, ${getSeriesColor(selected.slug).border}22, ${getSeriesColor(selected.slug).border}08)`,
                borderBottom: `3px solid ${getSeriesColor(selected.slug).border}`,
                padding: '16px 20px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: getSeriesColor(selected.slug).text }}>
                    {selected.name}
                  </h3>
                  <button
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '18px', lineHeight: 1 }}
                    onClick={() => setSelected(null)}
                    title="Cerrar"
                  >
                    ✕
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <span style={{
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '99px',
                    padding: '3px 10px',
                    fontSize: '12px',
                    color: '#475569',
                  }}>
                    {applications.length} aplicaciones
                  </span>
                  <span style={{
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '99px',
                    padding: '3px 10px',
                    fontSize: '12px',
                    color: '#475569',
                  }}>
                    {characteristics.length} características
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                {(['application', 'characteristic'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => { setActiveFeatureTab(tab); setFeatureForm({ type: tab, label: '' }); }}
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      background: activeFeatureTab === tab ? '#fff' : 'transparent',
                      border: 'none',
                      borderBottom: activeFeatureTab === tab ? `2px solid ${getSeriesColor(selected.slug).border}` : '2px solid transparent',
                      cursor: 'pointer',
                      fontWeight: activeFeatureTab === tab ? 600 : 400,
                      fontSize: '13px',
                      color: activeFeatureTab === tab ? getSeriesColor(selected.slug).text : '#94a3b8',
                      transition: 'all 0.15s',
                    }}
                  >
                    {tab === 'application' ? `Aplicaciones (${applications.length})` : `Características (${characteristics.length})`}
                  </button>
                ))}
              </div>

              {/* Feature list */}
              <div style={{ padding: '16px 20px', minHeight: '200px', maxHeight: '380px', overflowY: 'auto' }}>
                {activeFeatures.length === 0 ? (
                  <p style={{ color: '#94a3b8', textAlign: 'center', padding: '32px 0', fontSize: '13px' }}>
                    No hay {activeFeatureTab === 'application' ? 'aplicaciones' : 'características'} aún.
                  </p>
                ) : (
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {activeFeatures.map((f, i) => (
                      <li
                        key={f.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 12px',
                          background: '#f8fafc',
                          borderRadius: '6px',
                          border: '1px solid #f1f5f9',
                        }}
                      >
                        <span style={{
                          flexShrink: 0,
                          width: '22px',
                          height: '22px',
                          background: `${getSeriesColor(selected.slug).border}22`,
                          color: getSeriesColor(selected.slug).text,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: 700,
                        }}>{i + 1}</span>
                        <span style={{ flex: 1, fontSize: '13px', color: '#334155' }}>{f.label}</span>
                        <button
                          onClick={() => setDeleteFeatureId(f.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#cbd5e1',
                            fontSize: '14px',
                            padding: '2px 4px',
                            borderRadius: '4px',
                            transition: 'color 0.15s',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
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
              <div style={{ padding: '12px 20px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <form onSubmit={handleCreateFeature} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder={`Añadir ${activeFeatureTab === 'application' ? 'aplicación' : 'característica'}...`}
                    value={featureForm.label}
                    onChange={(e) => setFeatureForm({ ...featureForm, label: e.target.value })}
                    required
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                  <button type="submit" className="btn btn-primary btn-sm" disabled={saving} style={{ whiteSpace: 'nowrap' }}>
                    {saving ? '...' : '+ Añadir'}
                  </button>
                </form>
              </div>
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
