import { Request, Response } from 'express';
import { db } from '../config/database.js';
import { AuthRequest } from '../middleware/authenticateAdmin.js';
import { isValidEmail, sanitizeString } from '../utils/validateInput.js';

export function sendMessage(req: Request, res: Response) {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields (name, email, subject, message) are required' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    const cleanName = sanitizeString(name, 100);
    const cleanEmail = sanitizeString(email, 100);
    const cleanSubject = sanitizeString(subject, 150);
    const cleanMessage = sanitizeString(message, 2000);

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
}

export function getMessages(_req: AuthRequest, res: Response) {
  return res.json(db.getMessages());
}

export function markMessageRead(req: AuthRequest, res: Response) {
  const read = req.body.read !== undefined ? Boolean(req.body.read) : true;
  const updated = db.markMessageRead(req.params.id, read);
  if (!updated) {
    return res.status(404).json({ error: 'Message not found' });
  }
  return res.json({ success: true });
}

export function deleteMessage(req: AuthRequest, res: Response) {
  const deleted = db.deleteMessage(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Message not found' });
  }
  return res.json({ success: true, message: 'Message deleted successfully' });
}
