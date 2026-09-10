import { Request, Response } from 'express';
import { db } from '../config/database.js';
import { AuthRequest } from '../middleware/authenticateAdmin.js';

export function getExperience(_req: Request, res: Response) {
  return res.json(db.getExperience());
}

export function createExperience(req: AuthRequest, res: Response) {
  try {
    const { organization, position, type, startDate, endDate, description } = req.body;
    if (!organization || !position || !startDate) {
      return res.status(400).json({ error: 'Organization, position, and start date are required' });
    }

    const newExp = db.addExperience({
      organization,
      position,
      type: type || 'Experience',
      startDate,
      endDate: endDate || 'Present',
      current: Boolean(req.body.current),
      description: description || '',
      technologies: Array.isArray(req.body.technologies) ? req.body.technologies : [],
      achievements: Array.isArray(req.body.achievements) ? req.body.achievements : [],
      location: req.body.location || ''
    });

    return res.status(201).json(newExp);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to add experience' });
  }
}

export function updateExperience(req: AuthRequest, res: Response) {
  try {
    const targetId = req.params.id || req.body?._id || req.body?.id;
    if (!targetId || targetId === 'undefined') {
      return res.status(400).json({ error: 'Valid experience ID is required for update' });
    }
    const updated = db.updateExperience(targetId, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to update experience' });
  }
}

export function deleteExperience(req: AuthRequest, res: Response) {
  try {
    const targetId = req.params.id || req.body?._id || req.body?.id;
    if (!targetId || targetId === 'undefined') {
      return res.status(400).json({ error: 'Valid experience ID is required for deletion' });
    }
    const deleted = db.deleteExperience(targetId);
    if (!deleted) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    return res.json({ success: true, message: 'Experience deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to delete experience' });
  }
}
