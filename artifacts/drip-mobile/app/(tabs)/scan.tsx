import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Alert,
  ActivityIndicator,
  Platform,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import Colors from "@/constants/colors";
import DripButton from "@/components/DripButton";

export default function ScanScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Camera access is required to take outfit photos.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleScan = async () => {
    if (!selectedImage && !demoMode) return;
    setUploading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    try {
      const formData = new FormData();

      if (demoMode) {
        const emptyBlob = new Blob([""], { type: "image/jpeg" });
        formData.append("image", emptyBlob, "demo.jpg");
      } else if (selectedImage) {
        if (Platform.OS === "web") {
          const response = await fetch(selectedImage);
          const blob = await response.blob();
          formData.append("image", blob, "outfit.jpg");
        } else {
          const { File } = await import("expo-file-system");
          const file = new File(selectedImage);
          formData.append("image", file as any);
        }
      }

      const headers: Record<string, string> = {};
      if (demoMode) {
        headers["x-demo-mode"] = "true";
      }

      const token = await (await import("@react-native-async-storage/async-storage")).default.getItem("drip_auth_token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const baseUrl = `https://${process.env.EXPO_PUBLIC_DOMAIN}`;
      const res = await fetch(`${baseUrl}/api/scan`, {
        method: "POST",
        body: formData,
        headers,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Scan failed" }));
        throw new Error(err.error || "Scan failed");
      }

      const scanResult = await res.json();
      setSelectedImage(null);
      router.push(`/results/${scanResult.id}`);
    } catch (error: any) {
      Alert.alert("Scan Failed", error.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Platform.OS === "web" ? 67 + 20 : insets.top + 20,
          paddingBottom: Platform.OS === "web" ? 34 + 80 : 100,
        },
      ]}
    >
      <StatusBar style="light" />

      <Text style={styles.title}>Scan Outfit</Text>
      <View style={styles.divider} />

      <Pressable
        style={[styles.imageArea, selectedImage && styles.imageAreaFilled]}
        onPress={pickImage}
      >
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.preview} />
        ) : (
          <View style={styles.placeholder}>
            <Feather name="image" size={48} color={Colors.textMuted} />
            <Text style={styles.placeholderText}>TAP TO SELECT PHOTO</Text>
          </View>
        )}
      </Pressable>

      <View style={styles.cameraRow}>
        <Pressable
          style={({ pressed }) => [styles.cameraBtn, pressed && styles.pressed]}
          onPress={takePhoto}
        >
          <Feather name="camera" size={20} color={Colors.offWhite} />
          <Text style={styles.cameraBtnText}>TAKE PHOTO</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.cameraBtn, pressed && styles.pressed]}
          onPress={pickImage}
        >
          <Feather name="upload" size={20} color={Colors.offWhite} />
          <Text style={styles.cameraBtnText}>UPLOAD</Text>
        </Pressable>
      </View>

      <View style={styles.demoRow}>
        <Text style={styles.demoLabel}>DEMO MODE</Text>
        <Switch
          value={demoMode}
          onValueChange={setDemoMode}
          trackColor={{ false: Colors.midGray, true: Colors.gold }}
          thumbColor={Colors.offWhite}
        />
      </View>

      {uploading ? (
        <View style={styles.analyzingContainer}>
          <ActivityIndicator color={Colors.gold} size="large" />
          <Text style={styles.analyzingText}>Analyzing your outfit...</Text>
        </View>
      ) : (
        <DripButton
          title={demoMode ? "DEMO SCAN" : "ANALYZE OUTFIT"}
          onPress={handleScan}
          disabled={!selectedImage && !demoMode}
          testID="scan-analyze-btn"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    paddingHorizontal: 20,
    gap: 16,
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
  imageArea: {
    flex: 1,
    maxHeight: 360,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: "dashed" as const,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.cardBg,
  },
  imageAreaFilled: {
    borderStyle: "solid" as const,
    borderColor: Colors.gold,
  },
  preview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholder: {
    alignItems: "center",
    gap: 12,
  },
  placeholderText: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 12,
    letterSpacing: 2,
    color: Colors.textMuted,
  },
  cameraRow: {
    flexDirection: "row",
    gap: 12,
  },
  cameraBtn: {
    flex: 1,
    flexDirection: "row",
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.cardBg,
  },
  pressed: {
    opacity: 0.7,
  },
  cameraBtnText: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 12,
    letterSpacing: 2,
    color: Colors.offWhite,
  },
  demoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  demoLabel: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 11,
    letterSpacing: 2,
    color: Colors.textSecondary,
  },
  analyzingContainer: {
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  analyzingText: {
    fontFamily: "Outfit_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
