import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import ProductForm from './pages/ProductForm';
import ProductDetail from './pages/ProductDetail';
import Categories from './pages/Categories';
import ProductTypes from './pages/ProductTypes';
import Attributes from './pages/Attributes';
import ApiReference from './pages/ApiReference';

export default function App() {
  return (
    <BrowserRouter basename="/admin">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="products/:id/edit" element={<ProductForm />} />
          <Route path="categories" element={<Categories />} />
          <Route path="product-types" element={<ProductTypes />} />
          <Route path="attributes" element={<Attributes />} />
          <Route path="api-reference" element={<ApiReference />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
