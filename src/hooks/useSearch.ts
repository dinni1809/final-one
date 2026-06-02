import { useQuery } from '@tanstack/react-query';

import { restaurantService } from '@/services/restaurantService';

export const useSearchRestaurants = (query: string) =>
  useQuery({
    queryKey: ['restaurant-search', query],
    queryFn: () => restaurantService.search(query),
    enabled: query.trim().length > 1,
  });
