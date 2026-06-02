import type { User } from '@/types/auth';

import { apiClient } from './api/client';

export const profileService = {
  async getProfile() {
    try {
      const { data } = await apiClient.get<User>('/auth/me');
      return data;
    } catch {
      return { id: 'user-1', name: 'FAATTSOO Guest', email: 'guest@faattsoo.local' };
    }
  },
  async updateProfile(profile: Partial<User>) {
    try {
      const { data } = await apiClient.put<User>('/profile', profile);
      return data;
    } catch {
      return { id: 'user-1', name: profile.name ?? 'FAATTSOO Guest', email: profile.email ?? 'guest@faattsoo.local' };
    }
  },
};
