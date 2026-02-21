import React from "react";
import { Heart } from "lucide-react";
import { useWishlistStatus, useAddToWishlist, useRemoveFromWishlist } from "@/hooks/User/useWishlist";

interface WishlistHeartProps {
  packageId: string;
  className?: string;
  size?: number;
}

/**
 * Reusable WishlistHeart component for adding/removing packages from bucket list
 * Displays a red heart when the package is wishlisted
 */
export const WishlistHeart: React.FC<WishlistHeartProps> = ({
  packageId,
  className = "",
  size = 20,
}) => {
  const { data: wishlistStatus } = useWishlistStatus(packageId);
  const isInWishlist = wishlistStatus?.isInWishlist || false;

  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();

  const isLoading =
    addToWishlistMutation.isPending || removeFromWishlistMutation.isPending;

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent card click events
    if (isInWishlist) {
      removeFromWishlistMutation.mutate(packageId);
    } else {
      addToWishlistMutation.mutate(packageId);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`p-2 rounded-full transition-all ${
        isInWishlist
          ? "bg-white/90 backdrop-blur-md text-red-500"
          : "bg-white/20 backdrop-blur-md text-white hover:bg-white/30"
      } ${className}`}
      aria-label={isInWishlist ? "Remove from bucket list" : "Add to bucket list"}
    >
      <Heart
        className={`transition-all ${
          isInWishlist ? "fill-red-500 text-red-500" : ""
        }`}
        style={{ width: size, height: size }}
      />
    </button>
  );
};
