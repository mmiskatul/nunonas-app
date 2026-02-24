import React from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";
import theme from "../../../../../constants/theme";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = (width - 55) / 2;

const GALLERY_IMAGES = [
  {
    id: 1,
    source: require("../../../../../assets/images/spa/galley/Rectangle 2.png"),
    height: 200,
  },
  {
    id: 2,
    source: require("../../../../../assets/images/spa/galley/Rectangle 3.png"),
    height: 160,
  },
  {
    id: 3,
    source: require("../../../../../assets/images/spa/galley/Rectangle 5.png"),
    height: 180,
  },
  {
    id: 4,
    source: require("../../../../../assets/images/spa/galley/Rectangle 7.png"),
    height: 220,
  },
  {
    id: 5,
    source: require("../../../../../assets/images/spa/galley/Rectangle 8.png"),
    height: 160,
  },
  {
    id: 6,
    source: require("../../../../../assets/images/spa/galley/Rectangle 9.png"),
    height: 200,
  },
];

const SpaGalleryContent = () => {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {/* Left Column */}
        <View style={styles.column}>
          {GALLERY_IMAGES.filter((_, i) => i % 2 === 0).map((item) => (
            <Image
              key={item.id}
              source={item.source}
              style={[styles.image, { height: item.height }]}
            />
          ))}
        </View>

        {/* Right Column */}
        <View style={styles.column}>
          {GALLERY_IMAGES.filter((_, i) => i % 2 !== 0).map((item) => (
            <Image
              key={item.id}
              source={item.source}
              style={[styles.image, { height: item.height }]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: theme.COLORS.white,
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    width: COLUMN_WIDTH,
    gap: 15,
  },
  image: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: theme.COLORS.surface,
    resizeMode: "cover",
  },
});

export default SpaGalleryContent;
