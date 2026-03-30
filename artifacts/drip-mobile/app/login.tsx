import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Platform, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { useLogin } from "@workspace/api-client-react";
import Colors from "@/constants/colors";
import DripButton from "@/components/DripButton";
import DripInput from "@/components/DripInput";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loginMutation = useLogin({
    mutation: {
      onSuccess: async (data) => {
        await setToken(data.token);
        router.replace("/(tabs)");
      },
      onError: (error) => {
        const message = (error as any)?.data?.error || "Login failed";
        Alert.alert("Error", message);
      },
    },
  });

  const handleLogin = () => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    loginMutation.mutate({ data: { email: email.trim(), password } });
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Platform.OS === "web" ? 67 : insets.top,
          paddingBottom: Platform.OS === "web" ? 34 : insets.bottom,
        },
      ]}
    >
      <StatusBar style="light" />
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={20}>
          <Feather name="arrow-left" size={24} color={Colors.offWhite} />
        </Pressable>
      </View>

      <KeyboardAwareScrollViewCompat
        bottomOffset={20}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        <View style={styles.titleSection}>
          <Text style={styles.title}>Welcome{"\n"}Back</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.form}>
          <DripInput
            label="EMAIL"
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.email}
            testID="login-email"
          />
          <DripInput
            label="PASSWORD"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
            testID="login-password"
          />
        </View>

        <View style={styles.actions}>
          <DripButton
            title="SIGN IN"
            onPress={handleLogin}
            loading={loginMutation.isPending}
            testID="login-submit"
          />
          <Pressable onPress={() => router.push("/register")} style={styles.switchLink}>
            <Text style={styles.switchText}>
              No account? <Text style={styles.switchHighlight}>Register</Text>
            </Text>
          </Pressable>
        </View>

        <View style={styles.demoSection}>
          <View style={styles.demoLine} />
          <Text style={styles.demoLabel}>DEMO ACCESS</Text>
          <View style={styles.demoLine} />
        </View>
        <Pressable
          onPress={() => {
            setEmail("demo@drip.app");
            setPassword("demo123");
          }}
          style={styles.demoButton}
        >
          <Text style={styles.demoButtonText}>USE DEMO CREDENTIALS</Text>
        </Pressable>
      </KeyboardAwareScrollViewCompat>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  content: {
    paddingHorizontal: 32,
    paddingBottom: 40,
    gap: 32,
  },
  titleSection: {
    gap: 16,
  },
  title: {
    fontFamily: "CormorantGaramond_700Bold",
    fontSize: 48,
    color: Colors.offWhite,
    lineHeight: 52,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: Colors.gold,
  },
  form: {
    gap: 20,
  },
  actions: {
    gap: 16,
    alignItems: "center",
  },
  switchLink: {
    padding: 8,
  },
  switchText: {
    fontFamily: "Outfit_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
  },
  switchHighlight: {
    color: Colors.gold,
    fontFamily: "Outfit_600SemiBold",
  },
  demoSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  demoLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  demoLabel: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 10,
    letterSpacing: 2,
    color: Colors.textMuted,
  },
  demoButton: {
    height: 44,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  demoButtonText: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 12,
    letterSpacing: 2,
    color: Colors.textSecondary,
  },
});
