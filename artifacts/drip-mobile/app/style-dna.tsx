import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useGetStyleDna } from "@workspace/api-client-react";
import Colors, { getTierColor } from "@/constants/colors";

export default function StyleDnaScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: dna, isLoading } = useGetStyleDna();

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator color={Colors.gold} size="large" />
      </View>
    );
  }

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
        <Text style={styles.headerTitle}>STYLE DNA</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Platform.OS === "web" ? 34 + 20 : insets.bottom + 20 },
        ]}
      >
        {dna?.locked ? (
          <View style={styles.lockedState}>
            <Feather name="lock" size={48} color={Colors.textMuted} />
            <Text style={styles.lockedTitle}>Style DNA Locked</Text>
            <Text style={styles.lockedDesc}>
              Scan {dna.scansNeeded} more outfit{dna.scansNeeded !== 1 ? "s" : ""} to unlock your personal Style DNA analysis.
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.max(
                      5,
                      ((dna.totalOutfitsScanned / (dna.totalOutfitsScanned + dna.scansNeeded)) * 100)
                    )}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {dna.totalOutfitsScanned} / {dna.totalOutfitsScanned + dna.scansNeeded} scans
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.archetypeSection}>
              <Text style={styles.label}>DOMINANT ARCHETYPE</Text>
              <Text style={styles.archetypeName}>
                {dna?.dominantArchetype ?? "—"}
              </Text>
              {dna?.archetypePercentage != null && (
                <Text style={styles.archetypePercent}>
                  {dna.archetypePercentage}% of your outfits
                </Text>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>TOP COLORS</Text>
              <View style={styles.divider} />
              <View style={styles.colorRow}>
                {dna?.topColors?.map((color, i) => (
                  <View key={i} style={styles.colorItem}>
                    <View
                      style={[styles.colorSwatch, { backgroundColor: color }]}
                    />
                    <Text style={styles.colorHex}>{color}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {dna?.totalOutfitsScanned ?? 0}
                </Text>
                <Text style={styles.statLabel}>OUTFITS SCANNED</Text>
              </View>
            </View>

            {dna?.bestOutfit && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>BEST OUTFIT</Text>
                <View style={styles.divider} />
                <View style={styles.outfitCard}>
                  <Text
                    style={[
                      styles.outfitScore,
                      { color: getTierColor(dna.bestOutfit.overallScore) },
                    ]}
                  >
                    {dna.bestOutfit.overallScore.toFixed(1)}
                  </Text>
                  <Text style={styles.outfitArchetype}>
                    {dna.bestOutfit.styleArchetype}
                  </Text>
                  <Text style={styles.outfitDate}>
                    {new Date(dna.bestOutfit.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            )}

            {dna?.scoreTrend && dna.scoreTrend.length > 1 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>SCORE TREND</Text>
                <View style={styles.divider} />
                <View style={styles.trendList}>
                  {dna.scoreTrend.slice(-8).map((point, i) => (
                    <View key={i} style={styles.trendItem}>
                      <Text style={styles.trendDate}>
                        {new Date(point.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </Text>
                      <View style={styles.trendBarBg}>
                        <View
                          style={[
                            styles.trendBarFill,
                            {
                              width: `${(point.score / 10) * 100}%`,
                              backgroundColor: getTierColor(point.score),
                            },
                          ]}
                        />
                      </View>
                      <Text
                        style={[
                          styles.trendScore,
                          { color: getTierColor(point.score) },
                        ]}
                      >
                        {point.score.toFixed(1)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {dna?.styleEvolution && dna.styleEvolution.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>STYLE EVOLUTION</Text>
                <View style={styles.divider} />
                {dna.styleEvolution.slice(-6).map((entry, i) => (
                  <View key={i} style={styles.evolutionItem}>
                    <View style={styles.evolutionDot} />
                    <View style={styles.evolutionInfo}>
                      <Text style={styles.evolutionArchetype}>
                        {entry.archetype}
                      </Text>
                      <Text style={styles.evolutionDate}>
                        {new Date(entry.date).toLocaleDateString()}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.evolutionScore,
                        { color: getTierColor(entry.score) },
                      ]}
                    >
                      {entry.score.toFixed(1)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </>
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
    paddingTop: 24,
    gap: 28,
  },
  lockedState: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 16,
  },
  lockedTitle: {
    fontFamily: "CormorantGaramond_700Bold",
    fontSize: 28,
    color: Colors.offWhite,
  },
  lockedDesc: {
    fontFamily: "Outfit_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  progressBar: {
    width: "80%",
    height: 4,
    backgroundColor: Colors.darkGray,
  },
  progressFill: {
    height: 4,
    backgroundColor: Colors.gold,
  },
  progressText: {
    fontFamily: "Outfit_400Regular",
    fontSize: 12,
    color: Colors.textMuted,
  },
  archetypeSection: {
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 10,
    letterSpacing: 3,
    color: Colors.textSecondary,
  },
  archetypeName: {
    fontFamily: "CormorantGaramond_700Bold",
    fontSize: 36,
    color: Colors.gold,
    textAlign: "center",
  },
  archetypePercent: {
    fontFamily: "Outfit_400Regular",
    fontSize: 14,
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
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  colorRow: {
    flexDirection: "row",
    gap: 16,
    flexWrap: "wrap",
  },
  colorItem: {
    alignItems: "center",
    gap: 4,
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  colorHex: {
    fontFamily: "Outfit_400Regular",
    fontSize: 10,
    color: Colors.textMuted,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    alignItems: "center",
    gap: 8,
  },
  statValue: {
    fontFamily: "CormorantGaramond_700Bold",
    fontSize: 32,
    color: Colors.offWhite,
  },
  statLabel: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 10,
    letterSpacing: 2,
    color: Colors.textSecondary,
  },
  outfitCard: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 4,
    alignItems: "center",
  },
  outfitScore: {
    fontFamily: "CormorantGaramond_700Bold",
    fontSize: 36,
  },
  outfitArchetype: {
    fontFamily: "CormorantGaramond_600SemiBold",
    fontSize: 18,
    color: Colors.offWhite,
  },
  outfitDate: {
    fontFamily: "Outfit_400Regular",
    fontSize: 12,
    color: Colors.textMuted,
  },
  trendList: {
    gap: 8,
  },
  trendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  trendDate: {
    fontFamily: "Outfit_400Regular",
    fontSize: 11,
    color: Colors.textMuted,
    width: 50,
  },
  trendBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.darkGray,
  },
  trendBarFill: {
    height: 6,
  },
  trendScore: {
    fontFamily: "CormorantGaramond_700Bold",
    fontSize: 16,
    width: 36,
    textAlign: "right",
  },
  evolutionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  evolutionDot: {
    width: 8,
    height: 8,
    backgroundColor: Colors.gold,
  },
  evolutionInfo: {
    flex: 1,
    gap: 2,
  },
  evolutionArchetype: {
    fontFamily: "CormorantGaramond_600SemiBold",
    fontSize: 16,
    color: Colors.offWhite,
  },
  evolutionDate: {
    fontFamily: "Outfit_400Regular",
    fontSize: 11,
    color: Colors.textMuted,
  },
  evolutionScore: {
    fontFamily: "CormorantGaramond_700Bold",
    fontSize: 18,
  },
});
