import { useState, useEffect, useCallback } from 'react';
import { categoriesApi } from '../services/api';
import { Category } from '../types';
import ConfirmDialog from '../components/ConfirmDialog';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', slug: '', parent_id: '' });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await categoriesApi.list();
    setCategories(res.data);
  }, []);

  useEffect(() => { load(); }, [load]);

  function autoSlug(name: string) {
    return name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  async function handleCreate(e: React.FormEvent) {
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

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await categoriesApi.delete(deleteId);
      setDeleteId(null);
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error eliminando');
    }
  }

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
                return (
                  <tr key={c.id}>
                    <td>{c.name}</td>
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
            <form onSubmit={handleCreate} className="form">
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

      {deleteId && (
        <ConfirmDialog
          message="¿Eliminar esta categoría?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
