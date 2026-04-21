import { NavLink, Outlet } from 'react-router-dom';

export default function Layout() {
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
        </ul>
        <div className="sidebar-footer">
          <a href="/api/v1" target="_blank" rel="noopener noreferrer">API →</a>
        </div>
      </nav>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
