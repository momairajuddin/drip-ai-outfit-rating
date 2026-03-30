import React from "react";
import { Pressable, Text, StyleSheet, ActivityIndicator } from "react-native";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";

interface DripButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  loading?: boolean;
  disabled?: boolean;
  testID?: string;
}

export default function DripButton({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  testID,
}: DripButtonProps) {
  const handlePress = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const isPrimary = variant === "primary";
  const isOutline = variant === "outline";

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        isPrimary && styles.primary,
        isOutline && styles.outline,
        !isPrimary && !isOutline && styles.secondary,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
      ]}
      onPress={handlePress}
      disabled={disabled || loading}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? Colors.black : Colors.offWhite} size="small" />
      ) : (
        <Text
          style={[
            styles.text,
            isPrimary && styles.primaryText,
            isOutline && styles.outlineText,
            !isPrimary && !isOutline && styles.secondaryText,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  primary: {
    backgroundColor: Colors.gold,
  },
  secondary: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.offWhite,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 14,
    letterSpacing: 2,
    textTransform: "uppercase" as const,
  },
  primaryText: {
    color: Colors.black,
  },
  secondaryText: {
    color: Colors.offWhite,
  },
  outlineText: {
    color: Colors.offWhite,
  },
});
