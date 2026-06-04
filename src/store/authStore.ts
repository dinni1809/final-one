import { secureStorage } from "@/utils/secureStorage";
import { create } from "zustand";

import { storageKeys } from "@/constants/storageKeys";
import { authService } from "@/services/authService";
import { useFavoriteStore } from "@/store/favoriteStore";
import type { User } from "@/types/auth";

type AuthState = {
  user: User | null;
  isHydrating: boolean;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    username: string,
  ) => Promise<void>;
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
    set({ user: auth.user, isAuthenticated: true, isHydrating: false });
    await useFavoriteStore.getState().loadFavorites();
  },
  async register(name, email, password, username) {
    const auth = await authService.register(name, email, password, username);
    await authService.persistSession(auth);
    set({ user: auth.user, isAuthenticated: true, isHydrating: false });
    await useFavoriteStore.getState().loadFavorites();
  },
  async googleLogin() {
    const auth = await authService.googleLogin("expo-google-token");
    if (!auth.accessToken) {
      set({ user: null, isAuthenticated: false, isHydrating: false });
      return;
    }
    await authService.persistSession(auth);
    set({ user: auth.user, isAuthenticated: true, isHydrating: false });
  },
  async hydrate() {
    const token = await secureStorage.getItemAsync(storageKeys.accessToken);
    if (!token) {
      set({ isHydrating: false, isAuthenticated: false });
      return;
    }

    try {
      const user = await authService.me();
      set({ user, isAuthenticated: true, isHydrating: false });
      await useFavoriteStore.getState().loadFavorites();
    } catch {
      await authService.clearSession();
      set({ user: null, isAuthenticated: false, isHydrating: false });
    }
  },
  async logout() {
    try {
      await authService.logout();
    } catch {
      // ignore server logout failures and clear the local session anyway
    }
    await authService.clearSession();
    useFavoriteStore.setState({ restaurants: [], restaurantIds: [] });
    set({ user: null, isAuthenticated: false });
  },
}));
