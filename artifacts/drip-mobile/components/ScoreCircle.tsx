import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors, { getTierColor, getTierLabel } from "@/constants/colors";

interface ScoreCircleProps {
  score: number;
  size?: number;
  showTier?: boolean;
}

export default function ScoreCircle({ score, size = 120, showTier = true }: ScoreCircleProps) {
  const tierColor = getTierColor(score);
  const borderWidth = size > 80 ? 3 : 2;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: 0,
            borderColor: tierColor,
            borderWidth,
          },
        ]}
      >
        <Text
          style={[
            styles.score,
            {
              color: tierColor,
              fontSize: size * 0.35,
            },
          ]}
        >
          {score.toFixed(1)}
        </Text>
        <Text
          style={[
            styles.outOf,
            { fontSize: size * 0.12, color: Colors.textSecondary },
          ]}
        >
          / 10
        </Text>
      </View>
      {showTier && (
        <Text style={[styles.tier, { color: tierColor }]}>
          {getTierLabel(score)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 8,
  },
  circle: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.cardBg,
  },
  score: {
    fontFamily: "CormorantGaramond_700Bold",
    letterSpacing: -1,
  },
  outOf: {
    fontFamily: "Outfit_400Regular",
    marginTop: -4,
  },
  tier: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 12,
    letterSpacing: 3,
    textTransform: "uppercase" as const,
  },
});
