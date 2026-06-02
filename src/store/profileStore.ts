import { create } from 'zustand';

import { profileService } from '@/services/profileService';
import type { User } from '@/types/auth';

type ProfileState = {
  profile: User | null;
  loadProfile: () => Promise<void>;
};

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  async loadProfile() {
    const profile = await profileService.getProfile();
    set({ profile });
  },
}));
