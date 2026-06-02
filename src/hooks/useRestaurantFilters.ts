import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";
import { restaurantService } from "@/services/restaurantService";

export const useRestaurantFilters = () =>
  useQuery({
    queryKey: queryKeys.restaurantFilters,
    queryFn: () => restaurantService.getFilterOptions(),
  });
