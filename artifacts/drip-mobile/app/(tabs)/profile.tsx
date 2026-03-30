import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useGetMe, useGetStyleDna } from "@workspace/api-client-react";
import Colors, { getTierColor } from "@/constants/colors";
import ScoreCircle from "@/components/ScoreCircle";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  const { data: user, isLoading } = useGetMe();
  const { data: styleDna } = useGetStyleDna();

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          await logout();
          router.replace("/");
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator color={Colors.gold} size="large" />
      </View>
    );
  }

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
    >
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(user?.username?.[0] ?? "?").toUpperCase()}
          </Text>
        </View>
        <Text style={styles.username}>{user?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.memberSince}>
          Member since {new Date(user?.createdAt ?? "").toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.scoreSection}>
        <ScoreCircle score={user?.avgScore ?? 0} size={100} />
        <Text style={styles.scoreLabel}>AVERAGE SCORE</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.gridItem}>
          <Text style={styles.gridValue}>{user?.totalScans ?? 0}</Text>
          <Text style={styles.gridLabel}>TOTAL SCANS</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={[styles.gridValue, { color: getTierColor(user?.highestScore ?? 0) }]}>
            {(user?.highestScore ?? 0).toFixed(1)}
          </Text>
          <Text style={styles.gridLabel}>HIGHEST SCORE</Text>
        </View>
      </View>

      {styleDna && !styleDna.locked && styleDna.dominantArchetype && (
        <View style={styles.dnaCard}>
          <Text style={styles.dnaTitle}>STYLE DNA</Text>
          <View style={styles.divider} />
          <Text style={styles.dnaArchetype}>{styleDna.dominantArchetype}</Text>
          <View style={styles.colorRow}>
            {styleDna.topColors?.slice(0, 5).map((color, i) => (
              <View
                key={i}
                style={[styles.colorSwatch, { backgroundColor: color }]}
              />
            ))}
          </View>
          <Pressable
            onPress={() => router.push("/style-dna")}
            style={styles.viewDnaBtn}
          >
            <Text style={styles.viewDnaBtnText}>VIEW FULL ANALYSIS</Text>
            <Feather name="arrow-right" size={14} color={Colors.gold} />
          </Pressable>
        </View>
      )}

      <Pressable
        style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}
        onPress={() => router.push("/style-dna")}
      >
        <Feather name="zap" size={20} color={Colors.gold} />
        <Text style={styles.menuText}>Style DNA</Text>
        <Feather name="chevron-right" size={18} color={Colors.textMuted} />
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.menuItem, styles.logoutItem, pressed && styles.pressed]}
        onPress={handleLogout}
      >
        <Feather name="log-out" size={20} color={Colors.error} />
        <Text style={[styles.menuText, { color: Colors.error }]}>Sign Out</Text>
      </Pressable>
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
    gap: 24,
  },
  profileHeader: {
    alignItems: "center",
    gap: 8,
  },
  avatar: {
    width: 72,
    height: 72,
    backgroundColor: Colors.cardBg,
    borderWidth: 2,
    borderColor: Colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: "CormorantGaramond_700Bold",
    fontSize: 32,
    color: Colors.gold,
  },
  username: {
    fontFamily: "CormorantGaramond_700Bold",
    fontSize: 28,
    color: Colors.offWhite,
  },
  email: {
    fontFamily: "Outfit_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
  },
  memberSince: {
    fontFamily: "Outfit_400Regular",
    fontSize: 12,
    color: Colors.textMuted,
  },
  scoreSection: {
    alignItems: "center",
    gap: 12,
  },
  scoreLabel: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 10,
    letterSpacing: 2,
    color: Colors.textSecondary,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  gridItem: {
    flex: 1,
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    alignItems: "center",
    gap: 8,
  },
  gridValue: {
    fontFamily: "CormorantGaramond_700Bold",
    fontSize: 28,
    color: Colors.offWhite,
  },
  gridLabel: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 10,
    letterSpacing: 2,
    color: Colors.textSecondary,
  },
  dnaCard: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    gap: 12,
  },
  dnaTitle: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 12,
    letterSpacing: 3,
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  dnaArchetype: {
    fontFamily: "CormorantGaramond_700Bold",
    fontSize: 24,
    color: Colors.gold,
  },
  colorRow: {
    flexDirection: "row",
    gap: 8,
  },
  colorSwatch: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  viewDnaBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 4,
  },
  viewDnaBtnText: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 12,
    letterSpacing: 2,
    color: Colors.gold,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
  },
  menuText: {
    flex: 1,
    fontFamily: "Outfit_400Regular",
    fontSize: 16,
    color: Colors.textPrimary,
  },
  logoutItem: {
    borderColor: "rgba(255,68,68,0.2)",
  },
  pressed: {
    opacity: 0.7,
  },
});
