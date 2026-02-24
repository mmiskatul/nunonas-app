import React from "react";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import theme from "../../../../../constants/theme";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = (width - 60) / 2;

const MENU_IMAGES = [
  require("../../../../../assets/images/spa/menu/Rectangle 2.png"),
  require("../../../../../assets/images/spa/menu/Rectangle 3.png"),
  require("../../../../../assets/images/spa/menu/Rectangle 4.png"),
  require("../../../../../assets/images/spa/menu/Rectangle 5.png"),
];

const SpaMenuContent = () => {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {MENU_IMAGES.map((img, index) => (
          <TouchableOpacity
            key={index}
            style={styles.imageWrapper}
            activeOpacity={0.9}
          >
            <Image source={img} style={styles.image} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: theme.COLORS.white,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 20,
  },
  imageWrapper: {
    width: COLUMN_WIDTH,
    height: COLUMN_WIDTH * 1.4,
    borderRadius: 16,
    backgroundColor: theme.COLORS.surface,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.COLORS.border,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});

export default SpaMenuContent;
