import { CareVoyageBackend } from "../../api/instance";
import type { AxiosResponse } from "axios";
import type { BrowsePackage } from "../User/packageService";;

export interface WishlistItem {
  id: string;
  userId: string;
  packageId: string;
  package: BrowsePackage;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedWishlistResponse {
  wishlistItems: WishlistItem[];
  total: number;
  page: number;
  limit: number;
}

export interface WishlistStatusResponse {
  isInWishlist: boolean;
}

export const wishlistService = {
  /**
   * Add a package to the user's bucket list
   */
  addToWishlist: async (packageId: string): Promise<WishlistItem> => {
    const response: AxiosResponse<{
      success: boolean;
      data: WishlistItem;
      message: string;
    }> = await CareVoyageBackend.post("/user/wishlist", {
      packageId,
    });
    return response.data.data;
  },

  /**
   * Remove a package from the user's bucket list
   */
  removeFromWishlist: async (packageId: string): Promise<void> => {
    await CareVoyageBackend.delete(`/user/wishlist/${packageId}`);
  },

  /**
   * Get user's bucket list (with optional pagination)
   */
  getWishlist: async (
    page?: number,
    limit?: number
  ): Promise<WishlistItem[] | PaginatedWishlistResponse> => {
    const params = new URLSearchParams();
    if (page !== undefined) params.append("page", page.toString());
    if (limit !== undefined) params.append("limit", limit.toString());

    const queryString = params.toString();
    const url = `/user/wishlist${queryString ? `?${queryString}` : ""}`;

    const response: AxiosResponse<{
      success: boolean;
      data: WishlistItem[] | PaginatedWishlistResponse;
      message: string;
    }> = await CareVoyageBackend.get(url);
    return response.data.data;
  },

  /**
   * Check if a package is in the user's bucket list
   */
  checkWishlistStatus: async (
    packageId: string
  ): Promise<WishlistStatusResponse> => {
    const response: AxiosResponse<{
      success: boolean;
      data: WishlistStatusResponse;
      message: string;
    }> = await CareVoyageBackend.get(
      `/user/wishlist/${packageId}/status`
    );
    return response.data.data;
  },
};
