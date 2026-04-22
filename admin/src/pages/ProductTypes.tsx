import { useState, useEffect, useCallback } from 'react';
import { productTypesApi, attributesApi } from '../services/api';
import { ProductType, Attribute } from '../types';
import ConfirmDialog from '../components/ConfirmDialog';

export default function ProductTypes() {
  const [types, setTypes] = useState<ProductType[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [selected, setSelected] = useState<ProductType | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [attrForm, setAttrForm] = useState({ attribute_id: '', is_required: false, order: 0 });
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    const res = await productTypesApi.list();
    setTypes(res.data);
  }, []);

  useEffect(() => {
    load();
    attributesApi.list().then((res) => setAttributes(res.data));
  }, [load]);

  async function handleSelectType(t: ProductType) {
    const res = await productTypesApi.get(t.id);
    setSelected(res.data);
  }

  async function handleCreateType(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await productTypesApi.create(form);
      setForm({ name: '', description: '' });
      setShowForm(false);
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error creando tipo');
    } finally {
      setSaving(false);
    }
  }

  async function handleAssignAttr(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    setError('');
    try {
      await productTypesApi.assignAttribute(selected.id, attrForm);
      const res = await productTypesApi.get(selected.id);
      setSelected(res.data);
      setAttrForm({ attribute_id: '', is_required: false, order: 0 });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error asignando atributo');
    } finally {
      setSaving(false);
    }
  }

  async function handleRemoveAttr(attrId: string) {
    if (!selected) return;
    await productTypesApi.removeAttribute(selected.id, attrId);
    const res = await productTypesApi.get(selected.id);
    setSelected(res.data);
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await productTypesApi.delete(deleteId);
      if (selected?.id === deleteId) setSelected(null);
      setDeleteId(null);
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error eliminando');
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Tipos de producto ({types.length})</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancelar' : '+ Nuevo tipo'}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* List */}
        <div>
          {showForm && (
            <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ marginBottom: '1rem' }}>Nuevo tipo de producto</h3>
              <form onSubmit={handleCreateType} className="form">
                <div className="form-group">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ej. BATERÍA"
                  />
                </div>
                <div className="form-group">
                  <label>Descripción</label>
                  <input
                    type="text"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Descripción breve del tipo"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Guardando...' : 'Crear tipo'}
                  </button>
                  <button type="button" className="btn" onClick={() => setShowForm(false)}>Cancelar</button>
                </div>
              </form>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '10px' }}>
            {types.map((t) => {
              const isSelected = selected?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => handleSelectType(t)}
                  style={{
                    border: `2px solid ${isSelected ? '#4f46e5' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    padding: '14px 16px',
                    background: isSelected ? '#eff6ff' : '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    boxShadow: isSelected ? '0 0 0 3px #4f46e533' : '0 1px 3px rgba(0,0,0,0.06)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) (e.currentTarget as HTMLElement).style.background = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) (e.currentTarget as HTMLElement).style.background = '#fff';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '14px', color: '#1a202c', marginBottom: '6px' }}>
                        {t.name}
                      </div>
                      {t.description && (
                        <p style={{ margin: 0, fontSize: '12px', color: '#718096' }}>
                          {t.description}
                        </p>
                      )}
                      <div style={{ marginTop: '8px', display: 'flex', gap: '4px' }}>
                        <span style={{
                          background: '#eef2ff',
                          color: '#4f46e5',
                          padding: '2px 8px',
                          borderRadius: '3px',
                          fontSize: '11px',
                          fontWeight: 600,
                        }}>
                          {(t.attributes || []).length} atributos
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteId(t.id); }}
                      className="btn btn-sm btn-danger"
                      style={{ marginLeft: '8px' }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Attributes panel */}
        {selected && (
          <div style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            position: 'sticky',
            top: '24px',
          }}>
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #4f46e522, #4f46e508)',
              borderBottom: '2px solid #4f46e5',
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#4f46e5' }}>
                {selected.name}
              </h3>
              <button
                onClick={() => setSelected(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  fontSize: '18px',
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>

            {/* Attributes list */}
            <div style={{ padding: '16px 20px', minHeight: '200px', maxHeight: '350px', overflowY: 'auto' }}>
              {(selected.attributes || []).length === 0 ? (
                <p style={{ color: '#94a3b8', textAlign: 'center', padding: '32px 0', fontSize: '13px' }}>
                  Sin atributos asignados
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(selected.attributes || []).map((a, i) => (
                    <div
                      key={a.id}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        padding: '10px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: '#1a202c' }}>
                          {i + 1}. {a.label}
                        </div>
                        <code style={{
                          fontSize: '10px',
                          background: '#fff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '2px',
                          padding: '1px 4px',
                          color: '#64748b',
                          marginTop: '3px',
                          display: 'inline-block',
                        }}>
                          {a.data_type}
                        </code>
                        {a.is_required && (
                          <span style={{
                            marginLeft: '6px',
                            fontSize: '10px',
                            background: '#fef2f2',
                            color: '#dc2626',
                            padding: '1px 6px',
                            borderRadius: '2px',
                            display: 'inline-block',
                          }}>
                            Requerido
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveAttr(a.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#cbd5e1',
                          fontSize: '14px',
                          padding: '2px 4px',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add form */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                Asignar atributo
              </h4>
              <form onSubmit={handleAssignAttr} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '11px' }}>Atributo *</label>
                  <select
                    required
                    value={attrForm.attribute_id}
                    onChange={(e) => setAttrForm({ ...attrForm, attribute_id: e.target.value })}
                    style={{ fontSize: '12px' }}
                  >
                    <option value="">— Seleccionar —</option>
                    {attributes.map((a) => (
                      <option key={a.id} value={a.id}>{a.label} ({a.data_type})</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '11px' }}>Orden</label>
                    <input
                      type="number"
                      value={attrForm.order}
                      onChange={(e) => setAttrForm({ ...attrForm, order: Number(e.target.value) })}
                      style={{ fontSize: '12px' }}
                    />
                  </div>
                  <div style={{ paddingTop: '20px' }}>
                    <label className="checkbox-label" style={{ margin: 0, fontSize: '12px' }}>
                      <input
                        type="checkbox"
                        checked={attrForm.is_required}
                        onChange={(e) => setAttrForm({ ...attrForm, is_required: e.target.checked })}
                      />
                      Requerido
                    </label>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-sm" disabled={saving} style={{ width: '100%' }}>
                  {saving ? '...' : '+ Asignar'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {deleteId && (
        <ConfirmDialog
          message="¿Eliminar este tipo de producto? Todos los productos de este tipo se mantendrán."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
