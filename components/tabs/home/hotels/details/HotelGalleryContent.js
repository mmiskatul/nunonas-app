import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import theme from "../../../../../constants/theme";
import ImageViewer from "../../../../ui/ImageViewer";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = (width - 55) / 2;

const GALLERY_IMAGES = [
  {
    id: 1,
    source: require("../../../../../assets/images/discover-experience.png"),
    height: 200,
  },
  {
    id: 2,
    source: require("../../../../../assets/images/plan-smarter-with-ai.png"),
    height: 160,
  },
  {
    id: 3,
    source: require("../../../../../assets/images/discover-experience.png"),
    height: 180,
  },
  {
    id: 4,
    source: require("../../../../../assets/images/plan-smarter-with-ai.png"),
    height: 220,
  },
];

const HotelGalleryContent = () => {
  const [viewerVisible, setViewerVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImagePress = (source) => {
    setSelectedImage(source);
    setViewerVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        <View style={styles.column}>
          {GALLERY_IMAGES.filter((_, i) => i % 2 === 0).map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleImagePress(item.source)}
            >
              <Image
                source={item.source}
                style={[styles.image, { height: item.height }]}
              />
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.column}>
          {GALLERY_IMAGES.filter((_, i) => i % 2 !== 0).map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleImagePress(item.source)}
            >
              <Image
                source={item.source}
                style={[styles.image, { height: item.height }]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ImageViewer
        isVisible={viewerVisible}
        imageSource={selectedImage}
        onClose={() => setViewerVisible(false)}
      />
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

export default HotelGalleryContent;
