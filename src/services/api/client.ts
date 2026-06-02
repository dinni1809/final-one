import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { secureStorage } from "@/utils/secureStorage";

import { storageKeys } from "@/constants/storageKeys";

const baseURL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:5000/api";

export const apiClient = axios.create({
  baseURL,
  timeout: 15000,
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await secureStorage.getItemAsync(storageKeys.accessToken);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const message =
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message ??
      "Something went wrong";
    return Promise.reject(new Error(message));
  },
);
