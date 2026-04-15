import { Platform } from 'react-native';

const TOKEN_KEY = 'cortecerto.mobile.authToken';
const USER_KEY = 'cortecerto.mobile.authUser';

let memoryToken: string | null = null;
let memoryUser: unknown = null;

function hasLocalStorage() {
  return Platform.OS === 'web' && typeof window !== 'undefined' && Boolean(window.localStorage);
}

export async function getStoredToken() {
  if (hasLocalStorage()) {
    return window.localStorage.getItem(TOKEN_KEY);
  }

  return memoryToken;
}

export async function getStoredUser<T = unknown>() {
  if (hasLocalStorage()) {
    const value = window.localStorage.getItem(USER_KEY);
    return value ? (JSON.parse(value) as T) : null;
  }

  return memoryUser as T | null;
}

export async function storeSession(token: string, user: unknown) {
  memoryToken = token;
  memoryUser = user;

  if (hasLocalStorage()) {
    window.localStorage.setItem(TOKEN_KEY, token);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export async function clearSession() {
  memoryToken = null;
  memoryUser = null;

  if (hasLocalStorage()) {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  }
}
