export const PACKAGE_CATEGORIES = [
  "Sightseeing",
  "Adventure",
  "Cultural",
  "Spiritual",
  "Wellness",
  "Family",
  "Honeymoon",
  "Nature",
  "Heritage",
] as const;

export type PackageCategory = (typeof PACKAGE_CATEGORIES)[number];

export const isValidPackageCategory = (
  value: string
): value is PackageCategory => {
  return (PACKAGE_CATEGORIES as readonly string[]).includes(value);
};

