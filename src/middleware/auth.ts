import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  apiKey?: string;
  user?: { id: string; email: string; role: string };
}

// Accepts JWT Bearer token OR legacy X-API-Key (for WordPress plugin backward compat)
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (token) {
    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) throw new Error('JWT_SECRET not configured');
      const payload = jwt.verify(token, secret) as any;
      req.user = { id: payload.sub, email: payload.email, role: payload.role };
      next();
      return;
    } catch {
      res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired token' });
      return;
    }
  }

  // Fallback: API key (WordPress plugin)
  const apiKey = req.headers['x-api-key'] as string;
  const validKey = process.env.API_KEY_SECRET || 'dev-key';
  if (apiKey && apiKey === validKey) {
    req.apiKey = apiKey;
    next();
    return;
  }

  res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
};

// Alias kept so existing route imports don't break
export const apiKeyMiddleware = authMiddleware;

export const optionalApiKeyMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const apiKey = req.headers['x-api-key'] as string;
  if (apiKey) {
    req.apiKey = apiKey;
  }
  next();
};
