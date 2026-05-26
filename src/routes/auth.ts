import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../database/connection';
import { AuthService } from '../services/AuthService';

const router = Router();
const authService = new AuthService(db);

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'MISSING_FIELDS', message: 'email and password are required' });
      return;
    }
    const result = await authService.register(email, password);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'MISSING_FIELDS', message: 'email and password are required' });
      return;
    }
    const result = await authService.login(email, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
