import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserNavbar } from "@/components/User/UserNavbar";
import { UserFooter } from "@/components/User/UserFooter";
import { useWishlist } from "@/hooks/User/useWishlist";
import { useRemoveFromWishlist } from "@/hooks/User/useWishlist";
import { PackageCard } from "../Packages/PackageCard";
import { Loader2, Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/User/button";
import type { WishlistItem } from "@/services/User/wishlistService";
import { PaginationControls } from "../Packages/PaginationControls";

export const BucketListPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 6;
  const { data, isLoading, error } = useWishlist(page, limit);
  const removeFromWishlistMutation = useRemoveFromWishlist();

  const handleViewDetails = (packageId: string) => {
    navigate(`/client/packages/${packageId}`);
  };

  const handleRemoveFromWishlist = (packageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromWishlistMutation.mutate(packageId);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  
  const wishlistItems =
    data && "wishlistItems" in data ? data.wishlistItems : (data as WishlistItem[] | undefined) || [];
  const total = data && "total" in data ? data.total : wishlistItems.length;
  const totalPages = Math.ceil(total / limit);

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: "#FAF7F2" }}
      >
        <UserNavbar />
        <div className="flex-1 flex items-center justify-center pt-16">
          <div className="text-center">
            <Loader2
              className="w-12 h-12 animate-spin mx-auto mb-4"
              style={{ color: "#D4A574" }}
            />
            <p style={{ color: "#7C5A3B" }}>Loading your bucket list...</p>
          </div>
        </div>
        <UserFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: "#FAF7F2" }}
      >
        <UserNavbar />
        <div className="flex-1 flex items-center justify-center px-4 pt-16">
          <div className="text-center max-w-md">
            <p
              className="text-xl font-semibold mb-2"
              style={{ color: "#7C5A3B" }}
            >
              Error Loading Bucket List
            </p>
            <p className="text-sm mb-4" style={{ color: "#8B6F47" }}>
              {error instanceof Error ? error.message : "Failed to load your bucket list. Please try again."}
            </p>
            <Button
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: "#D4A574",
                color: "#FFFFFF",
              }}
            >
              Retry
            </Button>
          </div>
        </div>
        <UserFooter />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#FAF7F2" }}
    >
      <UserNavbar />

      <main className="flex-1 pt-16 pb-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-8 h-8" style={{ color: "#D4A574" }} />
              <h1
                className="text-4xl font-bold"
                style={{ color: "#7C5A3B" }}
              >
                My Bucket List
              </h1>
            </div>
            <p className="text-lg" style={{ color: "#8B6F47" }}>
              {total === 0
                ? "Start adding packages to your bucket list!"
                : `You have ${total} ${total === 1 ? "package" : "packages"} in your bucket list`}
            </p>
          </div>

          {/* Empty State */}
          {wishlistItems.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-24 h-24 mx-auto mb-6 opacity-20" style={{ color: "#D4A574" }} />
              <h2
                className="text-2xl font-semibold mb-2"
                style={{ color: "#7C5A3B" }}
              >
                Your bucket list is empty
              </h2>
              <p className="text-lg mb-6" style={{ color: "#8B6F47" }}>
                Start exploring packages and add them to your bucket list!
              </p>
              <Button
                onClick={() => navigate("/client/packages")}
                style={{
                  backgroundColor: "#D4A574",
                  color: "#FFFFFF",
                }}
              >
                Browse Packages
              </Button>
            </div>
          ) : (
            <>
              {/* Packages Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="relative group">
                    <div
                      className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Button
                        onClick={(e) => handleRemoveFromWishlist(item.packageId, e)}
                        disabled={removeFromWishlistMutation.isPending}
                        variant="outline"
                        size="sm"
                        className="rounded-full shadow-lg"
                        style={{
                          backgroundColor: "#FFFFFF",
                          borderColor: "#D4A574",
                          color: "#7C5A3B",
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div onClick={() => handleViewDetails(item.package.id)}>
                      <PackageCard
                        package={{
                          id: item.package.id,
                          agencyId: item.package.agencyId,
                          PackageName: item.package.PackageName,
                          description: item.package.description,
                          category: item.package.category,
                          tags: item.package.tags,
                          status: item.package.status,
                          meetingPoint: item.package.meetingPoint,
                          images: item.package.images,
                          maxGroupSize: item.package.maxGroupSize,
                          basePrice: item.package.basePrice,
                          startDate: typeof item.package.startDate === 'string' 
                            ? item.package.startDate 
                            : new Date(item.package.startDate).toISOString(),
                          endDate: typeof item.package.endDate === 'string'
                            ? item.package.endDate
                            : new Date(item.package.endDate).toISOString(),
                          inclusions: item.package.inclusions,
                          exclusions: item.package.exclusions,
                          createdAt: typeof item.package.createdAt === 'string'
                            ? item.package.createdAt
                            : new Date(item.package.createdAt).toISOString(),
                          updatedAt: typeof item.package.updatedAt === 'string'
                            ? item.package.updatedAt
                            : new Date(item.package.updatedAt).toISOString(),
                        }}
                        onViewDetails={handleViewDetails}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <PaginationControls
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </main>

      <UserFooter />
    </div>
  );
};
