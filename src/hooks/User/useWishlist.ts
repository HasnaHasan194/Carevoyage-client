import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wishlistService } from "@/services/User/wishlistService";
import toast from "react-hot-toast";

/**
 *  get user's bucket list
 */
export const useWishlist = (page?: number, limit?: number) => {
  return useQuery({
    queryKey: ["wishlist", page, limit],
    queryFn: () => wishlistService.getWishlist(page, limit),
  });
};

/**
 * add a package to bucket list
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
 *  remove a package from bucket list
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
 *  check if a package is in the bucket list
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
