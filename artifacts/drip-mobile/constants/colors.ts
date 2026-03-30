const Colors = {
  black: "#000000",
  offWhite: "#F5F5F0",
  gold: "#C9A84C",
  silver: "#A8A8A8",
  bronze: "#CD7F32",
  steel: "#71797E",
  darkGray: "#1A1A1A",
  midGray: "#333333",
  lightGray: "#666666",
  error: "#FF4444",
  success: "#4CAF50",
  cardBg: "#111111",
  inputBg: "#1A1A1A",
  border: "#2A2A2A",
  textPrimary: "#F5F5F0",
  textSecondary: "#999999",
  textMuted: "#666666",
};

export function getTierColor(score: number): string {
  if (score >= 8) return Colors.gold;
  if (score >= 6) return Colors.silver;
  if (score >= 4) return Colors.bronze;
  return Colors.steel;
}

export function getTierLabel(score: number): string {
  if (score >= 8) return "GOLD";
  if (score >= 6) return "SILVER";
  if (score >= 4) return "BRONZE";
  return "STEEL";
}

export default Colors;
