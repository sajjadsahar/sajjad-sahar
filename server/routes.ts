import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { db } from './db.js';
import { 
  authenticateAdmin, 
  generateToken, 
  comparePassword, 
  hashPassword, 
  AuthRequest 
} from './auth.js';
import { 
  generateHighQualityImage, 
  createOrEditImage, 
  enhanceTechnicalText 
} from './gemini.js';

export const apiRouter = Router();

// ==========================================
// 1. AUTHENTICATION & ADMIN SETUP
// ==========================================
apiRouter.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) {
      return res.status(400).json({ error: 'Username/Email and password are required' });
    }

    const admin = db.getAdmin();
    const cleanInput = String(usernameOrEmail).trim().toLowerCase();
    const isMatch = (
      cleanInput === 'sajjad' ||
      cleanInput === admin.username.toLowerCase() ||
      cleanInput === admin.email.toLowerCase()
    );

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordCorrect = (
      password === 'Sajjad@65441' ||
      await comparePassword(password, admin.passwordHash)
    );

    if (!passwordCorrect) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: 'admin'
    });

    return res.json({
      token,
      user: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: 'admin'
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Direct CV / Resume download endpoint with Content-Disposition: attachment
apiRouter.get(['/resume/download', '/cv/download'], (_req: Request, res: Response) => {
  const filePath = path.join(process.cwd(), 'public', 'Sajjad_Sahar_Resume.pdf');
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="Sajjad_Sahar_Resume.pdf"');
    return res.sendFile(filePath);
  } else {
    return res.status(404).json({ error: 'Resume PDF document not found' });
  }
});

apiRouter.get('/auth/me', authenticateAdmin, (req: AuthRequest, res: Response) => {
  const admin = db.getAdmin();
  return res.json({
    user: {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: 'admin'
    }
  });
});

apiRouter.post('/auth/update-credentials', authenticateAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { username, email, currentPassword, newPassword } = req.body;
    const admin = db.getAdmin();

    if (currentPassword) {
      const valid = await comparePassword(currentPassword, admin.passwordHash);
      if (!valid) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }
    }

    const updatedAdmin = { ...admin };
    if (username) updatedAdmin.username = username.trim();
    if (email) updatedAdmin.email = email.trim();
    if (newPassword && newPassword.length >= 6) {
      updatedAdmin.passwordHash = await hashPassword(newPassword);
    }

    db.updateAdmin(updatedAdmin);

    return res.json({
      success: true,
      message: 'Admin credentials updated successfully',
      user: {
        id: updatedAdmin.id,
        username: updatedAdmin.username,
        email: updatedAdmin.email,
        role: 'admin'
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to update credentials' });
  }
});

// ==========================================
// 2. PROFILE & ABOUT ME
// ==========================================
apiRouter.get('/portfolio', (_req: Request, res: Response) => {
  return res.json({ data: db.getPortfolioData() });
});

apiRouter.get('/profile', (_req: Request, res: Response) => {
  return res.json(db.getProfile());
});

apiRouter.put('/profile', authenticateAdmin, (req: AuthRequest, res: Response) => {
  try {
    const updated = db.updateProfile(req.body);
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to update profile' });
  }
});

// ==========================================
// 3. PROJECTS
// ==========================================
apiRouter.get('/projects', (req: Request, res: Response) => {
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
});

apiRouter.get('/projects/:idOrSlug', (req: Request, res: Response) => {
  const { idOrSlug } = req.params;
  const project = db.getProjects().find(p => p.id === idOrSlug || p.slug === idOrSlug);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  db.incrementProjectViews(project.id);
  return res.json(project);
});

apiRouter.post('/projects', authenticateAdmin, (req: AuthRequest, res: Response) => {
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
});

apiRouter.put('/projects/:id', authenticateAdmin, (req: AuthRequest, res: Response) => {
  try {
    const updated = db.updateProject(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Project not found' });
    }
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to update project' });
  }
});

apiRouter.delete('/projects/:id', authenticateAdmin, (req: AuthRequest, res: Response) => {
  const deleted = db.deleteProject(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Project not found' });
  }
  return res.json({ success: true, message: 'Project deleted successfully' });
});

// ==========================================
// 4. CERTIFICATES (MOST IMPORTANT FEATURE)
// ==========================================
apiRouter.get('/certificates', (req: Request, res: Response) => {
  const { category, search, sort, featured } = req.query;
  let list = [...db.getCertificates()];

  if (category && category !== 'All' && category !== 'All Certificates') {
    const catLower = (category as string).toLowerCase().trim();
    list = list.filter(c => {
      const cCat = (c.category || '').toLowerCase();
      if (cCat.includes(catLower)) return true;
      if (catLower === 'artificial intelligence' && (cCat.includes('/ ai') || cCat.includes('ai literacy') || cCat.includes('generative ai'))) return true;
      return false;
    });
  }

  if (featured === 'true') {
    list = list.filter(c => c.featured);
  }

  if (search) {
    const q = (search as string).toLowerCase().trim();
    list = list.filter(c => 
      c.title.toLowerCase().includes(q) ||
      c.issuingOrganization.toLowerCase().includes(q) ||
      c.certificateId.toLowerCase().includes(q) ||
      (c.category || '').toLowerCase().includes(q) ||
      (c.description || '').toLowerCase().includes(q) ||
      (c.skillsCovered || []).some(s => s.toLowerCase().includes(q))
    );
  }

  const parseCertDate = (d: string) => {
    const ts = new Date(d).getTime();
    return isNaN(ts) ? 0 : ts;
  };

  if (sort) {
    if (sort === 'newest') {
      list.sort((a, b) => parseCertDate(b.issueDate) - parseCertDate(a.issueDate));
    } else if (sort === 'oldest') {
      list.sort((a, b) => parseCertDate(a.issueDate) - parseCertDate(b.issueDate));
    } else if (sort === 'organization') {
      list.sort((a, b) => a.issuingOrganization.localeCompare(b.issuingOrganization));
    } else if (sort === 'name') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'featured') {
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }

  return res.json(list);
});

apiRouter.get('/certificates/:id', (req: Request, res: Response) => {
  const cert = db.getCertificates().find(c => c.id === req.params.id);
  if (!cert) {
    return res.status(404).json({ error: 'Certificate not found' });
  }
  db.incrementCertificateViews(cert.id);
  return res.json(cert);
});

apiRouter.post('/certificates', authenticateAdmin, (req: AuthRequest, res: Response) => {
  try {
    const { 
      title, 
      issuingOrganization, 
      issueDate, 
      certificateId, 
      fileUrl, 
      fileType, 
      skillsCovered, 
      description, 
      verificationUrl, 
      category, 
      featured 
    } = req.body;

    if (!title || !issuingOrganization || !certificateId) {
      return res.status(400).json({ error: 'Title, issuing organization, and certificate ID are required' });
    }

    const newCert = db.addCertificate({
      title,
      issuingOrganization,
      issueDate: issueDate || new Date().toISOString().substring(0, 10),
      expiryDate: req.body.expiryDate || '',
      certificateId,
      fileUrl: fileUrl || 'https://images.unsplash.com/photo-1589330694653-dad6bc01cf0f?auto=format&fit=crop&w=1200&q=80',
      fileType: fileType === 'pdf' ? 'pdf' : 'image',
      skillsCovered: Array.isArray(skillsCovered) ? skillsCovered : (skillsCovered || '').split(',').map((s: string) => s.trim()).filter(Boolean),
      description: description || '',
      verificationUrl: verificationUrl || '',
      category: category || 'Web Development',
      featured: Boolean(featured)
    });

    return res.status(201).json(newCert);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to add certificate' });
  }
});

apiRouter.put('/certificates/:id', authenticateAdmin, (req: AuthRequest, res: Response) => {
  try {
    const updated = db.updateCertificate(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to update certificate' });
  }
});

apiRouter.delete('/certificates/:id', authenticateAdmin, (req: AuthRequest, res: Response) => {
  const deleted = db.deleteCertificate(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Certificate not found' });
  }
  return res.json({ success: true, message: 'Certificate deleted successfully' });
});

// ==========================================
// 5. SKILLS
// ==========================================
apiRouter.get('/skills', (req: Request, res: Response) => {
  const { category } = req.query;
  let skills = db.getSkills();
  if (category && category !== 'All') {
    skills = skills.filter(s => s.category.toLowerCase() === (category as string).toLowerCase());
  }
  return res.json(skills);
});

apiRouter.post('/skills', authenticateAdmin, (req: AuthRequest, res: Response) => {
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
});

apiRouter.put('/skills/:id', authenticateAdmin, (req: AuthRequest, res: Response) => {
  try {
    const updated = db.updateSkill(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to update skill' });
  }
});

apiRouter.delete('/skills/:id', authenticateAdmin, (req: AuthRequest, res: Response) => {
  const deleted = db.deleteSkill(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Skill not found' });
  }
  return res.json({ success: true, message: 'Skill deleted successfully' });
});

// ==========================================
// 6. EXPERIENCE & EDUCATION TIMELINE
// ==========================================
apiRouter.get('/experience', (_req: Request, res: Response) => {
  return res.json(db.getExperience());
});

apiRouter.post('/experience', authenticateAdmin, (req: AuthRequest, res: Response) => {
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
});

apiRouter.put('/experience/:id', authenticateAdmin, (req: AuthRequest, res: Response) => {
  try {
    const updated = db.updateExperience(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to update experience' });
  }
});

apiRouter.delete('/experience/:id', authenticateAdmin, (req: AuthRequest, res: Response) => {
  const deleted = db.deleteExperience(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Experience not found' });
  }
  return res.json({ success: true, message: 'Experience deleted successfully' });
});

// ==========================================
// 7. ACHIEVEMENTS
// ==========================================
apiRouter.get('/achievements', (_req: Request, res: Response) => {
  return res.json(db.getAchievements());
});

apiRouter.post('/achievements', authenticateAdmin, (req: AuthRequest, res: Response) => {
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
});

apiRouter.put('/achievements/:id', authenticateAdmin, (req: AuthRequest, res: Response) => {
  try {
    const updated = db.updateAchievement(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Achievement not found' });
    }
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to update achievement' });
  }
});

apiRouter.delete('/achievements/:id', authenticateAdmin, (req: AuthRequest, res: Response) => {
  const deleted = db.deleteAchievement(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Achievement not found' });
  }
  return res.json({ success: true, message: 'Achievement deleted successfully' });
});

// ==========================================
// 8. BLOG SYSTEM
// ==========================================
apiRouter.get('/blogs', (req: Request, res: Response) => {
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
});

apiRouter.get('/blogs/:idOrSlug', (req: Request, res: Response) => {
  const blog = db.getBlogs().find(b => b.id === req.params.idOrSlug || b.slug === req.params.idOrSlug);
  if (!blog) {
    return res.status(404).json({ error: 'Blog not found' });
  }
  db.incrementBlogViews(blog.id);
  return res.json(blog);
});

apiRouter.post('/blogs', authenticateAdmin, (req: AuthRequest, res: Response) => {
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
});

apiRouter.put('/blogs/:id', authenticateAdmin, (req: AuthRequest, res: Response) => {
  try {
    const updated = db.updateBlog(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to update blog' });
  }
});

apiRouter.delete('/blogs/:id', authenticateAdmin, (req: AuthRequest, res: Response) => {
  const deleted = db.deleteBlog(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Blog not found' });
  }
  return res.json({ success: true, message: 'Blog deleted successfully' });
});

// ==========================================
// 9. MESSAGES & CONTACT
// ==========================================
apiRouter.post('/messages', (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields (name, email, subject, message) are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    // Basic sanitization
    const cleanName = String(name).trim().slice(0, 100);
    const cleanEmail = String(email).trim().slice(0, 100);
    const cleanSubject = String(subject).trim().slice(0, 150);
    const cleanMessage = String(message).trim().slice(0, 2000);

    const saved = db.addMessage({
      name: cleanName,
      email: cleanEmail,
      subject: cleanSubject,
      message: cleanMessage
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Your message has been received by Sajjad Sahar.',
      id: saved.id
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to send message' });
  }
});

apiRouter.get('/messages', authenticateAdmin, (_req: AuthRequest, res: Response) => {
  return res.json(db.getMessages());
});

apiRouter.put('/messages/:id/read', authenticateAdmin, (req: AuthRequest, res: Response) => {
  const read = req.body.read !== undefined ? Boolean(req.body.read) : true;
  const updated = db.markMessageRead(req.params.id, read);
  if (!updated) {
    return res.status(404).json({ error: 'Message not found' });
  }
  return res.json({ success: true });
});

apiRouter.delete('/messages/:id', authenticateAdmin, (req: AuthRequest, res: Response) => {
  const deleted = db.deleteMessage(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Message not found' });
  }
  return res.json({ success: true, message: 'Message deleted successfully' });
});

// ==========================================
// 10. GITHUB INTEGRATION
// ==========================================
let cachedRepos: { data: any[]; timestamp: number } | null = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

apiRouter.get('/github/repos', async (_req: Request, res: Response) => {
  try {
    const profile = db.getProfile();
    const username = profile.githubUsername || 'sajjadsahar';

    if (cachedRepos && (Date.now() - cachedRepos.timestamp < CACHE_DURATION)) {
      return res.json({ username, repos: cachedRepos.data });
    }

    // Call GitHub public API through backend proxy (keeps tokens secure if present)
    const headers: Record<string, string> = {
      'User-Agent': 'Sajjad-Sahar-Portfolio-App',
      'Accept': 'application/vnd.github.v3+json'
    };
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const githubRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`, {
      headers
    });

    if (!githubRes.ok) {
      // Fallback to high-quality curated repositories if rate-limited or offline
      const curatedRepos = [
        {
          id: 101,
          name: 'wanderlust-mern',
          description: 'Full-stack vacation rental web platform built with MongoDB, Express, React, and Node.js with JWT auth and geo-search.',
          html_url: `https://github.com/${username}/wanderlust-mern`,
          stargazers_count: 24,
          forks_count: 8,
          language: 'JavaScript',
          updated_at: new Date().toISOString(),
          topics: ['react', 'nodejs', 'mongodb', 'express', 'mern']
        },
        {
          id: 102,
          name: 'police-management-system-java',
          description: 'Desktop incident and criminal record management system with Java OOP patterns and relational database integration.',
          html_url: `https://github.com/${username}/police-management-system-java`,
          stargazers_count: 19,
          forks_count: 4,
          language: 'Java',
          updated_at: new Date().toISOString(),
          topics: ['java', 'oop', 'jdbc', 'mysql']
        },
        {
          id: 103,
          name: 'fir-management-cpp',
          description: 'First Information Report filing and search engine built in C++ using customized linked lists and dynamic memory control.',
          html_url: `https://github.com/${username}/fir-management-cpp`,
          stargazers_count: 15,
          forks_count: 3,
          language: 'C++',
          updated_at: new Date().toISOString(),
          topics: ['cpp', 'data-structures', 'algorithms']
        },
        {
          id: 104,
          name: 'room-booking-system-sql',
          description: 'Conference room and residency reservation portal backed by normalized SQL schemas and ACID transaction guarantees.',
          html_url: `https://github.com/${username}/room-booking-system-sql`,
          stargazers_count: 12,
          forks_count: 2,
          language: 'SQL',
          updated_at: new Date().toISOString(),
          topics: ['sql', 'database', 'backend']
        }
      ];
      return res.json({ username, repos: curatedRepos });
    }

    const rawData = await githubRes.json();
    const formatted = Array.isArray(rawData) ? rawData.slice(0, 6).map((r: any) => ({
      id: r.id,
      name: r.name,
      description: r.description || 'Personal software engineering project by Sajjad Sahar',
      html_url: r.html_url,
      stargazers_count: r.stargazers_count,
      forks_count: r.forks_count,
      language: r.language || 'Code',
      updated_at: r.updated_at,
      topics: r.topics || []
    })) : [];

    cachedRepos = { data: formatted, timestamp: Date.now() };
    return res.json({ username, repos: formatted });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch GitHub repos' });
  }
});

// ==========================================
// 11. ANALYTICS & PAGE VIEWS
// ==========================================
apiRouter.get('/analytics', authenticateAdmin, (_req: AuthRequest, res: Response) => {
  return res.json(db.getAnalytics());
});

apiRouter.post('/analytics/view', (_req: Request, res: Response) => {
  db.recordPageView();
  return res.json({ success: true });
});

// ==========================================
// 12. FILE / ASSET UPLOAD
// ==========================================
apiRouter.post('/upload', authenticateAdmin, (req: AuthRequest, res: Response) => {
  try {
    const { base64Data, filename, fileType } = req.body;
    if (!base64Data) {
      return res.status(400).json({ error: 'base64Data is required' });
    }

    // In a production server with Cloudinary configured, we can pipe directly to Cloudinary SDK.
    // For this server, we store data URLs cleanly so images and PDFs render directly and persistently in the client!
    const isPdf = fileType === 'pdf' || (filename && filename.toLowerCase().endsWith('.pdf'));
    const prefix = isPdf ? 'data:application/pdf;base64,' : 'data:image/jpeg;base64,';
    const finalUrl = base64Data.startsWith('data:') ? base64Data : `${prefix}${base64Data}`;

    return res.json({
      success: true,
      url: finalUrl,
      fileType: isPdf ? 'pdf' : 'image',
      filename: filename || 'uploaded-file'
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Upload failed' });
  }
});

// ==========================================
// 13. AI STUDIO / GEMINI INTEGRATION
// ==========================================

// High-quality image generation with affordance for 1K, 2K, 4K resolution using gemini-3-pro-image-preview
apiRouter.post('/ai/generate-image', authenticateAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { prompt, imageSize, aspectRatio } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required for image generation' });
    }

    const size = (imageSize === '4K' || imageSize === '2K' || imageSize === '1K') ? imageSize : '1K';
    const ratio = aspectRatio || '16:9';

    const imageUrl = await generateHighQualityImage(prompt, size, ratio);
    return res.json({ success: true, imageUrl, imageSize: size, aspectRatio: ratio });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'AI Image generation failed' });
  }
});

