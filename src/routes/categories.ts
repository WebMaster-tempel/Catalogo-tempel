import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../database/connection';
import { CategoryService } from '../services/CategoryService';
import { CategoryFeatureService } from '../services/CategoryFeatureService';
import { apiKeyMiddleware, AuthRequest } from '../middleware/auth';
import { ApiError } from '../middleware/errorHandler';
import { createCategorySchema, updateCategorySchema } from '../validation/schemas';

const router = Router();
const categoryService = new CategoryService(db);
const featureService = new CategoryFeatureService(db);

// Get category tree (public)
router.get('/tree', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tree = await categoryService.getCategoryTree();
    res.json({ data: tree });
  } catch (err) {
    next(err);
  }
});

// List categories (public)
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await categoryService.listCategories();
    res.json({ data: categories });
  } catch (err) {
    next(err);
  }
});

// Get category (public)
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.getCategory(req.params.id);
    res.json({ data: category });
  } catch (err) {
    next(err);
  }
});

// Get child categories (public)
router.get('/:id/children', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const children = await categoryService.getChildCategories(req.params.id);
    res.json({ data: children });
  } catch (err) {
    next(err);
  }
});

// Create category (private)
router.post('/', apiKeyMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { error, value } = createCategorySchema.validate(req.body);
    if (error) {
      throw error;
    }

    const category = await categoryService.createCategory(value);
    res.status(201).json({ data: category });
  } catch (err) {
    next(err);
  }
});

// Update category (private)
router.patch('/:id', apiKeyMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { error, value } = updateCategorySchema.validate(req.body);
    if (error) {
      throw error;
    }

    const category = await categoryService.updateCategory(req.params.id, value);
    res.json({ data: category });
  } catch (err) {
    next(err);
  }
});

// Delete category (private)
router.delete('/:id', apiKeyMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const deleted = await categoryService.deleteCategory(req.params.id);
    if (!deleted) {
      throw new ApiError(404, 'Category not found', 'NOT_FOUND');
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// Get category features (public)
router.get('/:id/features', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type } = req.query;
    let features;

    if (type && typeof type === 'string') {
      features = await featureService.getFeaturesByType(req.params.id, type);
    } else {
      features = await featureService.getFeatures(req.params.id);
    }

    res.json({ data: features });
  } catch (err) {
    next(err);
  }
});

// Create category feature (private)
router.post('/:id/features', apiKeyMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { type, label, order } = req.body;

    if (!type || !label) {
      throw new ApiError(400, 'Missing required fields: type, label', 'VALIDATION_ERROR');
    }

    const feature = await featureService.createFeature(req.params.id, type, label, order);
    res.status(201).json({ data: feature });
  } catch (err) {
    next(err);
  }
});

// Update category feature (private)
router.patch('/:id/features/:featureId', apiKeyMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { label, order, type } = req.body;
    const feature = await featureService.updateFeature(req.params.featureId, { label, order, type });
    res.json({ data: feature });
  } catch (err) {
    next(err);
  }
});

// Delete category feature (private)
router.delete('/:id/features/:featureId', apiKeyMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const deleted = await featureService.deleteFeature(req.params.featureId);
    if (!deleted) {
      throw new ApiError(404, 'Feature not found', 'NOT_FOUND');
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// Reorder features (private)
router.post('/:id/features/reorder', apiKeyMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { featureIds } = req.body;

    if (!Array.isArray(featureIds)) {
      throw new ApiError(400, 'featureIds must be an array', 'VALIDATION_ERROR');
    }

    await featureService.reorderFeatures(req.params.id, featureIds);
    res.json({ data: { success: true } });
  } catch (err) {
    next(err);
  }
});

export default router;
