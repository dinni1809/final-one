import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const isWeb = Platform.OS === "web";

const webStorage = {
  async getItemAsync(key: string): Promise<string | null> {
    return Promise.resolve(localStorage.getItem(key));
  },

  async setItemAsync(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value);
    return Promise.resolve();
  },

  async deleteItemAsync(key: string): Promise<void> {
    localStorage.removeItem(key);
    return Promise.resolve();
  },
};

export const secureStorage = {
  getItemAsync: async (key: string) =>
    isWeb ? webStorage.getItemAsync(key) : SecureStore.getItemAsync(key),
  setItemAsync: async (key: string, value: string) =>
    isWeb
      ? webStorage.setItemAsync(key, value)
      : SecureStore.setItemAsync(key, value),
  deleteItemAsync: async (key: string) =>
    isWeb ? webStorage.deleteItemAsync(key) : SecureStore.deleteItemAsync(key),
};