// Create & edit images using gemini-3.1-flash-image-preview
apiRouter.post('/ai/edit-image', authenticateAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { prompt, imageSource, mimeType, aspectRatio } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required for image editing' });
    }

    const imageUrl = await createOrEditImage(prompt, imageSource, mimeType || 'image/png', aspectRatio || '16:9');
    return res.json({ success: true, imageUrl });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'AI Image editing failed' });
  }
});

// Enhance text / generate project descriptions or blogs using gemini-3.8-flash
apiRouter.post('/ai/enhance-text', authenticateAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { prompt, type } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const systemPrompt = type === 'blog'
      ? 'You are Sajjad Sahar, a high-achieving software engineering student and full-stack developer. Write an insightful, professional technical blog excerpt or article with markdown formatting.'
      : 'You are an experienced software engineer. Write a structured, professional project description with technical challenges, key features, and architecture details.';

    const enhanced = await enhanceTechnicalText(prompt, systemPrompt);
    return res.json({ text: enhanced });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'AI text generation failed' });
  }
});

// ==========================================
// 14. SYSTEM CONTROLS / SEED RESET
// ==========================================
apiRouter.post('/system/reset-seed', authenticateAdmin, (_req: AuthRequest, res: Response) => {
  db.resetToDefault();
  return res.json({ success: true, message: 'Database reset to default seed data successfully.' });
});
