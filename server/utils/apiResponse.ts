import { Response } from 'express';

export function sendSuccess<T = any>(
  res: Response, 
  data: T, 
  message?: string, 
  statusCode = 200
) {
  return res.status(statusCode).json({
    success: true,
    ...(message ? { message } : {}),
    ...(data !== undefined ? (typeof data === 'object' && data !== null && !Array.isArray(data) && ('data' in data || 'token' in data || 'user' in data) ? data : { data }) : {})
  });
}

export function sendError(
  res: Response, 
  message: string, 
  statusCode = 500, 
  details?: any
) {
  return res.status(statusCode).json({
    success: false,
    error: message,
    ...(details ? { details } : {})
  });
}
