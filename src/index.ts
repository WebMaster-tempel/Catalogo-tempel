import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import attributeRoutes from './routes/attributes';
import productTypeRoutes from './routes/product-types';
import categoryRoutes from './routes/categories';
import uploadRoutes from './routes/uploads';

const app = express();
const port = process.env.PORT || 3000;

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// Serve admin panel
const adminDist = path.join(process.cwd(), 'admin', 'dist');
if (fs.existsSync(adminDist)) {
  app.use('/admin', express.static(adminDist));
  app.get('/admin/*', (_req, res) => {
    res.sendFile(path.join(adminDist, 'index.html'));
  });
}

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/attributes', attributeRoutes);
app.use('/api/v1/product-types', productTypeRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/uploads', uploadRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// API documentation
app.get('/api/v1', (_req, res) => {
  res.json({
    name: 'Product Catalog API',
    version: '1.0.0',
    endpoints: {
      products: '/api/v1/products',
      categories: '/api/v1/categories',
      productTypes: '/api/v1/product-types',
      attributes: '/api/v1/attributes',
      uploads: '/api/v1/uploads',
    },
    authentication: {
      method: 'JWT Bearer token',
      header: 'Authorization: Bearer <token>',
      login: 'POST /api/v1/auth/login',
      register: 'POST /api/v1/auth/register',
      note: 'Required for write operations',
    },
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'NOT_FOUND', message: 'Endpoint not found' });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`API:   http://localhost:${port}/api/v1`);
  console.log(`Admin: http://localhost:${port}/admin`);
});
