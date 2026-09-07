import { 
  PortfolioData,
  Profile, 
  Project, 
  Certificate, 
  Skill, 
  Experience, 
  Achievement, 
  Blog, 
  ContactMessage, 
  AnalyticsSummary, 
  GitHubRepo,
  UserAuth 
} from '../types.js';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('sajjad_portfolio_jwt');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

// 0. Full Portfolio Data
export async function fetchPortfolioData(): Promise<{ data: PortfolioData }> {
  const res = await fetch(`${API_BASE}/portfolio`);
  if (!res.ok) throw new Error('Failed to fetch portfolio data');
  return res.json();
}

// 1. Profile
export async function fetchProfile(): Promise<Profile> {
  const res = await fetch(`${API_BASE}/profile`);
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
}

export async function updateProfile(data: Partial<Profile>): Promise<Profile> {
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
}

// 2. Projects
export async function fetchProjects(params?: { category?: string; search?: string; featured?: boolean }): Promise<Project[]> {
  const query = new URLSearchParams();
  if (params?.category) query.append('category', params.category);
  if (params?.search) query.append('search', params.search);
  if (params?.featured !== undefined) query.append('featured', String(params.featured));

  const res = await fetch(`${API_BASE}/projects?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

export async function fetchProject(idOrSlug: string): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects/${idOrSlug}`);
  if (!res.ok) throw new Error('Failed to fetch project');
  return res.json();
}

export async function createProject(data: Partial<Project>): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create project');
  return res.json();
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update project');
  return res.json();
}

export async function deleteProject(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete project');
}

