import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/User/button";

interface PackageImageGalleryProps {
  images: string[];
  packageName: string;
}

export const PackageImageGallery: React.FC<PackageImageGalleryProps> = ({
  images,
  packageName,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div
        className="w-full h-full flex items-center justify-center rounded-t-xl md:rounded-l-xl md:rounded-t-none"
        style={{ backgroundColor: "#F5E6D3", minHeight: "240px" }}
      >
        <span style={{ color: "#8B6F47" }}>No Image</span>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full h-full min-h-60 rounded-t-xl md:rounded-l-xl md:rounded-t-none overflow-hidden">
      {/* Main Image */}
      <img
        src={images[currentIndex]}
        alt={`${packageName} - Image ${currentIndex + 1}`}
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            "https://via.placeholder.com/600x400?text=No+Image";
        }}
      />

      {/* Navigation Arrows (only show if more than 1 image) */}
      {images.length > 1 && (
        <>
          <Button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-2 opacity-80 hover:opacity-100 transition-opacity"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              color: "#7C5A3B",
            }}
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 opacity-80 hover:opacity-100 transition-opacity"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              color: "#7C5A3B",
            }}
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </>
      )}

      {/* Image Indicators (only show if more than 1 image) */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? "w-6" : ""
              }`}
              style={{
                backgroundColor:
                  index === currentIndex
                    ? "#FFFFFF"
                    : "rgba(255, 255, 255, 0.5)",
              }}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
