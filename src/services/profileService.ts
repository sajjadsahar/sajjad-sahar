import { 
  PortfolioData, 
  Profile, 
  Experience, 
  Achievement, 
  AnalyticsSummary, 
  GitHubRepo 
} from '../types.js';
import { API_BASE, getAuthHeaders, handleApiResponse } from './apiClient.js';

export async function fetchPortfolioData(): Promise<{ data: PortfolioData }> {
  const res = await fetch(`${API_BASE}/portfolio`);
  return handleApiResponse(res, 'Failed to fetch portfolio data');
}

export async function fetchProfile(): Promise<Profile> {
  const res = await fetch(`${API_BASE}/profile`);
  return handleApiResponse(res, 'Failed to fetch profile');
}

export async function updateProfile(data: Partial<Profile>): Promise<Profile> {
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return handleApiResponse(res, 'Failed to update profile');
}

export async function fetchExperience(): Promise<Experience[]> {
  const res = await fetch(`${API_BASE}/experience`);
  return handleApiResponse(res, 'Failed to fetch experience');
}

export async function createExperience(data: Partial<Experience>): Promise<Experience> {
  const res = await fetch(`${API_BASE}/experience`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return handleApiResponse(res, 'Failed to create experience');
}

export async function updateExperience(id: string, data: Partial<Experience>): Promise<Experience> {
  const res = await fetch(`${API_BASE}/experience/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return handleApiResponse(res, 'Failed to update experience');
}

export async function deleteExperience(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/experience/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return handleApiResponse(res, 'Failed to delete experience');
}

export async function fetchAchievements(): Promise<Achievement[]> {
  const res = await fetch(`${API_BASE}/achievements`);
  return handleApiResponse(res, 'Failed to fetch achievements');
}

export async function createAchievement(data: Partial<Achievement>): Promise<Achievement> {
  const res = await fetch(`${API_BASE}/achievements`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return handleApiResponse(res, 'Failed to create achievement');
}

export async function updateAchievement(id: string, data: Partial<Achievement>): Promise<Achievement> {
  const res = await fetch(`${API_BASE}/achievements/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return handleApiResponse(res, 'Failed to update achievement');
}

export async function deleteAchievement(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/achievements/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return handleApiResponse(res, 'Failed to delete achievement');
}

export async function fetchGitHubRepos(): Promise<{ username: string; repos: GitHubRepo[] }> {
  const res = await fetch(`${API_BASE}/github/repos`);
  return handleApiResponse(res, 'Failed to fetch GitHub repositories');
}

export async function fetchAnalytics(): Promise<AnalyticsSummary> {
  const res = await fetch(`${API_BASE}/analytics`, {
    headers: getAuthHeaders()
  });
  return handleApiResponse(res, 'Failed to fetch analytics');
}

export async function trackPageView(path: string): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/analytics/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path })
    });
    return res.json();
  } catch {
    return { success: false };
  }
}

export async function uploadAsset(base64Data: string, filename?: string, fileType?: 'image' | 'pdf'): Promise<{ success: boolean; url: string; fileType: string }> {
  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ base64Data, filename, fileType })
  });
  return handleApiResponse(res, 'Failed to upload asset');
}

export async function generateAIImage(prompt: string, imageSize: '1K' | '2K' | '4K' = '1K', aspectRatio = '16:9'): Promise<{ success: boolean; imageUrl: string }> {
  const res = await fetch(`${API_BASE}/ai/generate-image`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ prompt, imageSize, aspectRatio })
  });
  return handleApiResponse(res, 'Failed to generate image with Gemini');
}

export async function enhanceAIText(prompt: string, type: string = 'project'): Promise<{ text: string }> {
  const res = await fetch(`${API_BASE}/ai/enhance-text`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ prompt, type })
  });
  return handleApiResponse(res, 'Failed to enhance text with Gemini');
}

export async function resetDatabase(): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/system/reset-seed`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  return handleApiResponse(res, 'Failed to reset database');
}
