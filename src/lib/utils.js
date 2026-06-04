import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Convert a hyphenated slug to a display name in Pascal Case with spaces.
 * @example slugToName("fuad-azizi") // "Fuad Azizi"
 */
export function slugToName(url) {
  if (typeof url !== "string") return "";

  const decoded = url;

  return decoded
    .split(/[-+]/)
    .filter(Boolean)
    .map((word) => {
      if (word === word.toUpperCase()) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ")
    .replace(/ +/g, " ")
    .trim();
}
