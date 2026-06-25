import { request } from './client';

export interface AuthUser {
  id: string;
  username: string;
  email?: string | null;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  const result = await request<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  localStorage.setItem('cet4-token', result.token);
  return result;
}

export async function register(
  username: string,
  password: string,
  email?: string,
): Promise<AuthResponse> {
  const result = await request<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password, email }),
  });
  localStorage.setItem('cet4-token', result.token);
  return result;
}

export function logout(): void {
  localStorage.removeItem('cet4-token');
}
