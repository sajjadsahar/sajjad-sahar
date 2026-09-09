import { UserAuth } from '../types.js';
import { API_BASE, getAuthHeaders, handleApiResponse } from './apiClient.js';

export async function loginAdmin(usernameOrEmail: string, password: string): Promise<{ token: string; user: UserAuth }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usernameOrEmail, password })
  });
  return handleApiResponse(res, 'Authentication failed');
}

export async function verifyAdminAuth(): Promise<{ user: UserAuth }> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: getAuthHeaders()
  });
  return handleApiResponse(res, 'Failed to verify admin authentication');
}

export async function updateAdminCredentials(payload: {
  username?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}): Promise<{ success: boolean; message: string; user: UserAuth }> {
  const res = await fetch(`${API_BASE}/auth/update-credentials`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload)
  });
  return handleApiResponse(res, 'Failed to update credentials');
}
