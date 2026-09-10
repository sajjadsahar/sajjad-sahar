import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

// Memory storage keeps file buffers for Cloudinary or disk streaming
const storage = multer.memoryStorage();

const allowedMimes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf'
];

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const ext = file.originalname.toLowerCase();
  const isExtAllowed = ext.endsWith('.jpg') || ext.endsWith('.jpeg') || ext.endsWith('.png') || ext.endsWith('.webp') || ext.endsWith('.pdf');
  const isMimeAllowed = allowedMimes.includes(file.mimetype) || (ext.endsWith('.pdf') && file.mimetype.includes('pdf'));

  if (isExtAllowed || isMimeAllowed) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only JPG, JPEG, PNG, WEBP images and PDF documents are allowed.'));
  }
};

export const certificateUpload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB limit
  },
  fileFilter
});

/**
 * Middleware that handles multipart/form-data with field names
 * 'certificateDocument' or 'file', or safely passes JSON requests through.
 */
export function handleCertificateUpload(req: Request, res: Response, next: NextFunction) {
  const contentType = req.headers['content-type'] || '';
  if (!contentType.includes('multipart/form-data')) {
    // If request is application/json or urlencoded, skip multer
    return next();
  }

  const upload = certificateUpload.fields([
    { name: 'certificateDocument', maxCount: 1 },
    { name: 'file', maxCount: 1 }
  ]);

  upload(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File is too large. Maximum size allowed is 20MB.' });
      }
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: err.message || 'File upload failed' });
    }

    // Normalize req.file from fields
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files['certificateDocument'] && files['certificateDocument'][0]) {
        req.file = files['certificateDocument'][0];
      } else if (files['file'] && files['file'][0]) {
        req.file = files['file'][0];
      }
    }

    next();
  });
}

/**
 * Legacy JSON/base64 payload validation
 */
export function validateUploadPayload(req: Request, res: Response, next: NextFunction) {
  const { base64Data } = req.body;
  if (!base64Data) {
    return res.status(400).json({ error: 'base64Data is required for file upload' });
  }

  if (typeof base64Data === 'string' && base64Data.length > 50 * 1024 * 1024) {
    return res.status(413).json({ error: 'Payload too large (exceeds 50MB)' });
  }

  next();
}
