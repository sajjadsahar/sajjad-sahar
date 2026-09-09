import { Project } from '../types.js';
import { API_BASE, getAuthHeaders, handleApiResponse } from './apiClient.js';

export async function fetchProjects(params?: { category?: string; search?: string; featured?: boolean }): Promise<Project[]> {
  const query = new URLSearchParams();
  if (params?.category) query.append('category', params.category);
  if (params?.search) query.append('search', params.search);
  if (params?.featured !== undefined) query.append('featured', String(params.featured));

  const res = await fetch(`${API_BASE}/projects?${query.toString()}`);
  return handleApiResponse(res, 'Failed to fetch projects');
}

export async function fetchProject(idOrSlug: string): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects/${idOrSlug}`);
  return handleApiResponse(res, 'Failed to fetch project');
}

export async function createProject(data: Partial<Project>): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return handleApiResponse(res, 'Failed to create project');
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return handleApiResponse(res, 'Failed to update project');
}

export async function deleteProject(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return handleApiResponse(res, 'Failed to delete project');
}
