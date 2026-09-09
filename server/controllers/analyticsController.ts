import { Request, Response } from 'express';
import { db } from '../config/database.js';
import { AuthRequest } from '../middleware/authenticateAdmin.js';

export function getAnalytics(_req: AuthRequest, res: Response) {
  return res.json(db.getAnalytics());
}

export function recordPageView(_req: Request, res: Response) {
  db.recordPageView();
  return res.json({ success: true });
}
