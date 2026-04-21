import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../database/connection';
import { CategoryService } from '../services/CategoryService';
import { apiKeyMiddleware, AuthRequest } from '../middleware/auth';
import { ApiError } from '../middleware/errorHandler';
import { createCategorySchema, updateCategorySchema } from '../validation/schemas';

const router = Router();
const categoryService = new CategoryService(db);

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

export default router;
