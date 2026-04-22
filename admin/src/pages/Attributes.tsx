import { useState, useEffect, useCallback } from 'react';
import { attributesApi } from '../services/api';
import { Attribute } from '../types';
import ConfirmDialog from '../components/ConfirmDialog';

export default function Attributes() {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
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
      setShowForm(false);
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

  const dataTypeLabels: Record<string, string> = {
    string: 'Texto',
    number: 'Número',
    boolean: 'Sí/No',
    date: 'Fecha',
  };

  return (
    <div>
      <div className="page-header">
        <h1>Atributos ({attributes.length})</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancelar' : '+ Nuevo atributo'}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: showForm ? '1fr 380px' : '1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Attributes Grid */}
        <div>
          {attributes.length === 0 ? (
            <div style={{
              background: '#fff',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '48px 24px',
              textAlign: 'center',
              color: 'var(--muted)',
            }}>
              <p style={{ fontSize: '14px', marginBottom: '12px' }}>Sin atributos aún.</p>
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>Crear primer atributo</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
              {attributes.map((a) => (
                <div
                  key={a.id}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '16px',
                    background: '#fff',
                    transition: 'all 0.15s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
                    (e.currentTarget as HTMLElement).style.transform = 'none';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600, color: '#1a202c' }}>
                        {a.label}
                      </h4>
                      <code style={{
                        fontSize: '11px',
                        background: '#f1f5f9',
                        border: '1px solid #e2e8f0',
                        borderRadius: '3px',
                        padding: '2px 6px',
                        color: '#64748b',
                      }}>
                        {a.name}
                      </code>
                    </div>
                    <button
                      onClick={() => setDeleteId(a.id)}
                      className="btn btn-sm btn-danger"
                      style={{ flexShrink: 0 }}
                    >
                      ✕
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <div style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      padding: '8px 10px',
                    }}>
                      <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '3px', textTransform: 'uppercase', fontWeight: 600 }}>
                        Tipo
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: '#1a202c' }}>
                        {dataTypeLabels[a.data_type]}
                      </div>
                    </div>
                    <div style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      padding: '8px 10px',
                    }}>
                      <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '3px', textTransform: 'uppercase', fontWeight: 600 }}>
                        Unidad
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: '#1a202c' }}>
                        {a.unit || '—'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {a.is_filterable && (
                      <span style={{
                        fontSize: '11px',
                        background: '#dbeafe',
                        color: '#1e40af',
                        padding: '3px 8px',
                        borderRadius: '3px',
                        fontWeight: 600,
                      }}>
                        🔍 Filtrable
                      </span>
                    )}
                    <span style={{
                      fontSize: '11px',
                      background: a.data_type === 'number' ? '#f0fdf4' : '#fef2f2',
                      color: a.data_type === 'number' ? '#166534' : '#7c2d12',
                      padding: '3px 8px',
                      borderRadius: '3px',
                    }}>
                      {a.data_type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Panel */}
        {showForm && (
          <div style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            position: 'sticky',
            top: '24px',
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #f97316 22, #f97316 08)',
              borderBottom: '2px solid #f97316',
              padding: '16px 20px',
            }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#c2410c' }}>
                Nuevo atributo
              </h3>
            </div>

            <form onSubmit={handleCreate} className="form" style={{ padding: '20px' }}>
              <div className="form-group">
                <label>Clave interna *</label>
                <input
                  type="text"
                  required
                  placeholder="voltage"
                  pattern="[a-z_]+"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={{ fontSize: '12px' }}
                />
                <small style={{ color: '#94a3b8', fontSize: '10px', marginTop: '3px', display: 'block' }}>
                  Solo letras minúsculas y _
                </small>
              </div>

              <div className="form-group">
                <label>Etiqueta *</label>
                <input
                  type="text"
                  required
                  placeholder="Voltaje nominal"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  style={{ fontSize: '12px' }}
                />
              </div>

              <div className="form-group">
                <label>Tipo de dato *</label>
                <select
                  value={form.data_type}
                  onChange={(e) => setForm({ ...form, data_type: e.target.value as Attribute['data_type'] })}
                  style={{ fontSize: '12px' }}
                >
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
                  placeholder="V, Ah, kg"
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  style={{ fontSize: '12px' }}
                />
              </div>

              <label className="checkbox-label" style={{ marginBottom: '16px', fontSize: '12px' }}>
                <input
                  type="checkbox"
                  checked={form.is_filterable}
                  onChange={(e) => setForm({ ...form, is_filterable: e.target.checked })}
                />
                Filtrable en la API
              </label>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                  style={{ width: '100%' }}
                >
                  {saving ? 'Guardando...' : 'Crear atributo'}
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowForm(false)}
                  style={{ width: '100%' }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
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
