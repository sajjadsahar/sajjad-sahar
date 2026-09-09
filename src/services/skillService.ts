import { Skill } from '../types.js';
import { API_BASE, getAuthHeaders, handleApiResponse } from './apiClient.js';

export async function fetchSkills(category?: string): Promise<Skill[]> {
  const url = category && category !== 'All' ? `${API_BASE}/skills?category=${encodeURIComponent(category)}` : `${API_BASE}/skills`;
  const res = await fetch(url);
  return handleApiResponse(res, 'Failed to fetch skills');
}

export async function createSkill(data: Partial<Skill>): Promise<Skill> {
  const res = await fetch(`${API_BASE}/skills`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return handleApiResponse(res, 'Failed to create skill');
}

export async function updateSkill(id: string, data: Partial<Skill>): Promise<Skill> {
  const res = await fetch(`${API_BASE}/skills/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return handleApiResponse(res, 'Failed to update skill');
}

export async function deleteSkill(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/skills/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return handleApiResponse(res, 'Failed to delete skill');
}
