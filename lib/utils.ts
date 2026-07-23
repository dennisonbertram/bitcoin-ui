import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function componentClasses(
  unstyled: boolean | undefined,
  defaults: ClassValue,
  className?: string,
) {
  return cn(!unstyled && defaults, className);
}
