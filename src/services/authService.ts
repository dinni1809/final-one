import { secureStorage } from "@/utils/secureStorage";

import { storageKeys } from "@/constants/storageKeys";
import type { AuthResponse, User } from "@/types/auth";

import { apiClient } from "./api/client";

type ApiEnvelope<T> = { success?: boolean; data: T };
type ApiAuthResponse = {
  user: User;
  accessToken?: string;
  refreshToken?: string;
  token?: string;
};

const unwrap = <T>(payload: T | ApiEnvelope<T>): T =>
  payload && typeof payload === "object" && "data" in payload
    ? (payload as ApiEnvelope<T>).data
    : (payload as T);

const normalizeAuth = (payload: ApiAuthResponse): AuthResponse => ({
  user: payload.user,
  accessToken: payload.accessToken ?? payload.token ?? "",
  refreshToken: payload.refreshToken ?? "",
});

export const authService = {
  async login(identifier: string, password: string) {
    const { data } = await apiClient.post<ApiEnvelope<ApiAuthResponse>>(
      "/auth/login",
      {
        identifier,
        password,
      },
    );

    return normalizeAuth(unwrap(data));
  },

  async register(
    name: string,
    email: string,
    password: string,
    username: string,
  ) {
    const { data } = await apiClient.post<ApiEnvelope<ApiAuthResponse>>(
      "/auth/register",
      {
        name,
        username,
        email,
        password,
      },
    );

    return normalizeAuth(unwrap(data));
  },

  async googleLogin(token: string) {
    // Google login is not fully wired to a browser-based OAuth flow yet.
    // Keep the existing placeholder behavior if a token is not available.
    try {
      const { data } = await apiClient.post<ApiEnvelope<ApiAuthResponse>>(
        "/auth/google",
        {
          token,
        },
      );
      return normalizeAuth(unwrap(data));
    } catch {
      return {
        user: {
          id: "user-1",
          name: "FAATTSOO Guest",
          email: "guest@faattsoo.local",
        },
        accessToken: "",
        refreshToken: "",
      };
    }
  },

  async me() {
    const { data } =
      await apiClient.get<ApiEnvelope<{ user: User }>>("/auth/me");
    return unwrap(data).user;
  },

  async logout() {
    await apiClient.post("/auth/logout");
  },

  async forgotPassword(email: string) {
    await apiClient.post("/auth/forgot-password", { email });
  },

  async persistSession(auth: AuthResponse) {
    await secureStorage.setItemAsync(storageKeys.accessToken, auth.accessToken);
    if (auth.refreshToken) {
      await secureStorage.setItemAsync(
        storageKeys.refreshToken,
        auth.refreshToken,
      );
    }
  },

  async clearSession() {
    await secureStorage.deleteItemAsync(storageKeys.accessToken);
    await secureStorage.deleteItemAsync(storageKeys.refreshToken);
  },
};
