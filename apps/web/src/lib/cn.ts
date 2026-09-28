import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Compose conditional classes while allowing Tailwind utilities to override safely. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
