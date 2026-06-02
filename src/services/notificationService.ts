import { apiClient } from './api/client';

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  read: boolean;
};

const fallbackNotifications: AppNotification[] = [
  {
    id: 'n-1',
    title: 'New tables are trending',
    body: 'The Olive Bistro and Persian Darbar are among this week’s most loved dining experiences.',
    read: false,
  },
];

export const notificationService = {
  async getNotifications() {
    try {
      const { data } = await apiClient.get<AppNotification[]>('/notifications');
      return data;
    } catch {
      return fallbackNotifications;
    }
  },
  async markAllRead() {
    try {
      await apiClient.post('/notifications/read-all');
    } catch {
      return;
    }
  },
};
