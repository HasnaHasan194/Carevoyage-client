import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/User/button";
import { PackageTags } from "../PackageTags";

interface PackageHeroProps {
  images: string[];
  title: string;
  tagline?: string;
  tags: string[];
}

export const PackageHero: React.FC<PackageHeroProps> = ({
  images,
  title,
  tagline,
  tags,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div
        className="relative w-full h-125 md:h-150 flex items-center justify-center rounded-b-3xl overflow-hidden"
        style={{ backgroundColor: "#F5E6D3" }}
      >
        <span style={{ color: "#8B6F47" }}>No Image Available</span>
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
    <div className="relative w-full h-150 md:h-175 lg:h-200 xl:h-[850px] overflow-hidden">
      {/* Image with Parallax Effect */}
      <div className="absolute inset-0">
        <img
          src={images[currentIndex]}
          alt={`${title} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-700 ease-out scale-105 hover:scale-100"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/1200x600?text=No+Image";
          }}
        />
      </div>

      {/* Multi-layer Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/20 to-black/80" />
      <div className="absolute inset-0 bg-linear-to-r from-black/30 via-transparent to-black/30" />
      <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-linear-to-t from-black/90 via-black/60 to-transparent" />

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <Button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-3 opacity-90 hover:opacity-100 transition-opacity z-10"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              color: "#7C5A3B",
            }}
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-3 opacity-90 hover:opacity-100 transition-opacity z-10"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              color: "#7C5A3B",
            }}
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </>
      )}

      {/* Content Overlay with Modern Design */}
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16 xl:p-20 text-white">
        <div className="max-w-400 mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
          <div className="max-w-5xl">
            {/* Category Badge */}
            {tagline && (
              <div className="mb-4 inline-block">
                <span
                  className="px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-md border"
                  style={{
                    backgroundColor: "rgba(212, 165, 116, 0.2)",
                    borderColor: "rgba(212, 165, 116, 0.4)",
                    color: "#FFFFFF",
                  }}
                >
                  {tagline}
                </span>
              </div>
            )}

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="mb-6">
                <PackageTags tags={tags} variant="light" />
              </div>
            )}

            {/* Title with Gradient Text Effect */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 leading-tight">
              <span className="bg-clip-text text-transparent bg-linear-to-r from-white via-white to-amber-200 drop-shadow-2xl">
                {title}
              </span>
            </h1>

            {/* Decorative Line */}
            <div className="flex items-center gap-4 mb-4">
              <div
                className="h-1 rounded-full"
                style={{
                  width: "60px",
                  background: "linear-gradient(90deg, #D4A574, transparent)",
                }}
              />
              <div
                className="h-1 rounded-full flex-1"
                style={{
                  background: "linear-gradient(90deg, rgba(212, 165, 116, 0.5), transparent)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Image Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex ? "w-8" : "w-2"
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

