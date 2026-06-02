import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/constants/queryKeys';
import { menuService } from '@/services/menuService';
import type { MenuCategory } from '@/types/restaurant';

export const useMenu = (restaurantId: string, category: MenuCategory) =>
  useQuery({
    queryKey: [...queryKeys.menu(restaurantId), category],
    queryFn: () => menuService.getMenu(restaurantId, category),
  });
