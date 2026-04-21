import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../database/connection';
import { ProductService } from '../services/ProductService';
import { apiKeyMiddleware, AuthRequest } from '../middleware/auth';
import { ApiError } from '../middleware/errorHandler';
import {
  createProductSchema,
  updateProductSchema,
  listProductsQuerySchema,
  addMediaSchema,
} from '../validation/schemas';

const router = Router();
const productService = new ProductService(db);

// List products (public)
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = listProductsQuerySchema.validate(req.query);
    if (error) {
      throw error;
    }

    const products = await productService.listProducts(value);
    res.json({
      data: products.data,
      meta: {
        pagination: products.meta,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Get product detail (public)
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.getProduct(req.params.id);
    if (!product) {
      throw new ApiError(404, 'Product not found', 'NOT_FOUND');
    }
    res.json({ data: product });
  } catch (err) {
    next(err);
  }
});

// Create product (private)
router.post('/', apiKeyMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { error, value } = createProductSchema.validate(req.body);
    if (error) {
      throw error;
    }

    const product = await productService.createProduct(value);
    res.status(201).json({ data: product });
  } catch (err) {
    next(err);
  }
});

// Update product (private)
router.patch('/:id', apiKeyMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { error, value } = updateProductSchema.validate(req.body);
    if (error) {
      throw error;
    }

    const product = await productService.updateProduct(req.params.id, value);
    if (!product) {
      throw new ApiError(404, 'Product not found', 'NOT_FOUND');
    }
    res.json({ data: product });
  } catch (err) {
    next(err);
  }
});

// Delete product (private)
router.delete('/:id', apiKeyMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const deleted = await productService.deleteProduct(req.params.id);
    if (!deleted) {
      throw new ApiError(404, 'Product not found', 'NOT_FOUND');
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// Add media to product (private)
router.post('/:id/media', apiKeyMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { error, value } = addMediaSchema.validate(req.body);
    if (error) {
      throw error;
    }

    const media = await productService.addMedia(req.params.id, value);
    res.status(201).json({ data: media });
  } catch (err) {
    next(err);
  }
});

// Get product media (public)
router.get('/:id/media', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const media = await productService.getProductMedia(req.params.id);
    res.json({ data: media });
  } catch (err) {
    next(err);
  }
});

// Remove media (private)
router.delete('/:productId/media/:mediaId', apiKeyMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const deleted = await productService.removeMedia(req.params.mediaId);
    if (!deleted) {
      throw new ApiError(404, 'Media not found', 'NOT_FOUND');
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
