import { useState, useEffect, useCallback } from 'react';
import { attributesApi } from '../services/api';
import { Attribute } from '../types';
import ConfirmDialog from '../components/ConfirmDialog';

export default function Attributes() {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    label: '',
    data_type: 'string' as Attribute['data_type'],
    unit: '',
    is_filterable: false,
  });

  const load = useCallback(async () => {
    const res = await attributesApi.list();
    setAttributes(res.data);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await attributesApi.create({ ...form, unit: form.unit || undefined });
      setForm({ name: '', label: '', data_type: 'string', unit: '', is_filterable: false });
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error creando atributo');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await attributesApi.delete(deleteId);
      setDeleteId(null);
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error eliminando');
    }
  }

  return (
    <div>
      <div className="page-header"><h1>Atributos</h1></div>
      {error && <p className="error">{error}</p>}

      <div className="two-col">
        <div>
          <table className="table">
            <thead>
              <tr><th>Clave</th><th>Etiqueta</th><th>Tipo</th><th>Unidad</th><th>Filtrable</th><th></th></tr>
            </thead>
            <tbody>
              {attributes.map((a) => (
                <tr key={a.id}>
                  <td><code>{a.name}</code></td>
                  <td>{a.label}</td>
                  <td>{a.data_type}</td>
                  <td>{a.unit || '—'}</td>
                  <td>{a.is_filterable ? '✓' : '—'}</td>
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={() => setDeleteId(a.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3>Nuevo atributo</h3>
          <form onSubmit={handleCreate} className="form">
            <div className="form-group">
              <label>Clave interna * <small>(solo letras y _)</small></label>
              <input
                type="text"
                required
                placeholder="ej: voltage"
                pattern="[a-z_]+"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Etiqueta *</label>
              <input
                type="text"
                required
                placeholder="ej: Voltaje"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Tipo de dato *</label>
                <select value={form.data_type} onChange={(e) => setForm({ ...form, data_type: e.target.value as Attribute['data_type'] })}>
                  <option value="string">Texto</option>
                  <option value="number">Número</option>
                  <option value="boolean">Sí/No</option>
                  <option value="date">Fecha</option>
                </select>
              </div>
              <div className="form-group">
                <label>Unidad</label>
                <input
                  type="text"
                  placeholder="ej: V, Ah, kg"
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                />
              </div>
            </div>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.is_filterable}
                onChange={(e) => setForm({ ...form, is_filterable: e.target.checked })}
              />
              Filtrable en la API
            </label>
            <button type="submit" className="btn btn-primary" style={{ marginTop: 12 }} disabled={saving}>
              {saving ? 'Guardando...' : 'Crear atributo'}
            </button>
          </form>
        </div>
      </div>

      {deleteId && (
        <ConfirmDialog
          message="¿Eliminar este atributo? Se eliminará de todos los tipos que lo usen."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
