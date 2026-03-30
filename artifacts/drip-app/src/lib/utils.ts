import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getScoreTier(score: number): "gold" | "silver" | "bronze" | "steel" {
  if (score >= 8.0) return "gold";
  if (score >= 6.0) return "silver";
  if (score >= 4.0) return "bronze";
  return "steel";
}

export function getScoreColor(score: number): string {
  const tier = getScoreTier(score);
  switch (tier) {
    case "gold": return "text-gold";
    case "silver": return "text-silver";
    case "bronze": return "text-bronze";
    case "steel": return "text-steel";
  }
}

export function getScoreHex(score: number): string {
  const tier = getScoreTier(score);
  switch (tier) {
    case "gold": return "#C9A84C";
    case "silver": return "#A8A8A8";
    case "bronze": return "#CD7F32";
    case "steel": return "#71797E";
  }
}
