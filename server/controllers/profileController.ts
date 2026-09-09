import { Request, Response } from 'express';
import { db } from '../config/database.js';
import { AuthRequest } from '../middleware/authenticateAdmin.js';

export function getPortfolioData(_req: Request, res: Response) {
  return res.json({ data: db.getPortfolioData() });
}

export function getProfile(_req: Request, res: Response) {
  return res.json(db.getProfile());
}

export function updateProfile(req: AuthRequest, res: Response) {
  try {
    const updated = db.updateProfile(req.body);
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to update profile' });
  }
}
