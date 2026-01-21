import { RegisterRequest, AuthResponse, LoginRequest } from "@/types/auth";
import { User } from "@/types/user";

export const API_URL = process.env.API_URL || 'http://localhost:5233';

export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
};

export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refreshToken');
};

export const setTokens = (tokens: { accessToken: string; refreshToken: string }) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('accessToken', tokens.accessToken);
  localStorage.setItem('refreshToken', tokens.refreshToken);
};

export const clearTokens = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

export const setUser = (user: User) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const getAuthHeaders = (): HeadersInit => {
  const token = getAccessToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Ошибка запроса');
  }
  return response.json();
};

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<AuthResponse>(response);
};

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<AuthResponse>(response);
};

export const refreshToken = async (): Promise<AuthResponse> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('Refresh token не найден');
  
  const response = await fetch(`${API_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  return handleResponse<AuthResponse>(response);
};

export const logout = async (): Promise<void> => {
  const refreshToken = getRefreshToken();
  const token = getAccessToken();
  if (refreshToken) {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization' : `Bearer ${token}` },
        body: JSON.stringify({ refreshToken }),
      });
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  }
  clearTokens();
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await authFetch(`${API_URL}/api/auth/me`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<User>(response);
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const authFetch = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
  let accessToken = getAccessToken();
  const userRefreshToken = getRefreshToken();

  if (accessToken && isTokenExpired(accessToken) && userRefreshToken) {
    try {
      const newTokens = await refreshToken();
      setTokens({
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
      });
      setUser(newTokens.user);
      accessToken = newTokens.accessToken;
    } catch (error) {
      clearTokens();
      throw new Error('Сессия истекла, пожалуйста, войдите снова');
    }
  }

  const headers = {
    ...init?.headers,
    'Content-Type': 'application/json',
    ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
  };

  return fetch(input, { ...init, headers });
};