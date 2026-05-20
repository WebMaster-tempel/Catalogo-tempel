import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { productsApi, categoriesApi, productTypesApi } from '../services/api';
import { Product, Category, ProductType, PaginationMeta } from '../types';
import Pagination from '../components/Pagination';
import ConfirmDialog from '../components/ConfirmDialog';
import {
  computeAvailableOptions,
  TAG_LABELS,
  FEATURE_LABELS,
  TAG_SEARCH,
  FEATURE_SEARCH,
  ALL_TAGS,
  ALL_FEATURES,
  ALL_TECHNOLOGIES,
  ALL_PLATE_TYPES,
  ALL_VOLTAGES,
} from '../utils/filterCompat';

// ── Filter pill ───────────────────────────────────────────────────────────────

function Pill({
  label, active, disabled, onClick,
}: { label: React.ReactNode; active: boolean; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all',
        active
          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
          : disabled
          ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
          : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50',
      ].join(' ')}
    >
      {label}
    </button>
  );
}

function FilterRow({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap mt-1.5 w-[90px] flex-shrink-0">
        {icon} {title}
      </span>
      <div className="flex flex-wrap gap-1">{children}</div>
    </div>
  );
}

// ── component ─────────────────────────────────────────────────────────────────

export default function ProductList() {
  // Pagination / view
  const [products, setProducts]         = useState<Product[]>([]);
  const [viewMode, setViewMode]         = useState<'list' | 'grid'>('grid');
  const [perPage, setPerPage]           = useState(50);
  const [meta, setMeta]                 = useState<PaginationMeta>({ page: 1, per_page: 50, total: 0, total_pages: 0 });
  const [page, setPage]                 = useState(1);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [deleteId, setDeleteId]         = useState<string | null>(null);
  const [panelOpen, setPanelOpen]       = useState(true);

  // Reference data
  const [categories, setCategories]     = useState<Category[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);

  // ── Filters ──────────────────────────────────────────────────────────────────
  const [search, setSearch]         = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [typeId, setTypeId]         = useState('');
  const [status, setStatus]         = useState('');
  const [technology, setTechnology] = useState('');
  const [plateType, setPlateType]   = useState('');
  const [voltage, setVoltage]       = useState('');
  const [capMin, setCapMin]         = useState('');
  const [capMax, setCapMax]         = useState('');
  const [tag, setTag]               = useState('');
  const [feature, setFeature]       = useState('');
  const [eurobat, setEurobat]       = useState(false);

  // ── Compatibility engine ──────────────────────────────────────────────────────
  const available = useMemo(() => computeAvailableOptions({
    technology:   technology || undefined,
    plate_type:   plateType  || undefined,
    voltage:      voltage    ? Number(voltage) : undefined,
    capacity_min: capMin     ? Number(capMin)  : undefined,
    capacity_max: capMax     ? Number(capMax)  : undefined,
    tag:          tag        || undefined,
    feature:      feature    || undefined,
  }), [technology, plateType, voltage, capMin, capMax, tag, feature]);

  // ── Fetching ──────────────────────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params: Record<string, string> = {
        page: String(page), per_page: String(perPage), status: status || 'published',
      };
      if (search)     params.search          = search;
      if (categoryId) params.category_id     = categoryId;
      if (typeId)     params.product_type_id = typeId;
      if (technology) params.technology      = technology;
      if (plateType)  params.plate_type      = plateType;
      if (voltage)    params.voltage         = voltage;
      if (capMin)     params.capacity_min    = capMin;
      if (capMax)     params.capacity_max    = capMax;
      if (tag)        params.application     = TAG_SEARCH[tag]     ?? tag;
      if (feature)    params.characteristics = FEATURE_SEARCH[feature] ?? feature;
      if (eurobat)    params.eurobat         = 'true';

      const res = await productsApi.list(params);
      setProducts(res.data);
      setMeta(res.meta.pagination);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error cargando productos');
    } finally { setLoading(false); }
  }, [page, perPage, search, categoryId, typeId, status, technology, plateType, voltage, capMin, capMax, tag, feature, eurobat]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    Promise.all([categoriesApi.list(), productTypesApi.list()]).then(([cat, types]) => {
      setCategories(cat.data);
      setProductTypes(types.data);
    });
  }, []);

  function handleReset() {
    setSearch(''); setCategoryId(''); setTypeId(''); setStatus('');
    setTechnology(''); setPlateType(''); setVoltage('');
    setCapMin(''); setCapMax(''); setTag(''); setFeature(''); setEurobat(false);
    setPage(1);
  }

  async function handleDelete() {
    if (!deleteId) return;
    try { await productsApi.delete(deleteId); setDeleteId(null); fetchProducts(); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : 'Error al eliminar'); }
  }

  const activeCount = [search, categoryId, typeId, status !== '',
    technology, plateType, voltage, capMin, capMax, tag, feature, eurobat]
    .filter(Boolean).length;

  const isCompatOk = available.count > 0;

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* ── Page header ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900">Productos</h1>
          <p className="text-slate-500 text-[13px] mt-0.5">
            {meta.total} producto{meta.total !== 1 ? 's' : ''} encontrado{meta.total !== 1 ? 's' : ''}
          </p>
        </div>
        <Link to="/products/new" className="btn btn-primary">+ Nuevo producto</Link>
      </div>

      {/* ── Filter panel ── */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden mb-5 shadow-sm">

        {/* Panel top bar */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 bg-slate-50">
          {/* Compat indicator */}
          <div className={[
            'flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-bold border',
            isCompatOk
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-red-50 text-red-700 border-red-200',
          ].join(' ')}>
            <span className={`w-2 h-2 rounded-full ${isCompatOk ? 'bg-emerald-500' : 'bg-red-500'}`} />
            {isCompatOk
              ? `${available.count} gamma${available.count !== 1 ? 's' : ''} compatibles`
              : 'Sin resultados — combinación imposible'}
          </div>

          {activeCount > 0 && (
            <span className="bg-indigo-600 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {activeCount}
            </span>
          )}

          <div className="ml-auto flex items-center gap-2">
            {activeCount > 0 && (
              <button type="button" onClick={handleReset}
                className="text-[12px] text-slate-500 hover:text-red-600 font-medium flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors">
                ✕ Limpiar filtros
              </button>
            )}

            {/* Per page */}
            <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
              <span className="text-[11px] text-slate-400 font-semibold uppercase">Ver</span>
              <select
                value={perPage}
                onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}
                className="text-[12px] border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-700"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={250}>250</option>
                <option value={500}>500</option>
              </select>
            </div>

            {/* View toggle */}
            <div className="flex gap-1 border border-slate-200 rounded-lg p-0.5 bg-white">
              <button type="button"
                className={`px-2.5 py-1 rounded-md text-[13px] transition-colors ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-700'}`}
                onClick={() => setViewMode('list')}>☰</button>
              <button type="button"
                className={`px-2.5 py-1 rounded-md text-[13px] transition-colors ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-700'}`}
                onClick={() => setViewMode('grid')}>⊞</button>
            </div>

            <button
              type="button"
              onClick={() => setPanelOpen(o => !o)}
              className="text-[12px] text-slate-500 hover:text-slate-800 font-medium px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {panelOpen ? '▲ Colapsar' : '▼ Filtros'}
            </button>
          </div>
        </div>

        {/* Panel body */}
        {panelOpen && (
          <form onSubmit={e => { e.preventDefault(); setPage(1); fetchProducts(); }}>
            <div className="px-4 py-3 flex flex-col gap-3">

              {/* Row 1: Search + basic selects */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="🔍 Buscar nombre o SKU..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  className="flex-1 min-w-0 px-3 py-1.5 border border-slate-200 rounded-lg text-[12px] bg-slate-50 focus:bg-white focus:border-indigo-400 outline-none transition-colors"
                />
                <select
                  value={categoryId}
                  onChange={e => { setCategoryId(e.target.value); setPage(1); }}
                  className="px-2 py-1.5 border border-slate-200 rounded-lg text-[12px] bg-white focus:border-indigo-400 outline-none"
                >
                  <option value="">Categoría</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select
                  value={typeId}
                  onChange={e => { setTypeId(e.target.value); setPage(1); }}
                  className="px-2 py-1.5 border border-slate-200 rounded-lg text-[12px] bg-white focus:border-indigo-400 outline-none"
                >
                  <option value="">Tipo</option>
                  {productTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <select
                  value={status}
                  onChange={e => { setStatus(e.target.value); setPage(1); }}
                  className="px-2 py-1.5 border border-slate-200 rounded-lg text-[12px] bg-white focus:border-indigo-400 outline-none"
                >
                  <option value="">Publicados</option>
                  <option value="draft">Borradores</option>
                  <option value="archived">Archivados</option>
                </select>
                <button type="submit"
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[12px] font-semibold hover:bg-indigo-700 transition-colors whitespace-nowrap">
                  Buscar
                </button>
              </div>

              {/* Divider */}
              <div className="border-t border-dashed border-slate-100" />

              {/* Smart filter rows */}
              <FilterRow title="Tecnología" icon="🔋">
                {ALL_TECHNOLOGIES.map(t => (
                  <Pill key={t} label={t} active={technology === t} disabled={!available.technologies.has(t)}
                    onClick={() => { setTechnology(technology === t ? '' : t); setPlateType(''); setPage(1); }} />
                ))}
              </FilterRow>

              <FilterRow title="Placa" icon="🔩">
                {ALL_PLATE_TYPES.map(pt => (
                  <Pill key={pt} label={pt} active={plateType === pt} disabled={!available.platTypes.has(pt)}
                    onClick={() => { setPlateType(plateType === pt ? '' : pt); setPage(1); }} />
                ))}
              </FilterRow>

              <FilterRow title="Tensión" icon="⚡">
                {ALL_VOLTAGES.map(v => (
                  <Pill key={v}
                    label={<>{v} V{[12.8, 25.6, 51.2].includes(v) ? <span className="opacity-50 ml-0.5 text-[9px]">Li</span> : ''}</>}
                    active={voltage === String(v)} disabled={!available.voltages.has(v)}
                    onClick={() => { setVoltage(voltage === String(v) ? '' : String(v)); setPage(1); }} />
                ))}
              </FilterRow>

              <FilterRow title="Capacidad" icon="📊">
                {[
                  { min: '', max: '30', label: '< 30 Ah' },
                  { min: '30', max: '100', label: '30–100 Ah' },
                  { min: '100', max: '300', label: '100–300 Ah' },
                  { min: '300', max: '', label: '300+ Ah' },
                ].map(r => {
                  const active = capMin === r.min && capMax === r.max;
                  return (
                    <Pill key={r.label} label={r.label} active={active} disabled={false}
                      onClick={() => { if (active) { setCapMin(''); setCapMax(''); } else { setCapMin(r.min); setCapMax(r.max); } setPage(1); }} />
                  );
                })}
                <input type="number" placeholder="Min" min={0} value={capMin}
                  onChange={e => { setCapMin(e.target.value); setPage(1); }}
                  className="w-16 px-2 py-1 border border-slate-200 rounded-lg text-[11px] bg-white focus:border-indigo-400 outline-none ml-1" />
                <span className="text-slate-300 text-[11px] self-center">—</span>
                <input type="number" placeholder="Max" min={0} value={capMax}
                  onChange={e => { setCapMax(e.target.value); setPage(1); }}
                  className="w-16 px-2 py-1 border border-slate-200 rounded-lg text-[11px] bg-white focus:border-indigo-400 outline-none" />
              </FilterRow>

              <FilterRow title="Aplicación" icon="🎯">
                {ALL_TAGS.map(t => (
                  <Pill key={t} label={TAG_LABELS[t]} active={tag === t} disabled={!available.tags.has(t)}
                    onClick={() => { setTag(tag === t ? '' : t); setPage(1); }} />
                ))}
              </FilterRow>

              <FilterRow title="Características" icon="✨">
                {ALL_FEATURES.map(f => (
                  <Pill key={f} label={FEATURE_LABELS[f]} active={feature === f} disabled={!available.features.has(f)}
                    onClick={() => { setFeature(feature === f ? '' : f); setPage(1); }} />
                ))}
                <button type="button"
                  onClick={() => { setEurobat(!eurobat); setPage(1); }}
                  className={[
                    'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all',
                    eurobat ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50',
                  ].join(' ')}>
                  ✓ Eurobat
                </button>
              </FilterRow>

            </div>
          </form>
        )}
      </div>

      {error && <p className="error">{error}</p>}

      {/* ── Product display ── */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-slate-400 text-sm">Cargando productos...</span>
          </div>
        </div>
      ) : (
        <>
          {viewMode === 'list' ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Imagen</th><th>Nombre</th><th>Gamma</th><th>Estado</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr><td colSpan={5} className="empty">No hay productos con estos filtros</td></tr>
                ) : products.map(p => {
                  const img = p.media?.find(m => m.type === 'image');
                  return (
                    <tr key={p.id}>
                      <td>
                        {img ? <img src={img.url} alt={p.name} className="table-thumb" />
                             : <div className="no-image">—</div>}
                      </td>
                      <td>
                        <strong>{p.name}</strong>
                        {p.description && <p className="text-muted">{p.description.slice(0, 80)}</p>}
                      </td>
                      <td>
                        {(p.categories ?? []).length > 0
                          ? (p.categories ?? []).map(c => <span key={c.id} className="tag" style={{ marginRight: 4, fontSize: 11 }}>{c.name}</span>)
                          : <span style={{ color: '#999' }}>—</span>}
                      </td>
                      <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                      <td>
                        <div className="actions">
                          <Link to={`/products/${p.id}`} className="btn btn-sm">Ver</Link>
                          <Link to={`/products/${p.id}/edit`} className="btn btn-sm btn-secondary">Editar</Link>
                          <button className="btn btn-sm btn-danger" onClick={() => setDeleteId(p.id)}>Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            /* ── Grid view ── */
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', marginBottom: '1.5rem' }}>
              {products.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-slate-200 p-12 flex flex-col items-center justify-center text-slate-400 col-span-full">
                  <span className="text-4xl mb-3">🔍</span>
                  <p className="text-[14px] font-medium">Sin resultados</p>
                  <p className="text-[12px] mt-1">Ajusta los filtros para ver productos</p>
                </div>
              ) : products.map(p => {
                const img = p.media?.find(m => m.type === 'image');
                return (
                  <div key={p.id} className="group rounded-2xl border border-slate-200 bg-white overflow-hidden hover:border-indigo-300 hover:shadow-lg transition-all duration-200">
                    {/* Image area */}
                    <div className="relative h-36 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
                      {img ? (
                        <img src={img.url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">⚡</div>
                      )}
                      {/* Status badge overlay */}
                      <div className="absolute top-2 right-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.status === 'published' ? 'bg-emerald-500 text-white' :
                          p.status === 'draft'     ? 'bg-amber-400 text-amber-900' :
                                                     'bg-slate-400 text-white'
                        }`}>
                          {p.status === 'published' ? 'Pub' : p.status === 'draft' ? 'Draft' : 'Arc'}
                        </span>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-3.5">
                      <h4 className="font-bold text-[13px] text-slate-800 leading-snug mb-1 line-clamp-2">
                        <Link to={`/products/${p.id}`} className="hover:text-indigo-600 no-underline transition-colors">
                          {p.name}
                        </Link>
                      </h4>

                      {/* Category chips */}
                      {(p.categories ?? []).length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2.5">
                          {(p.categories ?? []).slice(0, 2).map(c => (
                            <span key={c.id} className="text-[10px] bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded-full font-medium">
                              {c.name}
                            </span>
                          ))}
                          {(p.categories ?? []).length > 2 && (
                            <span className="text-[10px] text-slate-400">+{(p.categories ?? []).length - 2}</span>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-1.5 mt-2">
                        <Link to={`/products/${p.id}`}
                          className="flex-1 text-center text-[12px] font-semibold py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 no-underline transition-colors">
                          Ver
                        </Link>
                        <Link to={`/products/${p.id}/edit`}
                          className="flex-1 text-center text-[12px] font-semibold py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 no-underline transition-colors">
                          Editar
                        </Link>
                        <button onClick={() => setDeleteId(p.id)}
                          className="px-2.5 py-1.5 rounded-lg border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors text-[12px]">
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <Pagination meta={meta} onChange={setPage} />
        </>
      )}

      {deleteId && (
        <ConfirmDialog
          message="¿Eliminar este producto? Esta acción no se puede deshacer."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
