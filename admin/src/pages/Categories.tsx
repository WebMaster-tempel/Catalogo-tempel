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
        type: featureForm.type,
        label: featureForm.label,
      });
      setFeatureForm({ type: 'application', label: '' });
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

  return (
    <div>
      <div className="page-header"><h1>Categorías</h1></div>
      {error && <p className="error">{error}</p>}

      <div className="two-col">
        <div>
          <table className="table">
            <thead>
              <tr><th>Nombre</th><th>Slug</th><th>Padre</th><th></th></tr>
            </thead>
            <tbody>
              {categories.map((c) => {
                const parent = categories.find((p) => p.id === c.parent_id);
                const isSelected = selected?.id === c.id;
                return (
                  <tr key={c.id} style={{ backgroundColor: isSelected ? '#f0f7ff' : 'transparent' }}>
                    <td onClick={() => selectCategory(c)} style={{ cursor: 'pointer' }}>{c.name}</td>
                    <td><code>{c.slug}</code></td>
                    <td>{parent?.name || '—'}</td>
                    <td>
                      <button className="btn btn-sm btn-danger" onClick={() => setDeleteId(c.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div>
          <div className="card">
            <h3>Nueva categoría</h3>
            <form onSubmit={handleCreateCategory} className="form">
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value, slug: autoSlug(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label>Slug *</label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Categoría padre</label>
                <select value={form.parent_id} onChange={(e) => setForm({ ...form, parent_id: e.target.value })}>
                  <option value="">— Sin padre —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Guardando...' : 'Crear'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {selected && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <h3>{selected.name} - Features</h3>

          {/* Aplicaciones */}
          <div style={{ marginBottom: '2rem' }}>
            <h4>Aplicaciones ({applications.length})</h4>
            {applications.length > 0 && (
              <ul style={{ marginBottom: '1rem' }}>
                {applications.map((f) => (
                  <li key={f.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>{f.label}</span>
                    <button className="btn btn-sm btn-danger" onClick={() => setDeleteFeatureId(f.id)}>
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {featureForm.type === 'application' && (
              <form onSubmit={handleCreateFeature} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Nueva aplicación..."
                  value={featureForm.label}
                  onChange={(e) => setFeatureForm({ ...featureForm, label: e.target.value })}
                  required
                />
                <button type="submit" className="btn btn-sm btn-primary" disabled={saving}>
                  Añadir
                </button>
              </form>
            )}
            {featureForm.type !== 'application' && (
              <button className="btn btn-sm btn-secondary" onClick={() => setFeatureForm({ type: 'application', label: '' })}>
                + Añadir aplicación
              </button>
            )}
          </div>

          {/* Características */}
          <div>
            <h4>Características ({characteristics.length})</h4>
            {characteristics.length > 0 && (
              <ul style={{ marginBottom: '1rem' }}>
                {characteristics.map((f) => (
                  <li key={f.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>{f.label}</span>
                    <button className="btn btn-sm btn-danger" onClick={() => setDeleteFeatureId(f.id)}>
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {featureForm.type === 'characteristic' && (
              <form onSubmit={handleCreateFeature} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Nueva característica..."
                  value={featureForm.label}
                  onChange={(e) => setFeatureForm({ ...featureForm, label: e.target.value })}
                  required
                />
                <button type="submit" className="btn btn-sm btn-primary" disabled={saving}>
                  Añadir
                </button>
              </form>
            )}
            {featureForm.type !== 'characteristic' && (
              <button className="btn btn-sm btn-secondary" onClick={() => setFeatureForm({ type: 'characteristic', label: '' })}>
                + Añadir característica
              </button>
            )}
          </div>
        </div>
      )}

      {deleteId && (
        <ConfirmDialog
          message="¿Eliminar esta categoría?"
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
