import { ContactMessage } from '../types.js';
import { API_BASE, getAuthHeaders, handleApiResponse } from './apiClient.js';

export async function sendContactMessage(payload: { name: string; email: string; subject: string; message: string }): Promise<{ success: boolean; message: string; id: string }> {
  const res = await fetch(`${API_BASE}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleApiResponse(res, 'Failed to send message');
}

export async function fetchContactMessages(): Promise<ContactMessage[]> {
  const res = await fetch(`${API_BASE}/messages`, {
    headers: getAuthHeaders()
  });
  return handleApiResponse(res, 'Failed to fetch messages');
}

export async function toggleMessageRead(id: string, read = true): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/messages/${id}/read`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ read })
  });
  return handleApiResponse(res, 'Failed to update message status');
}

export async function deleteMessage(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/messages/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return handleApiResponse(res, 'Failed to delete message');
}
