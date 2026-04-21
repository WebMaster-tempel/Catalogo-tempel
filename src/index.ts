import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler';
import productRoutes from './routes/products';
import attributeRoutes from './routes/attributes';
import productTypeRoutes from './routes/product-types';
import categoryRoutes from './routes/categories';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/attributes', attributeRoutes);
app.use('/api/v1/product-types', productTypeRoutes);
app.use('/api/v1/categories', categoryRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API documentation
app.get('/api/v1', (req, res) => {
  res.json({
    name: 'Product Catalog API',
    version: '1.0.0',
    endpoints: {
      products: '/api/v1/products',
      categories: '/api/v1/categories',
      productTypes: '/api/v1/product-types',
      attributes: '/api/v1/attributes',
    },
    authentication: {
      method: 'API Key',
      header: 'X-API-Key',
      note: 'Required for write operations',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'NOT_FOUND',
    message: 'Endpoint not found',
  });
});

// Error handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`API docs: http://localhost:${port}/api/v1`);
});
