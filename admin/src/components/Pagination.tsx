import { PaginationMeta } from '../types';

interface Props {
  meta: PaginationMeta;
  onChange: (page: number) => void;
}

export default function Pagination({ meta, onChange }: Props) {
  if (meta.total_pages <= 1) return null;

  return (
    <div className="pagination">
      <button disabled={meta.page === 1} onClick={() => onChange(meta.page - 1)}>
        ← Anterior
      </button>
      <span>
        Página {meta.page} de {meta.total_pages} &nbsp;·&nbsp; {meta.total} resultados
      </span>
      <button disabled={meta.page === meta.total_pages} onClick={() => onChange(meta.page + 1)}>
        Siguiente →
      </button>
    </div>
  );
}
