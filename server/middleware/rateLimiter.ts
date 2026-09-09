import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export function rateLimiter(limit = 100, windowMs = 60 * 1000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || 'anonymous';
    const key = String(ip);
    const now = Date.now();

    if (!store[key] || store[key].resetTime < now) {
      store[key] = { count: 1, resetTime: now + windowMs };
      return next();
    }

    store[key].count++;
    if (store[key].count > limit) {
      return res.status(429).json({
        error: 'Too many requests, please try again later.'
      });
    }

    next();
  };
}
