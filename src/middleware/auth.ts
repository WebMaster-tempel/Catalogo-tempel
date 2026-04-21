import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  apiKey?: string;
}

export const apiKeyMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    res.status(401).json({
      error: 'Missing API key',
      message: 'X-API-Key header is required',
    });
    return;
  }

  // In production, validate against stored API keys
  const validKey = process.env.API_KEY_SECRET || 'dev-key';
  if (apiKey !== validKey) {
    res.status(403).json({
      error: 'Invalid API key',
      message: 'The provided API key is not valid',
    });
    return;
  }

  req.apiKey = apiKey;
  next();
};

export const optionalApiKeyMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const apiKey = req.headers['x-api-key'] as string;
  if (apiKey) {
    req.apiKey = apiKey;
  }
  next();
};
