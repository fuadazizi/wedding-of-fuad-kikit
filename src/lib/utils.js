import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Convert a hyphenated slug to a display name in Pascal Case with spaces.
 * @example slugToName("fuad-azizi") // "Fuad Azizi"
 */
export function slugToName(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
