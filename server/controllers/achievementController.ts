import { Request, Response } from 'express';
import { db } from '../config/database.js';
import { AuthRequest } from '../middleware/authenticateAdmin.js';

export function getAchievements(_req: Request, res: Response) {
  return res.json(db.getAchievements());
}

export function createAchievement(req: AuthRequest, res: Response) {
  try {
    const { title, organization, date, category, description, featured } = req.body;
    if (!title || !organization || !category) {
      return res.status(400).json({ error: 'Title, organization, and category are required' });
    }

    const newAch = db.addAchievement({
      title,
      organization,
      date: date || new Date().toISOString().substring(0, 7),
      category,
      description: description || '',
      featured: Boolean(featured)
    });

    return res.status(201).json(newAch);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to add achievement' });
  }
}

export function updateAchievement(req: AuthRequest, res: Response) {
  try {
    const updated = db.updateAchievement(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Achievement not found' });
    }
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to update achievement' });
  }
}

export function deleteAchievement(req: AuthRequest, res: Response) {
  const deleted = db.deleteAchievement(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Achievement not found' });
  }
  return res.json({ success: true, message: 'Achievement deleted successfully' });
}
