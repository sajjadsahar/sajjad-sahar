import { Blog } from '../types.js';
import { API_BASE, getAuthHeaders, handleApiResponse } from './apiClient.js';

export async function fetchBlogs(params?: { all?: boolean; category?: string; search?: string }): Promise<Blog[]> {
  const query = new URLSearchParams();
  if (params?.all) query.append('all', 'true');
  if (params?.category) query.append('category', params.category);
  if (params?.search) query.append('search', params.search);

  const res = await fetch(`${API_BASE}/blogs?${query.toString()}`);
  return handleApiResponse(res, 'Failed to fetch blogs');
}

export async function fetchBlog(idOrSlug: string): Promise<Blog> {
  const res = await fetch(`${API_BASE}/blogs/${idOrSlug}`);
  return handleApiResponse(res, 'Failed to fetch blog');
}

export async function createBlog(data: Partial<Blog>): Promise<Blog> {
  const res = await fetch(`${API_BASE}/blogs`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return handleApiResponse(res, 'Failed to create blog');
}

export async function updateBlog(id: string, data: Partial<Blog>): Promise<Blog> {
  const res = await fetch(`${API_BASE}/blogs/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return handleApiResponse(res, 'Failed to update blog');
}

export async function deleteBlog(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/blogs/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return handleApiResponse(res, 'Failed to delete blog');
}
