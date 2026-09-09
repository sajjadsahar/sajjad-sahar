import { Certificate } from '../types.js';
import { API_BASE, getAuthHeaders, handleApiResponse } from './apiClient.js';

export async function fetchCertificates(params?: { category?: string; search?: string; sort?: string; featured?: boolean }): Promise<Certificate[]> {
  const query = new URLSearchParams();
  if (params?.category) query.append('category', params.category);
  if (params?.search) query.append('search', params.search);
  if (params?.sort) query.append('sort', params.sort);
  if (params?.featured !== undefined) query.append('featured', String(params.featured));

  const res = await fetch(`${API_BASE}/certificates?${query.toString()}`);
  return handleApiResponse(res, 'Failed to fetch certificates');
}

export async function fetchCertificate(id: string): Promise<Certificate> {
  const res = await fetch(`${API_BASE}/certificates/${id}`);
  return handleApiResponse(res, 'Failed to fetch certificate');
}

export async function createCertificate(data: Partial<Certificate>): Promise<Certificate> {
  const res = await fetch(`${API_BASE}/certificates`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return handleApiResponse(res, 'Failed to create certificate');
}

export async function updateCertificate(id: string, data: Partial<Certificate>): Promise<Certificate> {
  const res = await fetch(`${API_BASE}/certificates/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return handleApiResponse(res, 'Failed to update certificate');
}

export async function deleteCertificate(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/certificates/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return handleApiResponse(res, 'Failed to delete certificate');
}
