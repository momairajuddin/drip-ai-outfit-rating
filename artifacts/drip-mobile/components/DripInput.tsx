import React from "react";
import { View, Text, TextInput, StyleSheet, TextInputProps } from "react-native";
import Colors from "@/constants/colors";

interface DripInputProps extends TextInputProps {
  label: string;
  error?: string;
}

export default function DripInput({ label, error, style, ...props }: DripInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor={Colors.textMuted}
        selectionColor={Colors.gold}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase" as const,
    color: Colors.textSecondary,
  },
  input: {
    height: 52,
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    fontFamily: "Outfit_400Regular",
    fontSize: 16,
    color: Colors.textPrimary,
  },
  inputError: {
    borderColor: Colors.error,
  },
  error: {
    fontFamily: "Outfit_400Regular",
    fontSize: 12,
    color: Colors.error,
  },
});
