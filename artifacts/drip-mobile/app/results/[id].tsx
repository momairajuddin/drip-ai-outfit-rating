import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Platform,
  Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useGetScanById, useGetRecommendations } from "@workspace/api-client-react";
import Colors, { getTierColor, getTierLabel } from "@/constants/colors";
import ScoreCircle from "@/components/ScoreCircle";

const CATEGORY_LABELS: Record<string, string> = {
  fit: "FIT",
  color: "COLOR",
  styleCoherence: "COHERENCE",
  trendAlignment: "TREND",
  signatureFactor: "SIGNATURE",
};

export default function ResultsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scanId = parseInt(id ?? "0", 10);
  const { data: scan, isLoading, error } = useGetScanById(scanId, { query: { enabled: scanId > 0 } });
  const { data: upgrades } = useGetRecommendations(scanId, { query: { enabled: scanId > 0 } });

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator color={Colors.gold} size="large" />
      </View>
    );
  }

  if (error || !scan) {
    return (
      <View style={[styles.container, styles.center]}>
        <Feather name="alert-circle" size={32} color={Colors.error} />
        <Text style={{ color: Colors.textPrimary, fontFamily: "CormorantGaramond_600SemiBold", fontSize: 18, marginTop: 12 }}>
          {error ? "Failed to load results" : "Scan not found"}
        </Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 16, paddingHorizontal: 20, paddingVertical: 10, borderWidth: 1, borderColor: Colors.gold }}>
          <Text style={{ color: Colors.gold, fontFamily: "Outfit_600SemiBold", fontSize: 12, letterSpacing: 2 }}>GO BACK</Text>
        </Pressable>
      </View>
    );
  }

  const tierColor = getTierColor(scan.overallScore);
  const imageUri = scan.imagePath?.startsWith("http")
    ? scan.imagePath
    : `https://${process.env.EXPO_PUBLIC_DOMAIN}${scan.imagePath}`;

  const scoreEntries = scan.scores
    ? Object.entries(scan.scores).filter(([key]) => CATEGORY_LABELS[key])
    : [];

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          { paddingTop: Platform.OS === "web" ? 67 : insets.top },
        ]}
      >
        <Pressable onPress={() => router.back()} hitSlop={20}>
          <Feather name="arrow-left" size={24} color={Colors.offWhite} />
        </Pressable>
        <Text style={styles.headerTitle}>RESULTS</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Platform.OS === "web" ? 34 + 20 : insets.bottom + 20 },
        ]}
      >
        <View style={styles.heroSection}>
          <Image source={{ uri: imageUri }} style={styles.heroImage} />
          <View style={styles.scoreOverlay}>
            <ScoreCircle score={scan.overallScore} size={100} />
          </View>
        </View>

        <View style={styles.archetypeSection}>
          <Text style={styles.archetypeLabel}>STYLE ARCHETYPE</Text>
          <Text style={[styles.archetypeName, { color: tierColor }]}>
            {scan.styleArchetype}
          </Text>
          <Text style={styles.archetypeDesc}>{scan.archetypeDescription}</Text>
        </View>

        {scan.vibeTags && scan.vibeTags.length > 0 && (
          <View style={styles.tagsRow}>
            {scan.vibeTags.map((tag, i) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>{tag.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SCORE BREAKDOWN</Text>
          <View style={styles.sectionDivider} />
          {scoreEntries.map(([key, value]) => (
            <View key={key} style={styles.scoreRow}>
              <Text style={styles.scoreCatLabel}>
                {CATEGORY_LABELS[key] ?? key}
              </Text>
              <View style={styles.scoreBarBg}>
                <View
                  style={[
                    styles.scoreBarFill,
                    {
                      width: `${(value.score / 10) * 100}%`,
                      backgroundColor: getTierColor(value.score),
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.scoreValue,
                  { color: getTierColor(value.score) },
                ]}
              >
                {value.score.toFixed(1)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.highlightRow}>
          <View style={[styles.highlightCard, { borderColor: Colors.success }]}>
            <Feather name="award" size={18} color={Colors.success} />
            <Text style={styles.highlightLabel}>BEST</Text>
            <Text style={styles.highlightValue}>{scan.bestElement}</Text>
          </View>
          <View style={[styles.highlightCard, { borderColor: Colors.error }]}>
            <Feather name="alert-circle" size={18} color={Colors.error} />
            <Text style={styles.highlightLabel}>WEAKEST</Text>
            <Text style={styles.highlightValue}>{scan.weakestElement}</Text>
          </View>
        </View>

        {scan.celebrityMatch && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CELEBRITY MATCH</Text>
            <View style={styles.sectionDivider} />
            <View style={styles.celebCard}>
              <Text style={styles.celebName}>{scan.celebrityMatch.name}</Text>
              <Text style={styles.celebMatch}>
                {scan.celebrityMatch.matchPercentage}% MATCH
              </Text>
              <Text style={styles.celebDesc}>
                {scan.celebrityMatch.description}
              </Text>
            </View>
          </View>
        )}

        {scan.colorPalette && scan.colorPalette.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>COLOR PALETTE</Text>
            <View style={styles.sectionDivider} />
            <View style={styles.paletteRow}>
              {scan.colorPalette.map((color, i) => (
                <View key={i} style={styles.paletteItem}>
                  <View
                    style={[styles.paletteSwatch, { backgroundColor: color }]}
                  />
                  <Text style={styles.paletteHex}>{color}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {upgrades && Array.isArray(upgrades) && upgrades.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>UPGRADES</Text>
            <View style={styles.sectionDivider} />
            {upgrades.map((u: any, i: number) => (
              <View key={i} style={styles.upgradeCard}>
                <View style={styles.upgradeHeader}>
                  <Text style={styles.upgradeSwap}>Swap: {u.swap}</Text>
                  <Text style={styles.upgradeIncrease}>
                    +{u.predictedScoreIncrease.toFixed(1)}
                  </Text>
                </View>
                <Text style={styles.upgradeWith}>With: {u.with}</Text>
                <Text style={styles.upgradePrice}>{u.priceRange}</Text>
              </View>
            ))}
          </View>
        )}

        {scan.occasionMatch && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>OCCASION MATCH</Text>
            <View style={styles.sectionDivider} />
            {Object.entries(scan.occasionMatch).map(([key, value]) => (
              <View key={key} style={styles.occasionRow}>
                <Text style={styles.occasionLabel}>
                  {key.replace(/([A-Z])/g, " $1").toUpperCase()}
                </Text>
                <View style={styles.occasionBarBg}>
                  <View
                    style={[
                      styles.occasionBarFill,
                      { width: `${value}%` },
                    ]}
                  />
                </View>
                <Text style={styles.occasionValue}>{value}%</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 12,
    letterSpacing: 3,
    color: Colors.textSecondary,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 24,
  },
  heroSection: {
    alignItems: "center",
  },
  heroImage: {
    width: "100%",
    height: 300,
    backgroundColor: Colors.midGray,
  },
  scoreOverlay: {
    marginTop: -50,
    backgroundColor: Colors.black,
    padding: 12,
  },
  archetypeSection: {
    alignItems: "center",
    gap: 8,
  },
  archetypeLabel: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 10,
    letterSpacing: 3,
    color: Colors.textSecondary,
  },
  archetypeName: {
    fontFamily: "CormorantGaramond_700Bold",
    fontSize: 32,
    textAlign: "center",
  },
  archetypeDesc: {
    fontFamily: "Outfit_400Regular",
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagText: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 10,
    letterSpacing: 2,
    color: Colors.textSecondary,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 12,
    letterSpacing: 3,
    color: Colors.textSecondary,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  scoreCatLabel: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 11,
    letterSpacing: 1,
    color: Colors.textSecondary,
    width: 80,
  },
  scoreBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.darkGray,
  },
  scoreBarFill: {
    height: 6,
  },
  scoreValue: {
    fontFamily: "CormorantGaramond_700Bold",
    fontSize: 16,
    width: 36,
    textAlign: "right",
  },
  highlightRow: {
    flexDirection: "row",
    gap: 12,
  },
  highlightCard: {
    flex: 1,
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    padding: 14,
    gap: 6,
  },
  highlightLabel: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 10,
    letterSpacing: 2,
    color: Colors.textSecondary,
  },
  highlightValue: {
    fontFamily: "Outfit_400Regular",
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  celebCard: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 6,
  },
  celebName: {
    fontFamily: "CormorantGaramond_700Bold",
    fontSize: 22,
    color: Colors.gold,
  },
  celebMatch: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 11,
    letterSpacing: 2,
    color: Colors.textSecondary,
  },
  celebDesc: {
    fontFamily: "Outfit_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  paletteRow: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },
  paletteItem: {
    alignItems: "center",
    gap: 4,
  },
  paletteSwatch: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  paletteHex: {
    fontFamily: "Outfit_400Regular",
    fontSize: 10,
    color: Colors.textMuted,
  },
  upgradeCard: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    gap: 4,
  },
  upgradeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  upgradeSwap: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 14,
    color: Colors.textPrimary,
    flex: 1,
  },
  upgradeIncrease: {
    fontFamily: "CormorantGaramond_700Bold",
    fontSize: 18,
    color: Colors.success,
  },
  upgradeWith: {
    fontFamily: "Outfit_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  upgradePrice: {
    fontFamily: "Outfit_400Regular",
    fontSize: 12,
    color: Colors.textMuted,
  },
  occasionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  occasionLabel: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 10,
    letterSpacing: 1,
    color: Colors.textSecondary,
    width: 100,
  },
  occasionBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.darkGray,
  },
  occasionBarFill: {
    height: 6,
    backgroundColor: Colors.gold,
  },
  occasionValue: {
    fontFamily: "Outfit_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
    width: 36,
    textAlign: "right",
  },
});
