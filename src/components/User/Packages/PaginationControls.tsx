import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/User/button";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {/* Previous Button */}
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outline"
        className="flex items-center gap-1"
        style={{
          borderColor: "#D4A574",
          color: currentPage === 1 ? "#8B6F47" : "#7C5A3B",
        }}
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </Button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) => {
        if (page === "...") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="px-3 py-2"
              style={{ color: "#8B6F47" }}
            >
              ...
            </span>
          );
        }

        const pageNum = page as number;
        const isActive = pageNum === currentPage;

        return (
          <Button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className="min-w-10"
            style={{
              backgroundColor: isActive ? "#D4A574" : "transparent",
              color: isActive ? "#FFFFFF" : "#7C5A3B",
              borderColor: "#D4A574",
            }}
            variant={isActive ? "default" : "outline"}
          >
            {pageNum}
          </Button>
        );
      })}

      {/* Next Button */}
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="outline"
        className="flex items-center gap-1"
        style={{
          borderColor: "#D4A574",
          color: currentPage === totalPages ? "#8B6F47" : "#7C5A3B",
        }}
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </Button>

      {/* Page Info */}
      <div className="ml-4 text-sm" style={{ color: "#8B6F47" }}>
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};





