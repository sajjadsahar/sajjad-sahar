import { Response } from 'express';
import { db } from '../config/database.js';
import { AuthRequest } from '../middleware/authenticateAdmin.js';

export function resetSeed(_req: AuthRequest, res: Response) {
  db.resetToDefault();
  return res.json({ success: true, message: 'Database reset to default seed data successfully.' });
}
