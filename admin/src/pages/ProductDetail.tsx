import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productsApi, productTypesApi } from '../services/api';
import { Product, ProductType, Category } from '../types';
import ConfirmDialog from '../components/ConfirmDialog';

// ── helpers ───────────────────────────────────────────────────────────────────

function parseLines(text?: string): string[] {
  if (!text) return [];
  return text.split(/[\n,]/).map(s => s.replace(/^[-•»]\s*/, '').trim()).filter(Boolean);
}

function StatusPill({ status }: { status: string }) {
  const map = {
    published: { label: 'Publicado', cls: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    draft:     { label: 'Borrador',  cls: 'bg-amber-100 text-amber-800 border-amber-200' },
    archived:  { label: 'Archivado', cls: 'bg-slate-100 text-slate-600 border-slate-200' },
  } as const;
  const s = map[status as keyof typeof map] ?? map.archived;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-0.5 text-[12px] font-semibold ${s.cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {s.label}
    </span>
  );
}

function GammaBlock({ cat }: { cat: Category }) {
  const apps    = cat.features?.filter(f => f.type === 'application')    ?? [];
  const chars   = cat.features?.filter(f => f.type === 'characteristic') ?? [];
  const appList  = apps.length  > 0 ? apps.map(f => f.label)  : parseLines(cat.applications);
  const charList = chars.length > 0 ? chars.map(f => f.label) : parseLines(cat.characteristics);

  return (
    <div className="rounded-2xl border border-indigo-100 overflow-hidden">
      {/* Gamma header */}
      <div className="bg-gradient-to-r from-indigo-700 to-violet-700 px-6 py-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-white font-black text-[18px]">{cat.name}</span>
          {cat.eurobat && (
            <span className="bg-white/20 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-white/30">
              ✓ Eurobat
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {cat.technology && (
            <span className="bg-white/15 text-white/90 text-[12px] px-3 py-0.5 rounded-full border border-white/20 font-medium">
              {cat.technology}
            </span>
          )}
          {cat.plate_type && (
            <span className="bg-white/15 text-white/90 text-[12px] px-3 py-0.5 rounded-full border border-white/20 font-medium">
              {cat.plate_type}
            </span>
          )}
        </div>
      </div>

      {/* Gamma body */}
      <div className="bg-white">
        {/* Stats bar */}
        {(cat.cycles || cat.design_life_years || cat.capacity_range) && (
          <div className="flex divide-x divide-slate-100 border-b border-slate-100">
            {cat.cycles && (
              <div className="flex-1 text-center py-4">
                <div className="text-[26px] font-black text-indigo-600 leading-none">{cat.cycles}</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">Ciclos</div>
              </div>
            )}
            {cat.design_life_years && (
              <div className="flex-1 text-center py-4">
                <div className="text-[26px] font-black text-violet-600 leading-none">{cat.design_life_years}</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">Vida diseño</div>
              </div>
            )}
            {cat.capacity_range && (
              <div className="flex-1 text-center py-4">
                <div className="text-[26px] font-black text-blue-600 leading-none">{cat.capacity_range}</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">Capacidad</div>
              </div>
            )}
          </div>
        )}

        {/* Applications */}
        {appList.length > 0 && (
          <div className="px-6 py-4 border-b border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">🎯 Aplicaciones</p>
            <div className="flex flex-wrap gap-2">
              {appList.map((a, i) => (
                <span key={i} className="bg-blue-50 text-blue-700 border border-blue-200 rounded-lg px-3 py-1 text-[12px] font-medium">
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Characteristics */}
        {charList.length > 0 && (
          <div className="px-6 py-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">✨ Características técnicas</p>
            <div className="flex flex-wrap gap-2">
              {charList.map((c, i) => (
                <span key={i} className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg px-3 py-1 text-[12px] font-medium">
                  ✓ {c}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────

export default function ProductDetail() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct]         = useState<Product | null>(null);
  const [productType, setProductType] = useState<ProductType | null>(null);
  const [loading, setLoading]         = useState(true);
  const [showDelete, setShowDelete]   = useState(false);
  const [imgZoom, setImgZoom]         = useState(false);

  useEffect(() => {
    productsApi.get(id!).then(res => {
      setProduct(res.data);
      return productTypesApi.get(res.data.product_type_id);
    }).then(res => {
      setProductType(res.data);
      setLoading(false);
    });
  }, [id]);

  async function handleDelete() {
    await productsApi.delete(id!);
    navigate('/products');
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!product) return <p className="error">Producto no encontrado</p>;

  const mainImage   = product.media?.find(m => m.type === 'image');
  const extraImages = product.media?.filter(m => m.type === 'image' && m !== mainImage) ?? [];
  const pdfs        = product.media?.filter(m => m.type !== 'image') ?? [];
  const attrItems   = (productType?.attributes ?? [])
    .filter(a => product.attributes_json?.[a.name] !== undefined)
    .map(a => ({ label: a.label, value: String(product.attributes_json![a.name]), unit: a.unit }));

  return (
    <div className="pb-16">
      {/* ── Hero ── */}
      <div
        className="relative rounded-2xl overflow-hidden mb-8"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="relative flex items-center gap-6 px-8 py-7">
          {mainImage ? (
            <div
              className="w-[100px] h-[100px] rounded-xl overflow-hidden border-2 border-white/20 flex-shrink-0 cursor-zoom-in shadow-xl"
              onClick={() => setImgZoom(true)}
            >
              <img src={mainImage.url} alt={product.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-[100px] h-[100px] rounded-xl bg-white/10 border-2 border-white/20 flex-shrink-0 flex items-center justify-center text-4xl">⚡</div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <StatusPill status={product.status} />
              <code className="text-white/50 text-[11px] font-mono">{product.slug}</code>
            </div>
            <h1 className="text-white text-[28px] font-black leading-tight">{product.name}</h1>
            {product.description && (
              <p className="text-white/65 text-[13px] mt-1.5 leading-relaxed max-w-2xl">{product.description}</p>
            )}
          </div>
          <div className="flex flex-col gap-2 flex-shrink-0">
            <Link
              to={`/products/${id}/edit`}
              className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold text-[13px] px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors no-underline"
            >
              ✏️ Editar
            </Link>
            <button
              onClick={() => setShowDelete(true)}
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 hover:bg-red-500 hover:text-white font-semibold text-[13px] px-4 py-2 rounded-lg transition-colors"
            >
              🗑️ Eliminar
            </button>
          </div>
        </div>
      </div>

      {/* ── Single column, centered ── */}
      <div style={{ maxWidth: 780, margin: '0 auto' }} className="flex flex-col gap-6">

        {/* Main image */}
        {mainImage && (
          <div
            className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm cursor-zoom-in group"
            onClick={() => setImgZoom(true)}
          >
            <div className="relative">
              <img
                src={mainImage.url}
                alt={product.name}
                className="w-full object-cover"
                style={{ maxHeight: 420 }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white rounded-full px-4 py-1.5 text-[13px]">
                  🔍 Ampliar
                </span>
              </div>
            </div>
            {extraImages.length > 0 && (
              <div className="grid grid-cols-4 gap-0 border-t border-slate-200">
                {extraImages.slice(0, 4).map(m => (
                  <div key={m.id} className="aspect-square overflow-hidden border-r border-slate-200 last:border-r-0">
                    <img src={m.url} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Ficha técnica */}
        <div className="rounded-2xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-800 px-6 py-3.5">
            <h2 className="text-white text-[12px] font-bold uppercase tracking-widest">⚙️ Ficha técnica</h2>
          </div>
          <div className="p-6 bg-white">
            <div className="grid grid-cols-2 gap-x-10 gap-y-0 sm:grid-cols-3">
              <div className="flex flex-col py-3 border-b border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tipo de producto</span>
                <span className="text-[14px] font-semibold text-slate-800 mt-0.5">{productType?.name || '—'}</span>
              </div>
              <div className="flex flex-col py-3 border-b border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Estado</span>
                <span className="text-[14px] font-semibold text-slate-800 mt-0.5">
                  {product.status === 'published' ? 'Publicado' : product.status === 'draft' ? 'Borrador' : 'Archivado'}
                </span>
              </div>
              {attrItems.map(({ label, value, unit }) => (
                <div key={label} className="flex flex-col py-3 border-b border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
                  <span className="text-[14px] font-semibold text-slate-800 mt-0.5">
                    {value}{unit && <span className="text-[12px] font-normal text-slate-400 ml-1">{unit}</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gamma section — full content */}
        {product.categories && product.categories.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[13px]">🏷️</span>
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Gamma</h2>
            </div>
            <div className="flex flex-col gap-4">
              {product.categories.map(c => <GammaBlock key={c.id} cat={c} />)}
            </div>
          </div>
        )}

        {/* Documents */}
        {pdfs.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[13px]">📎</span>
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Documentos adjuntos</h2>
            </div>
            <div className="flex flex-col gap-2">
              {pdfs.map(m => (
                <a
                  key={m.id} href={m.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-200 transition-colors no-underline group"
                >
                  <span className="text-2xl">📄</span>
                  <span className="text-[13px] font-medium text-slate-700 group-hover:text-indigo-700 flex-1">{m.title || 'Documento'}</span>
                  <span className="text-slate-400 group-hover:text-indigo-500 text-[13px]">↗</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Danger zone */}
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-3">Zona peligrosa</p>
          <button
            onClick={() => setShowDelete(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-red-300 bg-white text-red-600 text-[13px] font-semibold px-5 py-2.5 hover:bg-red-600 hover:text-white transition-colors"
          >
            🗑️ Eliminar producto permanentemente
          </button>
        </div>

      </div>

      {/* Lightbox */}
      {imgZoom && mainImage && (
        <div
          className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-8 cursor-zoom-out"
          onClick={() => setImgZoom(false)}
        >
          <img
            src={mainImage.url}
            alt={product.name}
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            style={{ maxHeight: '90vh' }}
          />
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white text-3xl leading-none"
            onClick={() => setImgZoom(false)}
          >✕</button>
        </div>
      )}

      {showDelete && (
        <ConfirmDialog
          message={`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </div>
  );
}
