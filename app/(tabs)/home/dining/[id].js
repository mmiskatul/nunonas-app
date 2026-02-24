import React, { useState } from "react";
import { StyleSheet, View, ScrollView, StatusBar, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import theme from "../../../../constants/theme";

// Import Details Components
import ImageHeader from "../../../../components/tabs/home/dining/details/ImageHeader";
import DetailsInfo from "../../../../components/tabs/home/dining/details/DetailsInfo";
import DetailsActions from "../../../../components/tabs/home/dining/details/DetailsActions";
import DetailsTabs from "../../../../components/tabs/home/dining/details/DetailsTabs";
import OverviewContent from "../../../../components/tabs/home/dining/details/OverviewContent";
import MenuContent from "../../../../components/tabs/home/dining/details/MenuContent";
import GalleryContent from "../../../../components/tabs/home/dining/details/GalleryContent";
import Button from "../../../../components/ui/Button";

const RESTAURANTS_DATA = {
  1: {
    id: 1,
    title: "The Golden Spoon",
    rating: "4.8",
    reviews: "324",
    cuisine: "French Cuisine",
    priceRange: "$$$",
    distance: "2.3 km",
    location: "Downtown",
    image: require("../../../../assets/images/discover-experience.png"),
  },
  2: {
    id: 2,
    title: "Sakura Sushi",
    rating: "4.6",
    reviews: "189",
    cuisine: "Japanese",
    priceRange: "$$",
    distance: "0.8 km",
    location: "New Doha",
    image: require("../../../../assets/images/plan-smarter-with-ai.png"),
  },
  3: {
    id: 3,
    title: "Brew & Bite",
    rating: "4.5",
    reviews: "257",
    cuisine: "Cafe",
    priceRange: "$",
    distance: "2.1 km",
    location: "Doha Industrial Area",
    image: require("../../../../assets/images/discover-experience.png"),
  },
  4: {
    id: 4,
    title: "Mediterranean Breeze",
    rating: "4.4",
    reviews: "98",
    cuisine: "Mediterranean",
    priceRange: "$$",
    distance: "3.2 km",
    location: "Lekhwair",
    image: require("../../../../assets/images/plan-smarter-with-ai.png"),
  },
};

export default function RestaurantDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState("Overview");

  const restaurant = RESTAURANTS_DATA[id] || RESTAURANTS_DATA["1"]; // Fallback to first

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[3]} // Stick the tab bar
      >
        <ImageHeader image={restaurant.image} />
        <DetailsInfo restaurant={restaurant} />
        <DetailsActions />
        <DetailsTabs activeTab={activeTab} onTabPress={setActiveTab} />

        {/* Tab Content */}
        <View style={styles.content}>
          {activeTab === "Overview" && <OverviewContent />}
          {activeTab === "Menu" && <MenuContent />}
          {activeTab === "Gallery" && <GalleryContent />}
          {activeTab === "Offers" && (
            <View style={styles.offersContainer}>
              <Text style={styles.offersText}>Offers</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  content: {
    backgroundColor: theme.COLORS.white,
    paddingBottom: 40,
  },
  offersContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
  },
  offersText: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
  },
});
