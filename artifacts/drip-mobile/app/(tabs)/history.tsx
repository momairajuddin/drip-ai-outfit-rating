import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Platform,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useGetScanHistory } from "@workspace/api-client-react";
import Colors from "@/constants/colors";
import ScanCard from "@/components/ScanCard";

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { data, isLoading, refetch } = useGetScanHistory({ limit: 50 });
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const scans = data?.scans ?? [];

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator color={Colors.gold} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={scans}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <ScanCard scan={item} />}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingTop: Platform.OS === "web" ? 67 + 20 : insets.top + 20,
            paddingBottom: Platform.OS === "web" ? 34 + 80 : 100,
          },
        ]}
        scrollEnabled={scans.length > 0}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.gold} />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>History</Text>
            <View style={styles.divider} />
            {data?.stats && (
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{data.stats.totalScans}</Text>
                  <Text style={styles.statLabel}>TOTAL</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{data.stats.avgScore.toFixed(1)}</Text>
                  <Text style={styles.statLabel}>AVG</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{data.stats.highestScore.toFixed(1)}</Text>
                  <Text style={styles.statLabel}>BEST</Text>
                </View>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="archive" size={32} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No scans yet</Text>
            <Text style={styles.emptySubtext}>
              Your outfit scan history will appear here
            </Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
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
  listContent: {
    paddingHorizontal: 20,
  },
  header: {
    gap: 12,
    marginBottom: 20,
  },
  title: {
    fontFamily: "CormorantGaramond_700Bold",
    fontSize: 32,
    color: Colors.offWhite,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gold,
    width: 40,
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
  },
  stat: {
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontFamily: "CormorantGaramond_700Bold",
    fontSize: 20,
    color: Colors.offWhite,
  },
  statLabel: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 10,
    letterSpacing: 2,
    color: Colors.textSecondary,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
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
