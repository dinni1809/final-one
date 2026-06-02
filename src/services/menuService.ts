import { menuItems } from '@/data/mock/restaurants';
import type { MenuCategory } from '@/types/restaurant';

import { apiClient } from './api/client';

export const menuService = {
  async getMenu(restaurantId: string, category: MenuCategory = 'All') {
    try {
      const { data } = await apiClient.get<typeof menuItems>(`/menu/${restaurantId}`);
      return category === 'All' ? data : data.filter((item) => item.category === category);
    } catch {
      const items = menuItems.filter((item) => item.restaurantId === restaurantId);
      return category === 'All' ? items : items.filter((item) => item.category === category);
    }
  },
};
