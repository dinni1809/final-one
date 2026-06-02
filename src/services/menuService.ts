import { menuItems } from '@/data/mock/restaurants';
import type { MenuCategory, MenuItem } from '@/types/restaurant';
import { getImageUri } from '@/utils/format';

import { apiClient } from './api/client';

type ApiEnvelope<T> = { success?: boolean; data: T };
type ApiMenuItem = Partial<MenuItem> & {
  _id?: string;
  restaurant?: string;
};

const unwrap = <T>(payload: T | ApiEnvelope<T>): T =>
  payload && typeof payload === 'object' && 'data' in payload ? (payload as ApiEnvelope<T>).data : (payload as T);

const normalizeMenuItem = (item: ApiMenuItem, restaurantId: string): MenuItem => ({
  id: item.id ?? item._id ?? item.name?.toLowerCase().replace(/\s+/g, '-') ?? 'menu-item',
  restaurantId: item.restaurantId ?? item.restaurant ?? restaurantId,
  name: item.name ?? 'Menu item',
  description: item.description ?? '',
  price: item.price ?? 0,
  category: (item.category as MenuItem['category']) ?? 'Mains',
  image: item.image ?? getImageUri('photo-1546069901-ba9599a7e63c', 620, 420),
  portions: item.portions ?? ['Regular'],
});

export const menuService = {
  async getMenu(restaurantId: string, category: MenuCategory = 'All') {
    try {
      const { data } = await apiClient.get<ApiEnvelope<ApiMenuItem[]> | ApiMenuItem[]>(`/menu/${restaurantId}`);
      const items = unwrap(data).map((item) => normalizeMenuItem(item, restaurantId));
      return category === 'All' ? items : items.filter((item) => item.category === category);
    } catch {
      const items = menuItems.filter((item) => item.restaurantId === restaurantId);
      return category === 'All' ? items : items.filter((item) => item.category === category);
    }
  },
};