// 3. Certificates
export async function fetchCertificates(params?: { category?: string; search?: string; sort?: string; featured?: boolean }): Promise<Certificate[]> {
  const query = new URLSearchParams();
  if (params?.category) query.append('category', params.category);
  if (params?.search) query.append('search', params.search);
  if (params?.sort) query.append('sort', params.sort);
  if (params?.featured !== undefined) query.append('featured', String(params.featured));

  const res = await fetch(`${API_BASE}/certificates?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch certificates');
  return res.json();
}

export async function fetchCertificate(id: string): Promise<Certificate> {
  const res = await fetch(`${API_BASE}/certificates/${id}`);
  if (!res.ok) throw new Error('Failed to fetch certificate');
  return res.json();
}

export async function createCertificate(data: Partial<Certificate>): Promise<Certificate> {
  const res = await fetch(`${API_BASE}/certificates`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create certificate');
  return res.json();
}

export async function updateCertificate(id: string, data: Partial<Certificate>): Promise<Certificate> {
  const res = await fetch(`${API_BASE}/certificates/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update certificate');
  return res.json();
}

export async function deleteCertificate(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/certificates/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete certificate');
}

// 4. Skills
export async function fetchSkills(category?: string): Promise<Skill[]> {
  const query = category ? `?category=${encodeURIComponent(category)}` : '';
  const res = await fetch(`${API_BASE}/skills${query}`);
  if (!res.ok) throw new Error('Failed to fetch skills');
  return res.json();
}

export async function createSkill(data: Partial<Skill>): Promise<Skill> {
  const res = await fetch(`${API_BASE}/skills`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create skill');
  return res.json();
}

export async function updateSkill(id: string, data: Partial<Skill>): Promise<Skill> {
  const res = await fetch(`${API_BASE}/skills/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update skill');
  return res.json();
}

export async function deleteSkill(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/skills/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete skill');
}

// 5. Experience
export async function fetchExperience(): Promise<Experience[]> {
  const res = await fetch(`${API_BASE}/experience`);
  if (!res.ok) throw new Error('Failed to fetch experience');
  return res.json();
}

export async function createExperience(data: Partial<Experience>): Promise<Experience> {
  const res = await fetch(`${API_BASE}/experience`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create experience entry');
  return res.json();
}

export async function updateExperience(id: string, data: Partial<Experience>): Promise<Experience> {
  const res = await fetch(`${API_BASE}/experience/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update experience entry');
  return res.json();
}

export async function deleteExperience(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/experience/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete experience entry');
}

// 6. Achievements
export async function fetchAchievements(): Promise<Achievement[]> {
  const res = await fetch(`${API_BASE}/achievements`);
  if (!res.ok) throw new Error('Failed to fetch achievements');
  return res.json();
}

export async function createAchievement(data: Partial<Achievement>): Promise<Achievement> {
  const res = await fetch(`${API_BASE}/achievements`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create achievement');
  return res.json();
}

export async function updateAchievement(id: string, data: Partial<Achievement>): Promise<Achievement> {
  const res = await fetch(`${API_BASE}/achievements/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update achievement');
  return res.json();
}

export async function deleteAchievement(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/achievements/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete achievement');
}

// 7. Blogs
export async function fetchBlogs(params?: { all?: boolean; category?: string; search?: string }): Promise<Blog[]> {
  const query = new URLSearchParams();
  if (params?.all) query.append('all', 'true');
  if (params?.category) query.append('category', params.category);
  if (params?.search) query.append('search', params.search);

  const res = await fetch(`${API_BASE}/blogs?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch blogs');
  return res.json();
}

export async function fetchBlog(idOrSlug: string): Promise<Blog> {
  const res = await fetch(`${API_BASE}/blogs/${idOrSlug}`);
  if (!res.ok) throw new Error('Failed to fetch blog');
  return res.json();
}

export async function createBlog(data: Partial<Blog>): Promise<Blog> {
  const res = await fetch(`${API_BASE}/blogs`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create blog');
  return res.json();
}

export async function updateBlog(id: string, data: Partial<Blog>): Promise<Blog> {
  const res = await fetch(`${API_BASE}/blogs/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update blog');
  return res.json();
}

export async function deleteBlog(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/blogs/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete blog');
}

// 8. Messages
export async function sendContactMessage(data: { name: string; email: string; subject: string; message: string }) {
  const res = await fetch(`${API_BASE}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to submit contact message');
  return json;
}

export async function fetchMessages(): Promise<ContactMessage[]> {
  const res = await fetch(`${API_BASE}/messages`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch messages');
  return res.json();
}

export async function markMessageRead(id: string, read: boolean = true): Promise<void> {
  const res = await fetch(`${API_BASE}/messages/${id}/read`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ read })
  });
  if (!res.ok) throw new Error('Failed to update message status');
}

export async function toggleMessageRead(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/messages/${id}/toggle`, {
    method: 'PUT',
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    // fallback to markMessageRead
    return markMessageRead(id, true);
  }
}

export const fetchContactMessages = fetchMessages;

export async function deleteMessage(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/messages/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete message');
}

// 9. GitHub
export async function fetchGitHubRepos(): Promise<{ username: string; repos: GitHubRepo[] }> {
  const res = await fetch(`${API_BASE}/github/repos`);
  if (!res.ok) throw new Error('Failed to fetch GitHub repos');
  return res.json();
}

// 10. Analytics
export async function fetchAnalytics(): Promise<AnalyticsSummary> {
  const res = await fetch(`${API_BASE}/analytics`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}

export async function recordPageView(path: string = '/'): Promise<void> {
  try {
    await fetch(`${API_BASE}/analytics/view`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path })
    });
  } catch {
    // Non-blocking
  }
}

export const trackPageView = recordPageView;

// 11. Auth
export async function loginAdmin(usernameOrEmail: string, password: string): Promise<{ token: string; user: UserAuth }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usernameOrEmail, password })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Login failed');
  return json;
}

export async function verifyAdminAuth(): Promise<{ user: UserAuth }> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Unauthorized');
  return res.json();
}

export async function updateAdminCredentials(data: { username?: string; email?: string; currentPassword?: string; newPassword?: string }) {
  const res = await fetch(`${API_BASE}/auth/update-credentials`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update credentials');
  return json;
}

// 12. Upload & AI
export async function uploadAsset(base64Data: string, filename?: string, fileType?: string) {
  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ base64Data, filename, fileType })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Upload failed');
  return json;
}

export async function generateAIImage(prompt: string, aspectRatio: string = '16:9', imageSize: '1K' | '2K' | '4K' = '1K') {
  const res = await fetch(`${API_BASE}/ai/generate-image`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ prompt, imageSize, aspectRatio })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'AI Image generation failed');
  return json;
}

export async function editAIImage(prompt: string, imageSource?: string, mimeType?: string, aspectRatio: string = '16:9') {
  const res = await fetch(`${API_BASE}/ai/edit-image`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ prompt, imageSource, mimeType, aspectRatio })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'AI Image editing failed');
  return json;
}

export async function enhanceAIText(prompt: string, type: 'project' | 'blog' | 'bio' = 'project') {
  const res = await fetch(`${API_BASE}/ai/enhance-text`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ prompt, type })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'AI text enhancement failed');
  return json;
}

export async function resetDatabaseSeed() {
  const res = await fetch(`${API_BASE}/system/reset-seed`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to reset seed');
  return json;
}

export const resetDatabase = resetDatabaseSeed;
