import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { clearSession, getStoredToken, storeSession } from './tokenStore';

type RequestOptions = RequestInit & {
  auth?: boolean;
};

export type AuthUser = {
  id: number;
  nome: string;
  email: string;
  telefone?: string | null;
  papel: string;
};

export type AuthPayload = {
  token: string;
  expiresAt: string;
  usuario: AuthUser;
};

const DEFAULT_WEB_API_URL = '/api';
const DEFAULT_NATIVE_API_URL = 'http://172.29.36.10:3000/api';

function getApiBaseUrl() {
  const extra = Constants.expoConfig?.extra as { apiBaseUrl?: string } | undefined;
  return extra?.apiBaseUrl || process.env.EXPO_PUBLIC_API_BASE_URL || (Platform.OS === 'web' ? DEFAULT_WEB_API_URL : DEFAULT_NATIVE_API_URL);
}

function buildUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  const baseUrl = getApiBaseUrl().replace(/\/+$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || 'Não foi possível carregar os dados.');
  }

  return payload as T;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}) {
  const headers = new Headers(options.headers);
  const token = options.auth === false ? null : await getStoredToken();

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(buildUrl(path), {
    ...options,
    headers,
  });

  return parseResponse<T>(response);
}

export async function login(email: string, senha: string) {
  const payload = await apiFetch<AuthPayload>('/auth/login', {
    auth: false,
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  });
  await storeSession(payload.token, payload.usuario);
  return payload;
}

export async function register(data: { nome: string; email: string; telefone?: string; senha: string }) {
  const payload = await apiFetch<AuthPayload>('/auth/register', {
    auth: false,
    method: 'POST',
    body: JSON.stringify(data),
  });
  await storeSession(payload.token, payload.usuario);
  return payload;
}

export async function loadSession() {
  const token = await getStoredToken();
  if (!token) return null;

  try {
    const payload = await apiFetch<{ usuario: AuthUser }>('/auth/me');
    await storeSession(token, payload.usuario);
    return payload.usuario;
  } catch {
    await clearSession();
    return null;
  }
}

export async function logout() {
  try {
    await apiFetch('/auth/logout', { method: 'POST' });
  } finally {
    await clearSession();
  }
}
