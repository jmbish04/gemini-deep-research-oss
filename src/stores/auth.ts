import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getAPIClient, initializeAPIClient } from '../utils/api-client';

export interface AuthStore {
  workerApiKey: string;
  isAuthenticated: boolean;
}

interface AuthActions {
  setWorkerApiKey: (apiKey: string) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

const AUTH_COOKIE_NAME = 'worker_api_key';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Strict; Secure`;
}

function getCookie(name: string): string | null {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`;
}

export const defaultAuthValues: AuthStore = {
  workerApiKey: '',
  isAuthenticated: false,
};

export const useAuthStore = create(
  persist<AuthStore & AuthActions>(
    (set, get) => ({
      ...defaultAuthValues,

      setWorkerApiKey: (apiKey: string) => {
        const trimmedKey = apiKey.trim();
        if (trimmedKey) {
          // Save to cookie
          setCookie(AUTH_COOKIE_NAME, trimmedKey, COOKIE_MAX_AGE);

          // Initialize API client
          initializeAPIClient(trimmedKey);

          set({
            workerApiKey: trimmedKey,
            isAuthenticated: true,
          });
        }
      },

      logout: () => {
        deleteCookie(AUTH_COOKIE_NAME);
        set(defaultAuthValues);
      },

      checkAuth: () => {
        const state = get();

        // First check if we have it in state
        if (state.isAuthenticated && state.workerApiKey) {
          initializeAPIClient(state.workerApiKey);
          return true;
        }

        // Check cookie
        const cookieKey = getCookie(AUTH_COOKIE_NAME);
        if (cookieKey) {
          initializeAPIClient(cookieKey);
          set({
            workerApiKey: cookieKey,
            isAuthenticated: true,
          });
          return true;
        }

        return false;
      },
    }),
    { name: 'auth' }
  )
);

// Initialize on module load
const authStore = useAuthStore.getState();
authStore.checkAuth();
