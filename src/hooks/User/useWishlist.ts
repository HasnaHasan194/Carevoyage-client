import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wishlistService } from "@/services/user/wishlistService";
import toast from "react-hot-toast";

/**
 * Hook to get user's bucket list
 */
export const useWishlist = (page?: number, limit?: number) => {
  return useQuery({
    queryKey: ["wishlist", page, limit],
    queryFn: () => wishlistService.getWishlist(page, limit),
  });
};

/**
 * Hook to add a package to bucket list
 */
export const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (packageId: string) => wishlistService.addToWishlist(packageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["wishlistStatus"] });
      toast.success("Package added to bucket list successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to add package to bucket list";
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook to remove a package from bucket list
 */
export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (packageId: string) =>
      wishlistService.removeFromWishlist(packageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["wishlistStatus"] });
      toast.success("Package removed from bucket list successfully");
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to remove package from bucket list";
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook to check if a package is in the bucket list
 */
export const useWishlistStatus = (packageId: string | undefined) => {
  return useQuery({
    queryKey: ["wishlistStatus", packageId],
    queryFn: () => {
      if (!packageId) throw new Error("Package ID is required");
      return wishlistService.checkWishlistStatus(packageId);
    },
    enabled: !!packageId,
  });
};
