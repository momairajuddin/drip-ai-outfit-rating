import React from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import Colors, { getTierColor } from "@/constants/colors";
import type { ScanSummary } from "@workspace/api-client-react";

interface ScanCardProps {
  scan: ScanSummary;
}

export default function ScanCard({ scan }: ScanCardProps) {
  const router = useRouter();
  const tierColor = getTierColor(scan.overallScore);

  const imageUri = scan.imagePath?.startsWith("http")
    ? scan.imagePath
    : `https://${process.env.EXPO_PUBLIC_DOMAIN}${scan.imagePath}`;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => router.push(`/results/${scan.id}`)}
      testID={`scan-card-${scan.id}`}
    >
      <Image source={{ uri: imageUri }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.archetype}>{scan.styleArchetype}</Text>
        <Text style={styles.date}>
          {new Date(scan.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <View style={[styles.scoreBadge, { borderColor: tierColor }]}>
        <Text style={[styles.scoreText, { color: tierColor }]}>
          {scan.overallScore.toFixed(1)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.cardBg,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pressed: {
    opacity: 0.7,
  },
  image: {
    width: 56,
    height: 56,
    backgroundColor: Colors.midGray,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  archetype: {
    fontFamily: "CormorantGaramond_600SemiBold",
    fontSize: 16,
    color: Colors.textPrimary,
  },
  date: {
    fontFamily: "Outfit_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  scoreBadge: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  scoreText: {
    fontFamily: "CormorantGaramond_700Bold",
    fontSize: 18,
  },
});
