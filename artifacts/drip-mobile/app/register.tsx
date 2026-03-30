import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Platform, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { useRegister } from "@workspace/api-client-react";
import Colors from "@/constants/colors";
import DripButton from "@/components/DripButton";
import DripInput from "@/components/DripInput";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setToken } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const registerMutation = useRegister({
    mutation: {
      onSuccess: async (data) => {
        await setToken(data.token);
        router.replace("/(tabs)");
      },
      onError: (error) => {
        const message = (error as any)?.data?.error || "Registration failed";
        Alert.alert("Error", message);
      },
    },
  });

  const handleRegister = () => {
    const newErrors: Record<string, string> = {};
    if (!username.trim()) newErrors.username = "Username is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (password.length < 6) newErrors.password = "Min 6 characters";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    registerMutation.mutate({
      data: { username: username.trim(), email: email.trim(), password },
    });
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
          <Text style={styles.title}>Join{"\n"}DRIP.</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.form}>
          <DripInput
            label="USERNAME"
            placeholder="Choose a username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.username}
            testID="register-username"
          />
          <DripInput
            label="EMAIL"
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.email}
            testID="register-email"
          />
          <DripInput
            label="PASSWORD"
            placeholder="Min. 6 characters"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
            testID="register-password"
          />
        </View>

        <View style={styles.actions}>
          <DripButton
            title="CREATE ACCOUNT"
            onPress={handleRegister}
            loading={registerMutation.isPending}
            testID="register-submit"
          />
          <Pressable onPress={() => router.push("/login")} style={styles.switchLink}>
            <Text style={styles.switchText}>
              Have an account? <Text style={styles.switchHighlight}>Sign In</Text>
            </Text>
          </Pressable>
        </View>
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
});
