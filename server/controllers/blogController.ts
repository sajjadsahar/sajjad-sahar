import { Request, Response } from 'express';
import { db } from '../config/database.js';
import { AuthRequest } from '../middleware/authenticateAdmin.js';

export function getBlogs(req: Request, res: Response) {
  const { all, category, search } = req.query;
  let list = db.getBlogs();

  // If not admin requesting all, only show published
  if (all !== 'true') {
    list = list.filter(b => b.published);
  }

  if (category && category !== 'All') {
    list = list.filter(b => b.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (search) {
    const q = (search as string).toLowerCase();
    list = list.filter(b => 
      b.title.toLowerCase().includes(q) ||
      b.excerpt.toLowerCase().includes(q) ||
      b.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  return res.json(list);
}

export function getBlogByIdOrSlug(req: Request, res: Response) {
  const blog = db.getBlogs().find(b => b.id === req.params.idOrSlug || b.slug === req.params.idOrSlug);
  if (!blog) {
    return res.status(404).json({ error: 'Blog not found' });
  }
  db.incrementBlogViews(blog.id);
  return res.json(blog);
}

export function createBlog(req: AuthRequest, res: Response) {
  try {
    const { title, excerpt, content, category, tags, coverImage, published, readingTimeMinutes } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const slug = req.body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newBlog = db.addBlog({
      title,
      slug,
      excerpt: excerpt || content.substring(0, 160) + '...',
      content,
      category: category || 'Technology',
      tags: Array.isArray(tags) ? tags : (tags || '').split(',').map((t: string) => t.trim()).filter(Boolean),
      coverImage: coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      published: published !== undefined ? Boolean(published) : true,
      publishedAt: new Date().toISOString().substring(0, 10),
      readingTimeMinutes: readingTimeMinutes || Math.max(1, Math.ceil(content.split(/\s+/).length / 200))
    });

    return res.status(201).json(newBlog);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to create blog' });
  }
}

export function updateBlog(req: AuthRequest, res: Response) {
  try {
    const updated = db.updateBlog(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to update blog' });
  }
}

export function deleteBlog(req: AuthRequest, res: Response) {
  const deleted = db.deleteBlog(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Blog not found' });
  }
  return res.json({ success: true, message: 'Blog deleted successfully' });
}
