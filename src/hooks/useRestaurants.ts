import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/constants/queryKeys';
import { restaurantService } from '@/services/restaurantService';
import type { RestaurantFilters } from '@/types/restaurant';

export const useRestaurants = (filters?: RestaurantFilters) =>
  useQuery({
    queryKey: [...queryKeys.restaurants, filters],
    queryFn: () => restaurantService.getRestaurants(filters),
  });

export const useRestaurantDetails = (restaurantId: string) =>
  useQuery({
    queryKey: queryKeys.restaurantDetails(restaurantId),
    queryFn: () => restaurantService.getRestaurantById(restaurantId),
  });
