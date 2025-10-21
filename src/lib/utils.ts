import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a short, readable form ID from a title
 * Format: "slugified-title~a3f9c2"
 */
export function generateFormId(title: string): string {
  // Slugify the title
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
    .replace(/-{2,}/g, "-") // Collapse multiple hyphens
    .slice(0, 50) // Max 50 chars for the slug part

  // Generate 6-char random hex
  const randomHex = Array.from(crypto.getRandomValues(new Uint8Array(3)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 6)

  // Handle edge case: if slug is empty after cleaning, use "form"
  const finalSlug = slug || "form"

  return `${finalSlug}~${randomHex}`
}
