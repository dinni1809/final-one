import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";
import { reviewService } from "@/services/reviewService";
import type { Review, ReviewPayload } from "@/types/restaurant";

export const useReviews = (restaurantId: string) =>
  useQuery<Review[]>({
    queryKey: queryKeys.reviews(restaurantId),
    queryFn: () => reviewService.getReviews(restaurantId),
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
    },
  });
};
