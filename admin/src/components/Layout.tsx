import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app">
      <nav className="sidebar">
        <div className="sidebar-brand">
          <span>⚡</span> Catálogo Admin
        </div>
        <ul>
          <li><NavLink to="/" end>Dashboard</NavLink></li>
          <li><NavLink to="/products">Productos</NavLink></li>
          <li><NavLink to="/categories">Categorías</NavLink></li>
          <li><NavLink to="/product-types">Tipos</NavLink></li>
          <li><NavLink to="/attributes">Atributos</NavLink></li>
          <li><NavLink to="/api-reference">API Reference</NavLink></li>
        </ul>
        <div className="sidebar-footer">
          <a href="/api/v1" target="_blank" rel="noopener noreferrer">API →</a>
          {isAuthenticated ? (
            <>
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--sidebar-muted, #94a3b8)' }}>
                {user?.email}
              </div>
              <button
                onClick={handleLogout}
                style={{
                  marginTop: '0.5rem',
                  background: 'none',
                  border: '1px solid currentColor',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  color: 'inherit',
                  width: '100%',
                }}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <a
              href="/login"
              style={{
                display: 'block',
                marginTop: '0.5rem',
                fontSize: '0.75rem',
                textAlign: 'center',
                padding: '4px 8px',
                border: '1px solid currentColor',
                borderRadius: '4px',
              }}
            >
              Iniciar sesión
            </a>
          )}
        </div>
      </nav>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
