import { useQuery } from '@tanstack/react-query';

import { ratingService } from '@/services/ratingService';

export const useRatingSummary = (restaurantId: string) =>
  useQuery({
    queryKey: ['rating-summary', restaurantId],
    queryFn: () => ratingService.getSummary(restaurantId),
  });
