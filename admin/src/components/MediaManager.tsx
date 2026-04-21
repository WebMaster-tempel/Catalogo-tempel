import { useState } from 'react';
import { Media } from '../types';
import { uploadsApi, productsApi } from '../services/api';

interface Props {
  productId: string;
  media: Media[];
  onUpdate: () => void;
}

export default function MediaManager({ productId, media, onUpdate }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const uploaded = await uploadsApi.upload(file);
      await productsApi.addMedia(productId, {
        url: uploaded.data.url,
        type: uploaded.data.type,
        title: file.name,
        order: media.length,
      });
      onUpdate();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al subir');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function handleDelete(mediaId: string) {
    try {
      await productsApi.deleteMedia(productId, mediaId);
      onUpdate();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    }
  }

  return (
    <fieldset className="fieldset">
      <legend>Archivos multimedia</legend>
      {error && <p className="error">{error}</p>}
      <div className="media-grid">
        {media.map((m) => (
          <div key={m.id} className="media-item">
            {m.type === 'image' ? (
              <img src={m.url} alt={m.title || ''} />
            ) : (
              <div className="pdf-thumb">📄 PDF</div>
            )}
            <p className="media-title">{m.title || m.url.split('/').pop()}</p>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m.id)}>
              Eliminar
            </button>
          </div>
        ))}
      </div>
      <label className={`btn ${uploading ? 'btn-disabled' : ''}`} style={{ marginTop: 12 }}>
        {uploading ? 'Subiendo...' : '+ Añadir archivo'}
        <input
          type="file"
          accept="image/*,application/pdf"
          style={{ display: 'none' }}
          disabled={uploading}
          onChange={handleUpload}
        />
      </label>
    </fieldset>
  );
}
