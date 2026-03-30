import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Colors from "@/constants/colors";
import DripButton from "@/components/DripButton";
import { useAuth } from "@/contexts/AuthContext";

export default function LandingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) return <View style={[styles.container, { backgroundColor: Colors.black }]} />;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Platform.OS === "web" ? 67 : insets.top + 40,
          paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 20,
        },
      ]}
    >
      <StatusBar style="light" />

      <View style={styles.heroSection}>
        <Text style={styles.brandDot}>.</Text>
        <Text style={styles.brand}>DRIP</Text>
        <Text style={styles.brandDot2}>.</Text>
      </View>

      <View style={styles.taglineSection}>
        <Text style={styles.tagline}>AI-POWERED</Text>
        <Text style={styles.taglineBold}>OUTFIT RATING</Text>
        <View style={styles.divider} />
        <Text style={styles.description}>
          Get instant, expert-level style analysis powered by artificial intelligence.
          Every outfit rated, every detail considered.
        </Text>
      </View>

      <View style={styles.actions}>
        <DripButton
          title="GET STARTED"
          onPress={() => router.push("/register")}
          testID="get-started-btn"
        />
        <DripButton
          title="SIGN IN"
          variant="outline"
          onPress={() => router.push("/login")}
          testID="sign-in-btn"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    paddingHorizontal: 32,
    justifyContent: "space-between",
  },
  heroSection: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    paddingTop: 60,
  },
  brand: {
    fontFamily: "CormorantGaramond_700Bold",
    fontSize: 64,
    color: Colors.offWhite,
    letterSpacing: 12,
  },
  brandDot: {
    fontFamily: "CormorantGaramond_700Bold",
    fontSize: 64,
    color: Colors.gold,
  },
  brandDot2: {
    fontFamily: "CormorantGaramond_700Bold",
    fontSize: 64,
    color: Colors.gold,
  },
  taglineSection: {
    alignItems: "center",
    gap: 12,
  },
  tagline: {
    fontFamily: "Outfit_400Regular",
    fontSize: 12,
    letterSpacing: 4,
    color: Colors.textSecondary,
  },
  taglineBold: {
    fontFamily: "CormorantGaramond_600SemiBold",
    fontSize: 28,
    color: Colors.offWhite,
    letterSpacing: 4,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: Colors.gold,
    marginVertical: 8,
  },
  description: {
    fontFamily: "Outfit_400Regular",
    fontSize: 14,
    lineHeight: 22,
    color: Colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  actions: {
    gap: 12,
    paddingBottom: 20,
  },
});
