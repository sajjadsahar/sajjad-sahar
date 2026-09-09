export const API_BASE = '/api';

export function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('sajjad_portfolio_jwt');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export async function handleApiResponse<T>(res: Response, defaultErrorMessage = 'API request failed'): Promise<T> {
  if (!res.ok) {
    let errorMsg = defaultErrorMessage;
    try {
      const errorJson = await res.json();
      errorMsg = errorJson.error || errorJson.message || defaultErrorMessage;
    } catch {
      // Use status text if body not json
      errorMsg = `${defaultErrorMessage} (${res.status} ${res.statusText})`;
    }
    throw new Error(errorMsg);
  }
  return res.json();
}
