import React from "react";
import { StyleSheet, View, Image, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../../../../../constants/theme";
import type { ProviderImageSource } from "../../../../../lib/provider-types";

const { width } = Dimensions.get("window");
const ASPECT_RATIO = 1.3;

type HotelImageHeaderProps = {
  image: string | ProviderImageSource;
};

export default function HotelImageHeader({ image }: HotelImageHeaderProps) {
  const router = useRouter();
  const imageSource = typeof image === "string" ? { uri: image } : image;

  return (
    <View style={styles.container}>
      <Image source={imageSource} style={styles.image} />
      <View style={styles.overlay} />

      <SafeAreaView style={styles.headerControls} edges={["top"]}>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.circleBtn}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={theme.COLORS.textPrimary}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.circleBtn}>
            <Ionicons
              name="heart-outline"
              size={24}
              color={theme.COLORS.textPrimary}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <View style={styles.indicatorContainer}>
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: width / ASPECT_RATIO,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  headerControls: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  indicatorContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  activeDot: {
    backgroundColor: theme.COLORS.white,
    width: 24,
  },
});


