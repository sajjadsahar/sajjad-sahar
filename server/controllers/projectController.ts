import { Request, Response } from 'express';
import { db } from '../config/database.js';
import { AuthRequest } from '../middleware/authenticateAdmin.js';

export function getProjects(req: Request, res: Response) {
  const { category, search, featured } = req.query;
  let list = db.getProjects();

  if (category && category !== 'All') {
    list = list.filter(p => p.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (featured === 'true') {
    list = list.filter(p => p.featured);
  }

  if (search) {
    const q = (search as string).toLowerCase();
    list = list.filter(p => 
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.technologies.some(t => t.toLowerCase().includes(q))
    );
  }

  return res.json(list);
}

export function getProjectByIdOrSlug(req: Request, res: Response) {
  const { idOrSlug } = req.params;
  const project = db.getProjects().find(p => p.id === idOrSlug || p.slug === idOrSlug);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  db.incrementProjectViews(project.id);
  return res.json(project);
}

export function createProject(req: AuthRequest, res: Response) {
  try {
    const { title, description, category, technologies, imageUrl, githubUrl } = req.body;
    if (!title || !description || !category) {
      return res.status(400).json({ error: 'Title, description, and category are required' });
    }

    const slug = req.body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newProject = db.addProject({
      title,
      slug,
      description,
      category,
      technologies: Array.isArray(technologies) ? technologies : (technologies || '').split(',').map((t: string) => t.trim()).filter(Boolean),
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      githubUrl: githubUrl || '',
      liveDemoUrl: req.body.liveDemoUrl || '',
      date: req.body.date || new Date().toISOString().substring(0, 7),
      featured: Boolean(req.body.featured),
      features: Array.isArray(req.body.features) ? req.body.features : [],
      challenges: req.body.challenges || '',
      whatILearned: req.body.whatILearned || '',
      screenshots: Array.isArray(req.body.screenshots) ? req.body.screenshots : []
    });

    return res.status(201).json(newProject);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to add project' });
  }
}

export function updateProject(req: AuthRequest, res: Response) {
  try {
    const targetId = req.params.id || req.body?._id || req.body?.id;
    if (!targetId || targetId === 'undefined') {
      return res.status(400).json({ error: 'Valid project ID is required for update' });
    }
    const updated = db.updateProject(targetId, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Project not found' });
    }
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to update project' });
  }
}

export function deleteProject(req: AuthRequest, res: Response) {
  try {
    const targetId = req.params.id || req.body?._id || req.body?.id;
    if (!targetId || targetId === 'undefined') {
      return res.status(400).json({ error: 'Valid project ID is required for deletion' });
    }
    const deleted = db.deleteProject(targetId);
    if (!deleted) {
      return res.status(404).json({ error: 'Project not found' });
    }
    return res.json({ success: true, message: 'Project deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to delete project' });
  }
}
