import { create } from 'zustand';

type NotificationState = {
  unreadCount: number;
  markAllRead: () => void;
};

export const useNotificationStore = create<NotificationState>((set) => ({
  unreadCount: 1,
  markAllRead: () => set({ unreadCount: 0 }),
}));
