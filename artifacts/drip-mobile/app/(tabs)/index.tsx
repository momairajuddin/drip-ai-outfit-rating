import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
  RefreshControl,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useGetMe, useGetScanHistory } from "@workspace/api-client-react";
import Colors, { getTierColor } from "@/constants/colors";
import ScanCard from "@/components/ScanCard";
import ScoreCircle from "@/components/ScoreCircle";

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { data: user, isLoading: userLoading, error: userError, refetch: refetchUser } = useGetMe();
  const { data: history, isLoading: historyLoading, error: historyError, refetch: refetchHistory } = useGetScanHistory({ limit: 5 });

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchUser(), refetchHistory()]);
    setRefreshing(false);
  };

  if (userLoading || historyLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator color={Colors.gold} size="large" />
      </View>
    );
  }

  if (userError || historyError) {
    return (
      <View style={[styles.container, styles.center]}>
        <Feather name="alert-circle" size={32} color={Colors.error} />
        <Text style={{ color: Colors.textPrimary, fontFamily: "CormorantGaramond_600SemiBold", fontSize: 18, marginTop: 12 }}>
          Failed to load
        </Text>
        <Pressable onPress={onRefresh} style={{ marginTop: 16, paddingHorizontal: 20, paddingVertical: 10, borderWidth: 1, borderColor: Colors.gold }}>
          <Text style={{ color: Colors.gold, fontFamily: "Outfit_600SemiBold", fontSize: 12, letterSpacing: 2 }}>RETRY</Text>
        </Pressable>
      </View>
    );
  }

  const recentScans = history?.scans ?? [];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: Platform.OS === "web" ? 67 + 20 : insets.top + 20,
          paddingBottom: Platform.OS === "web" ? 34 + 80 : 100,
        },
      ]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.gold} />
      }
    >
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.username}>{user?.username ?? "..."}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{user?.totalScans ?? 0}</Text>
          <Text style={styles.statLabel}>SCANS</Text>
        </View>
        <View style={styles.statCard}>
          <ScoreCircle score={user?.avgScore ?? 0} size={72} showTier={false} />
          <Text style={styles.statLabel}>AVG SCORE</Text>
        </View>
        <View style={styles.statCard}>
          <Text
            style={[
              styles.statValue,
              { color: getTierColor(user?.highestScore ?? 0) },
            ]}
          >
            {(user?.highestScore ?? 0).toFixed(1)}
          </Text>
          <Text style={styles.statLabel}>BEST</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>RECENT SCANS</Text>
        <View style={styles.divider} />
        {recentScans.length > 0 ? (
          <View style={styles.scanList}>
            {recentScans.map((scan) => (
              <ScanCard key={scan.id} scan={scan} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Feather name="camera" size={32} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No scans yet</Text>
            <Text style={styles.emptySubtext}>Take your first outfit photo to get started</Text>
          </View>
        )}
      </View>
    </ScrollView>
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
  content: {
    paddingHorizontal: 20,
    gap: 28,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontFamily: "Outfit_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
  },
  username: {
    fontFamily: "CormorantGaramond_700Bold",
    fontSize: 32,
    color: Colors.offWhite,
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
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 100,
  },
  statValue: {
    fontFamily: "CormorantGaramond_700Bold",
    fontSize: 28,
    color: Colors.offWhite,
  },
  statLabel: {
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
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  scanList: {
    gap: 8,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 8,
  },
  emptyText: {
    fontFamily: "CormorantGaramond_600SemiBold",
    fontSize: 18,
    color: Colors.textPrimary,
  },
  emptySubtext: {
    fontFamily: "Outfit_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
