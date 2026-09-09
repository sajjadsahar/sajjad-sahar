import { Request, Response } from 'express';
import { db } from '../config/database.js';
import { AuthRequest } from '../middleware/authenticateAdmin.js';

export function getSkills(req: Request, res: Response) {
  const { category } = req.query;
  let skills = db.getSkills();
  if (category && category !== 'All') {
    skills = skills.filter(s => s.category.toLowerCase() === (category as string).toLowerCase());
  }
  return res.json(skills);
}

export function createSkill(req: AuthRequest, res: Response) {
  try {
    const { name, category, proficiency, yearsOfExperience, featured } = req.body;
    if (!name || !category || !proficiency) {
      return res.status(400).json({ error: 'Name, category, and proficiency are required' });
    }

    const newSkill = db.addSkill({
      name,
      category,
      proficiency,
      yearsOfExperience: yearsOfExperience || '1 yr',
      featured: Boolean(featured)
    });

    return res.status(201).json(newSkill);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to add skill' });
  }
}

export function updateSkill(req: AuthRequest, res: Response) {
  try {
    const updated = db.updateSkill(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to update skill' });
  }
}

export function deleteSkill(req: AuthRequest, res: Response) {
  const deleted = db.deleteSkill(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Skill not found' });
  }
  return res.json({ success: true, message: 'Skill deleted successfully' });
}
