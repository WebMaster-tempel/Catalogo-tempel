import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthRequiredModal() {
  const { showAuthModal, dismissAuthModal } = useAuth();
  const navigate = useNavigate();

  if (!showAuthModal) return null;

  const go = (mode: 'login' | 'register') => {
    dismissAuthModal();
    navigate(`/login?mode=${mode}`);
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={dismissAuthModal}
    >
      <div
        style={{
          background: '#fff', borderRadius: '12px', padding: '32px',
          maxWidth: '360px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔒</div>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>
            Acción restringida
          </h2>
          <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#64748b' }}>
            Necesitas iniciar sesión para realizar esta acción.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => go('login')}
            style={{
              background: '#2563eb', color: '#fff', border: 'none',
              borderRadius: '8px', padding: '10px 16px',
              fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => go('register')}
            style={{
              background: '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0',
              borderRadius: '8px', padding: '10px 16px',
              fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            Registrarse
          </button>
          <button
            onClick={dismissAuthModal}
            style={{
              background: 'none', border: 'none', color: '#94a3b8',
              fontSize: '13px', cursor: 'pointer', padding: '4px',
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
