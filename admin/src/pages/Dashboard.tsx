import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsApi, categoriesApi, productTypesApi, attributesApi } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, categories: 0, types: 0, attributes: 0 });

  useEffect(() => {
    Promise.all([
      productsApi.list({ per_page: '1' }),
      categoriesApi.list(),
      productTypesApi.list(),
      attributesApi.list(),
    ]).then(([products, categories, types, attributes]) => {
      setStats({
        products: products.meta?.pagination?.total || 0,
        categories: categories.data?.length || 0,
        types: types.data?.length || 0,
        attributes: attributes.data?.length || 0,
      });
    });
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Panel de administración</h1>
      </div>

      <div className="stats-grid">
        <Link to="/products" className="stat-card">
          <span className="stat-number">{stats.products}</span>
          <span className="stat-label">Productos</span>
        </Link>
        <Link to="/categories" className="stat-card">
          <span className="stat-number">{stats.categories}</span>
          <span className="stat-label">Categorías</span>
        </Link>
        <Link to="/product-types" className="stat-card">
          <span className="stat-number">{stats.types}</span>
          <span className="stat-label">Tipos</span>
        </Link>
        <Link to="/attributes" className="stat-card">
          <span className="stat-number">{stats.attributes}</span>
          <span className="stat-label">Atributos</span>
        </Link>
      </div>

      <div className="quick-actions">
        <h2>Acciones rápidas</h2>
        <Link to="/products/new" className="btn btn-primary">+ Nuevo producto</Link>
        <Link to="/categories" className="btn">Gestionar categorías</Link>
        <Link to="/product-types" className="btn">Gestionar tipos</Link>
      </div>
    </div>
  );
}
