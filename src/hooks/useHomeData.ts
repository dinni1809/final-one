import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/constants/queryKeys';
import { offerService } from '@/services/offerService';
import { restaurantService } from '@/services/restaurantService';

export const useTopOffers = () =>
  useQuery({
    queryKey: queryKeys.offers,
    queryFn: offerService.getTopOffers,
  });

export const useTrendingRestaurants = () =>
  useQuery({
    queryKey: queryKeys.topRated,
    queryFn: restaurantService.getTopRated,
  });

export const useFeaturedRestaurants = () =>
  useQuery({
    queryKey: queryKeys.featured,
    queryFn: restaurantService.getFeatured,
  });
