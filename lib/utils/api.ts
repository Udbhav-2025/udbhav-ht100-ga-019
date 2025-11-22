import { authService } from '@/lib/services/auth.service';

/**
 * Make authenticated API request
 */
export async function authenticatedFetch(url: string, options: RequestInit = {}) {
  const token = await authService.getIdToken();
  
  if (!token) {
    throw new Error('Not authenticated. Please sign in.');
  }

  const headers: HeadersInit = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...(options.headers as HeadersInit),
  };

  return fetch(url, {
    ...options,
    headers,
  });
}

