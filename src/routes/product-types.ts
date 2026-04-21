import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../database/connection';
import { ProductTypeService } from '../services/ProductTypeService';
import { apiKeyMiddleware, AuthRequest } from '../middleware/auth';
import { ApiError } from '../middleware/errorHandler';
import { createProductTypeSchema, assignProductTypeAttributeSchema } from '../validation/schemas';

const router = Router();
const productTypeService = new ProductTypeService(db);

// List product types (public)
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productTypes = await productTypeService.listProductTypes();
    res.json({ data: productTypes });
  } catch (err) {
    next(err);
  }
});

// Get product type with attributes (public)
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productType = await productTypeService.getProductType(req.params.id);
    res.json({ data: productType });
  } catch (err) {
    next(err);
  }
});

// Create product type (private)
router.post('/', apiKeyMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { error, value } = createProductTypeSchema.validate(req.body);
    if (error) {
      throw error;
    }

    const productType = await productTypeService.createProductType(value);
    res.status(201).json({ data: productType });
  } catch (err) {
    next(err);
  }
});

// Delete product type (private)
router.delete('/:id', apiKeyMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const deleted = await productTypeService.deleteProductType(req.params.id);
    if (!deleted) {
      throw new ApiError(404, 'Product type not found', 'NOT_FOUND');
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// Assign attribute to product type (private)
router.post(
  '/:id/attributes',
  apiKeyMiddleware,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { error, value } = assignProductTypeAttributeSchema.validate(req.body);
      if (error) {
        throw error;
      }

      const result = await productTypeService.assignAttribute(
        req.params.id,
        value.attribute_id,
        value.is_required,
        value.order
      );
      res.status(201).json({ data: result });
    } catch (err) {
      next(err);
    }
  }
);

// Remove attribute from product type (private)
router.delete(
  '/:id/attributes/:attributeId',
  apiKeyMiddleware,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const deleted = await productTypeService.removeAttribute(req.params.id, req.params.attributeId);
      if (!deleted) {
        throw new ApiError(404, 'Attribute assignment not found', 'NOT_FOUND');
      }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

export default router;
