// @ts-nocheck
import React, { useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import theme from "../../../../../constants/theme";
import SaveButton from "../../../../ui/SaveButton";

const { width } = Dimensions.get("window");

const ImageHeader = ({ image, images = [], entityId }) => {
  const router = useRouter();
  const slides = useMemo(() => (images.length ? images : [image]), [image, images]);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View style={styles.container}>
      <FlatList
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => `header-image-${index}`}
        onMomentumScrollEnd={(event) => {
          setActiveIndex(Math.round(event.nativeEvent.contentOffset.x / width));
        }}
        renderItem={({ item }) => <Image source={item} style={styles.image} />}
      />

      {/* Top Overlay Buttons */}
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.COLORS.textPrimary}
          />
        </TouchableOpacity>

        <SaveButton entityType="restaurant" entityId={entityId} compact />
      </View>

      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View key={`header-dot-${index}`} style={[styles.dot, index === activeIndex && styles.activeDot]} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: width * 1, // High aspect ratio for header
    width: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    top: 50, // Account for status bar
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  favBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  pagination: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  activeDot: {
    backgroundColor: theme.COLORS.white,
    width: 24,
  },
});

export default ImageHeader;


