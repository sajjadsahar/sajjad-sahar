import { Request, Response, NextFunction } from 'express';

export function validateUploadPayload(req: Request, res: Response, next: NextFunction) {
  const { base64Data, filename } = req.body;
  if (!base64Data) {
    return res.status(400).json({ error: 'base64Data is required for file upload' });
  }

  // Ensure base64 string doesn't exceed ~50MB limit
  if (typeof base64Data === 'string' && base64Data.length > 50 * 1024 * 1024) {
    return res.status(413).json({ error: 'Payload too large (exceeds 50MB)' });
  }

  next();
}
