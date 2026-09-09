import { Request, Response } from 'express';
import { db } from '../config/database.js';
import { AuthRequest } from '../middleware/authenticateAdmin.js';

export function getCertificates(req: Request, res: Response) {
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
}

export function getCertificateById(req: Request, res: Response) {
  const cert = db.getCertificates().find(c => c.id === req.params.id);
  if (!cert) {
    return res.status(404).json({ error: 'Certificate not found' });
  }
  db.incrementCertificateViews(cert.id);
  return res.json(cert);
}

export function createCertificate(req: AuthRequest, res: Response) {
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
}

export function updateCertificate(req: AuthRequest, res: Response) {
  try {
    const updated = db.updateCertificate(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to update certificate' });
  }
}

export function deleteCertificate(req: AuthRequest, res: Response) {
  const deleted = db.deleteCertificate(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Certificate not found' });
  }
  return res.json({ success: true, message: 'Certificate deleted successfully' });
}
