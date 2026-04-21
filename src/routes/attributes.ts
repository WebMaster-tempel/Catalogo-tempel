import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../database/connection';
import { AttributeService } from '../services/AttributeService';
import { apiKeyMiddleware, AuthRequest } from '../middleware/auth';
import { ApiError } from '../middleware/errorHandler';
import { createAttributeSchema } from '../validation/schemas';

const router = Router();
const attributeService = new AttributeService(db);

// List attributes (public)
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const attributes = await attributeService.listAttributes();
    res.json({ data: attributes });
  } catch (err) {
    next(err);
  }
});

// Get attribute (public)
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const attribute = await attributeService.getAttribute(req.params.id);
    res.json({ data: attribute });
  } catch (err) {
    next(err);
  }
});

// Get filterable attributes (public)
router.get('/filterable', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const attributes = await attributeService.getFilterableAttributes();
    res.json({ data: attributes });
  } catch (err) {
    next(err);
  }
});

// Create attribute (private)
router.post('/', apiKeyMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { error, value } = createAttributeSchema.validate(req.body);
    if (error) {
      throw error;
    }

    const attribute = await attributeService.createAttribute(value);
    res.status(201).json({ data: attribute });
  } catch (err) {
    next(err);
  }
});

// Delete attribute (private)
router.delete('/:id', apiKeyMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const deleted = await attributeService.deleteAttribute(req.params.id);
    if (!deleted) {
      throw new ApiError(404, 'Attribute not found', 'NOT_FOUND');
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
