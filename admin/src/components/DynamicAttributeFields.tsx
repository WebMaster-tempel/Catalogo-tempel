import { AttributeWithMeta } from '../types';

interface Props {
  attributes: AttributeWithMeta[];
  values: Record<string, unknown>;
  onChange: (name: string, value: unknown) => void;
}

export default function DynamicAttributeFields({ attributes, values, onChange }: Props) {
  if (attributes.length === 0) return null;

  return (
    <fieldset className="fieldset">
      <legend>Atributos técnicos</legend>
      {attributes.map((attr) => (
        <div className="form-group" key={attr.id}>
          <label>
            {attr.label}
            {attr.unit && <span className="unit"> ({attr.unit})</span>}
            {attr.is_required && <span className="required"> *</span>}
          </label>
          {attr.data_type === 'boolean' ? (
            <select
              value={values[attr.name] === true ? 'true' : values[attr.name] === false ? 'false' : ''}
              onChange={(e) => {
                const v = e.target.value === 'true' ? true : e.target.value === 'false' ? false : undefined;
                onChange(attr.name, v);
              }}
            >
              <option value="">— Seleccionar —</option>
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          ) : attr.data_type === 'number' ? (
            <input
              type="number"
              step="any"
              value={values[attr.name] !== undefined ? String(values[attr.name]) : ''}
              required={attr.is_required}
              onChange={(e) => onChange(attr.name, e.target.value === '' ? undefined : Number(e.target.value))}
            />
          ) : attr.data_type === 'date' ? (
            <input
              type="date"
              value={values[attr.name] !== undefined ? String(values[attr.name]) : ''}
              required={attr.is_required}
              onChange={(e) => onChange(attr.name, e.target.value || undefined)}
            />
          ) : (
            <input
              type="text"
              value={values[attr.name] !== undefined ? String(values[attr.name]) : ''}
              required={attr.is_required}
              onChange={(e) => onChange(attr.name, e.target.value || undefined)}
            />
          )}
        </div>
      ))}
    </fieldset>
  );
}
