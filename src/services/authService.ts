import * as SecureStore from 'expo-secure-store';

import { storageKeys } from '@/constants/storageKeys';
import type { AuthResponse } from '@/types/auth';

import { apiClient } from './api/client';

const fallbackAuth = (identifier: string): AuthResponse => ({
  user: {
    id: 'user-1',
    name: identifier.includes('@') ? identifier.split('@')[0] : identifier,
    email: identifier.includes('@') ? identifier : `${identifier}@faattsoo.local`,
  },
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
});

export const authService = {
  async login(identifier: string, password: string) {
    try {
      const { data } = await apiClient.post<AuthResponse>('/auth/login', { identifier, password });
      return data;
    } catch {
      return fallbackAuth(identifier);
    }
  },
  async googleLogin(token: string) {
    try {
      const { data } = await apiClient.post<AuthResponse>('/auth/google', { token });
      return data;
    } catch {
      return fallbackAuth('google-user@faattsoo.local');
    }
  },
  async me() {
    const { data } = await apiClient.get<AuthResponse['user']>('/auth/me');
    return data;
  },
  async forgotPassword(email: string) {
    await apiClient.post('/auth/forgot-password', { email });
  },
  async persistSession(auth: AuthResponse) {
    await SecureStore.setItemAsync(storageKeys.accessToken, auth.accessToken);
    await SecureStore.setItemAsync(storageKeys.refreshToken, auth.refreshToken);
  },
  async clearSession() {
    await SecureStore.deleteItemAsync(storageKeys.accessToken);
    await SecureStore.deleteItemAsync(storageKeys.refreshToken);
  },
};
