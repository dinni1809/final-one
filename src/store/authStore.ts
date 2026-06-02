import { secureStorage } from "@/utils/secureStorage";
import { create } from "zustand";

import { storageKeys } from "@/constants/storageKeys";
import { authService } from "@/services/authService";
import type { User } from "@/types/auth";

type AuthState = {
  user: User | null;
  isHydrating: boolean;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  hydrate: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isHydrating: true,
  isAuthenticated: false,
  async login(identifier, password) {
    const auth = await authService.login(identifier, password);
    await authService.persistSession(auth);
    set({ user: auth.user, isAuthenticated: true });
  },
  async googleLogin() {
    const auth = await authService.googleLogin("expo-google-token");
    await authService.persistSession(auth);
    set({ user: auth.user, isAuthenticated: true });
  },
  async hydrate() {
    const token = await secureStorage.getItemAsync(storageKeys.accessToken);
    if (!token) {
      set({ isHydrating: false, isAuthenticated: false });
      return;
    }
    set({
      user: {
        id: "user-1",
        name: "FAATTSOO Guest",
        email: "guest@faattsoo.local",
      },
      isAuthenticated: true,
      isHydrating: false,
    });
  },
  async logout() {
    await authService.clearSession();
    set({ user: null, isAuthenticated: false });
  },
}));
