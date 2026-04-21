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
  const [form, setForm] = useState({ name: '', description: '' });
  const [attrForm, setAttrForm] = useState({ attribute_id: '', is_required: false, order: 0 });

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
    setError('');
    try {
      await productTypesApi.create(form);
      setForm({ name: '', description: '' });
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error creando tipo');
    }
  }

  async function handleAssignAttr(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setError('');
    try {
      await productTypesApi.assignAttribute(selected.id, attrForm);
      const res = await productTypesApi.get(selected.id);
      setSelected(res.data);
      setAttrForm({ attribute_id: '', is_required: false, order: 0 });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error asignando atributo');
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
      <div className="page-header"><h1>Tipos de producto</h1></div>
      {error && <p className="error">{error}</p>}

      <div className="two-col">
        <div>
          <table className="table">
            <thead><tr><th>Nombre</th><th>Atributos</th><th></th></tr></thead>
            <tbody>
              {types.map((t) => (
                <tr key={t.id} className={selected?.id === t.id ? 'row-selected' : ''}>
                  <td>
                    <button className="btn-link" onClick={() => handleSelectType(t)}>{t.name}</button>
                  </td>
                  <td>—</td>
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={() => setDeleteId(t.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="card" style={{ marginTop: 16 }}>
            <h3>Nuevo tipo</h3>
            <form onSubmit={handleCreateType} className="form">
              <div className="form-group">
                <label>Nombre *</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-primary">Crear</button>
            </form>
          </div>
        </div>

        {selected && (
          <div className="card">
            <h3>Atributos de: {selected.name}</h3>
            <table className="table">
              <thead><tr><th>Atributo</th><th>Tipo</th><th>Requerido</th><th></th></tr></thead>
              <tbody>
                {(selected.attributes || []).map((a) => (
                  <tr key={a.id}>
                    <td>{a.label}</td>
                    <td><code>{a.data_type}</code></td>
                    <td>{a.is_required ? '✓' : '—'}</td>
                    <td>
                      <button className="btn btn-sm btn-danger" onClick={() => handleRemoveAttr(a.id)}>
                        Quitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <form onSubmit={handleAssignAttr} className="form" style={{ marginTop: 12 }}>
              <div className="form-row">
                <div className="form-group">
                  <label>Atributo</label>
                  <select required value={attrForm.attribute_id} onChange={(e) => setAttrForm({ ...attrForm, attribute_id: e.target.value })}>
                    <option value="">— Seleccionar —</option>
                    {attributes.map((a) => (
                      <option key={a.id} value={a.id}>{a.label} ({a.data_type})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Orden</label>
                  <input type="number" value={attrForm.order} onChange={(e) => setAttrForm({ ...attrForm, order: Number(e.target.value) })} />
                </div>
              </div>
              <label className="checkbox-label">
                <input type="checkbox" checked={attrForm.is_required} onChange={(e) => setAttrForm({ ...attrForm, is_required: e.target.checked })} />
                Requerido
              </label>
              <button type="submit" className="btn btn-primary" style={{ marginTop: 8 }}>Asignar</button>
            </form>
          </div>
        )}
      </div>

      {deleteId && (
        <ConfirmDialog
          message="¿Eliminar este tipo de producto?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
