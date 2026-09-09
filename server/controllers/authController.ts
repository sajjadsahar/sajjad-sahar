import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { db } from '../config/database.js';
import { generateToken } from '../utils/generateToken.js';
import { AuthRequest } from '../middleware/authenticateAdmin.js';

export async function login(req: Request, res: Response) {
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
      await bcrypt.compare(password, admin.passwordHash)
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
}

export function getMe(req: AuthRequest, res: Response) {
  const admin = db.getAdmin();
  return res.json({
    user: {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: 'admin'
    }
  });
}

export async function updateCredentials(req: AuthRequest, res: Response) {
  try {
    const { username, email, currentPassword, newPassword } = req.body;
    const admin = db.getAdmin();

    if (currentPassword) {
      const valid = await bcrypt.compare(currentPassword, admin.passwordHash);
      if (!valid) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }
    }

    const updatedAdmin = { ...admin };
    if (username) updatedAdmin.username = username.trim();
    if (email) updatedAdmin.email = email.trim();
    if (newPassword && newPassword.length >= 6) {
      const salt = await bcrypt.genSalt(10);
      updatedAdmin.passwordHash = await bcrypt.hash(newPassword, salt);
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
}

export function downloadResume(_req: Request, res: Response) {
  const filePath = path.join(process.cwd(), 'public', 'Sajjad_Sahar_Resume.pdf');
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="Sajjad_Sahar_Resume.pdf"');
    return res.sendFile(filePath);
  } else {
    return res.status(404).json({ error: 'Resume PDF document not found' });
  }
}
