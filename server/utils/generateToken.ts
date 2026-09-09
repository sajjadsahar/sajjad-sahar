import jwt from 'jsonwebtoken';
import { config } from '../config/environment.js';
import { UserDTO } from '../models/User.js';

export function generateToken(payload: UserDTO): string {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });
}

export function verifyToken(token: string): UserDTO {
  return jwt.verify(token, config.jwtSecret) as UserDTO;
}
