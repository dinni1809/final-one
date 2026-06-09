import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/adminService";

export const useAdminOffers = () => {
  return useQuery<any[]>({
    queryKey: ["admin-offers"],
    queryFn: () => adminService.getOffers(),
  });
};

export const useAdminReviews = () => {
  return useQuery<any[]>({
    queryKey: ["admin-reviews"],
    queryFn: () => adminService.getReviews(),
  });
};

export const useAdminRestaurantMutations = () => {
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: (data: any) => adminService.addRestaurant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
    },
  });

  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminService.editRestaurant(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
      queryClient.invalidateQueries({ queryKey: ["restaurant-details", variables.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteRestaurant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
    },
  });

  return { addMutation, editMutation, deleteMutation };
};

export const useAdminMenuItemMutations = () => {
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: (data: any) => adminService.addMenuItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu"] });
    },
  });

  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminService.editMenuItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteMenuItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu"] });
    },
  });

  return { addMutation, editMutation, deleteMutation };
};

export const useAdminOfferMutations = () => {
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: (data: any) => adminService.addOffer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-offers"] });
      queryClient.invalidateQueries({ queryKey: ["offers"] });
    },
  });

  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminService.editOffer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-offers"] });
      queryClient.invalidateQueries({ queryKey: ["offers"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteOffer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-offers"] });
      queryClient.invalidateQueries({ queryKey: ["offers"] });
    },
  });

  return { addMutation, editMutation, deleteMutation };
};

export const useAdminReviewMutations = () => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["rating-summary"] });
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
    },
  });

  return { deleteMutation };
};
