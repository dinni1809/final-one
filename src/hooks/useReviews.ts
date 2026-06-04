import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";
import { reviewService } from "@/services/reviewService";
import type { Review, ReviewPayload } from "@/types/restaurant";

export const useReviews = (restaurantId: string, sort?: string) =>
  useQuery<Review[]>({
    queryKey: [...queryKeys.reviews(restaurantId), sort],
    queryFn: () => reviewService.getReviews(restaurantId, sort),
  });

export const useSubmitReview = (restaurantId: string) => {
  const queryClient = useQueryClient();

  return useMutation<Review, Error, ReviewPayload>({
    mutationFn: (payload: ReviewPayload) =>
      reviewService.createReview(restaurantId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews(restaurantId),
      });
      queryClient.invalidateQueries({
        queryKey: ["rating-summary", restaurantId],
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.restaurantDetails(restaurantId),
      });
    },
  });
};
