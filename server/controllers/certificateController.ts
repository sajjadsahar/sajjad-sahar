import { Request, Response } from 'express';
import { db } from '../config/database.js';
import { AuthRequest } from '../middleware/authenticateAdmin.js';
import { 
  storeCertificateDocument, 
  storeBase64Document, 
  deleteCertificateDocument 
} from '../utils/storage.js';
import { Certificate } from '../models/Certificate.js';

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

/**
 * Upload certificate document standalone endpoint
 */
export async function uploadCertificateDocument(req: AuthRequest, res: Response) {
  try {
    if (req.file) {
      const stored = await storeCertificateDocument(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );
      return res.json({
        success: true,
        ...stored
      });
    }

    if (req.body.base64Data) {
      const stored = await storeBase64Document(
        req.body.base64Data,
        req.body.filename || 'certificate_document',
        req.body.fileType
      );
      return res.json({
        success: true,
        ...stored
      });
    }

    return res.status(400).json({ error: 'No file or base64Data provided for upload' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to upload document' });
  }
}

export async function createCertificate(req: AuthRequest, res: Response) {
  try {
    const { 
      title, 
      issuingOrganization, 
      issueDate, 
      expiryDate,
      certificateId, 
      fileUrl, 
      fileType, 
      skillsCovered, 
      description, 
      verificationUrl, 
      category, 
      featured 
    } = req.body;

    const finalOrg = issuingOrganization || req.body.issuer || req.body.organization;
    const finalCertId = certificateId || req.body.credentialId || `CERT-${Date.now()}`;

    if (!title || !finalOrg) {
      return res.status(400).json({ error: 'Title and issuing organization are required' });
    }

    let docUrl = fileUrl ? String(fileUrl).trim() : '';
    let docType: 'image' | 'pdf' = fileType === 'pdf' ? 'pdf' : 'image';
    let publicId = '';
    let originalName = '';

    // 1. If a file was uploaded in the multipart form, it takes primary precedence
    if (req.file) {
      const stored = await storeCertificateDocument(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );
      docUrl = stored.url;
      docType = stored.fileType;
      publicId = stored.publicId;
      originalName = stored.originalName;
    } else if (req.body.certificateDocument) {
      const doc = typeof req.body.certificateDocument === 'string'
        ? JSON.parse(req.body.certificateDocument)
        : req.body.certificateDocument;
      if (doc?.url) {
        docUrl = doc.url;
        docType = (doc.fileType || (doc.url.toLowerCase().includes('.pdf') ? 'pdf' : 'image')) as 'image' | 'pdf';
        publicId = doc.publicId || '';
        originalName = doc.originalName || '';
      }
    } else if (docUrl) {
      if (docUrl.toLowerCase().includes('.pdf') || docUrl.startsWith('data:application/pdf')) {
        docType = 'pdf';
      }
    }

    // Default placeholder only if absolutely nothing was provided
    if (!docUrl) {
      docUrl = 'https://images.unsplash.com/photo-1589330694653-dad6bc01cf0f?auto=format&fit=crop&w=1200&q=80';
      docType = 'image';
    }

    // Parse skillsCovered
    let parsedSkills: string[] = [];
    if (Array.isArray(skillsCovered)) {
      parsedSkills = skillsCovered;
    } else if (typeof skillsCovered === 'string') {
      try {
        const parsed = JSON.parse(skillsCovered);
        parsedSkills = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        parsedSkills = skillsCovered.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
    }

    const newCert = db.addCertificate({
      title: title.trim(),
      issuingOrganization: finalOrg.trim(),
      issueDate: issueDate || new Date().toISOString().substring(0, 10),
      expiryDate: expiryDate ? String(expiryDate).trim() : 'Never',
      certificateId: finalCertId.trim(),
      fileUrl: docUrl,
      fileType: docType,
      certificateDocument: {
        url: docUrl,
        publicId,
        fileType: docType,
        originalName
      },
      skillsCovered: parsedSkills,
      description: description ? String(description).trim() : '',
      verificationUrl: verificationUrl ? String(verificationUrl).trim() : '',
      category: category || 'Web Development',
      featured: String(featured) === 'true' || featured === true
    });

    return res.status(201).json(newCert);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to add certificate' });
  }
}

export async function updateCertificate(req: AuthRequest, res: Response) {
  try {
    const targetId = req.params.id || req.body?._id || req.body?.id;
    if (!targetId || targetId === 'undefined') {
      return res.status(400).json({ error: 'Valid certificate ID is required for update' });
    }

    const existing = db.getCertificates().find(c => c.id === targetId || (c as any)._id === targetId);
    if (!existing) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    const updates: Partial<Certificate> = { ...req.body };

    // 1. If a new file was uploaded, store it and update document fields
    if (req.file) {
      const stored = await storeCertificateDocument(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );
      updates.fileUrl = stored.url;
      updates.fileType = stored.fileType;
      updates.certificateDocument = {
        url: stored.url,
        publicId: stored.publicId,
        fileType: stored.fileType,
        originalName: stored.originalName
      };

      // Clean up previous Cloudinary asset if publicId changed
      if (existing.certificateDocument?.publicId && existing.certificateDocument.publicId !== stored.publicId) {
        deleteCertificateDocument(existing.certificateDocument.publicId).catch(() => {});
      }
    } else if (req.body.fileUrl && req.body.fileUrl !== existing.fileUrl) {
      // User entered or changed the document URL
      const newUrl = String(req.body.fileUrl).trim();
      const docType: 'image' | 'pdf' = (req.body.fileType === 'pdf' || newUrl.toLowerCase().includes('.pdf')) ? 'pdf' : 'image';
      updates.fileUrl = newUrl;
      updates.fileType = docType;
      updates.certificateDocument = {
        url: newUrl,
        publicId: '',
        fileType: docType
      };
    } else {
      // CRITICAL: Preserve existing document if no new file or URL is provided
      if (!updates.fileUrl && existing.fileUrl) {
        updates.fileUrl = existing.fileUrl;
      }
      if (!updates.fileType && existing.fileType) {
        updates.fileType = existing.fileType;
      }
      if (!updates.certificateDocument && existing.certificateDocument) {
        updates.certificateDocument = existing.certificateDocument;
      } else if (!updates.certificateDocument && existing.fileUrl) {
        updates.certificateDocument = {
          url: existing.fileUrl,
          publicId: '',
          fileType: existing.fileType || 'image'
        };
      }
    }

    const rawSkills = (req.body.skillsCovered ?? updates.skillsCovered) as unknown;
    if (typeof rawSkills === 'string') {
      try {
        const parsed = JSON.parse(rawSkills);
        updates.skillsCovered = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        updates.skillsCovered = rawSkills.split(',').map(s => s.trim()).filter(Boolean);
      }
    } else if (Array.isArray(rawSkills)) {
      updates.skillsCovered = rawSkills.map(s => String(s).trim()).filter(Boolean);
    }

    if (updates.featured !== undefined) {
      updates.featured = String(updates.featured) === 'true' || updates.featured === true;
    }

    if (updates.verificationUrl !== undefined) {
      updates.verificationUrl = String(updates.verificationUrl).trim();
    }

    const updated = db.updateCertificate(targetId, updates);
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to update certificate' });
  }
}

export function deleteCertificate(req: AuthRequest, res: Response) {
  try {
    const targetId = req.params.id || req.body?._id || req.body?.id;
    if (!targetId || targetId === 'undefined') {
      return res.status(400).json({ error: 'Valid certificate ID is required for deletion' });
    }

    const existing = db.getCertificates().find(c => c.id === targetId || (c as any)._id === targetId);
    if (!existing) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    if (existing.certificateDocument?.publicId) {
      deleteCertificateDocument(existing.certificateDocument.publicId).catch(() => {});
    }

    const deleted = db.deleteCertificate(targetId);
    if (!deleted) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    return res.json({ success: true, message: 'Certificate deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to delete certificate' });
  }
}
