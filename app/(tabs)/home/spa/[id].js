import React, { useState } from "react";
import { StyleSheet, View, ScrollView, StatusBar, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import theme from "../../../../constants/theme";

// Import Details Components
import SpaImageHeader from "../../../../components/tabs/home/spa/details/SpaImageHeader";
import SpaDetailsInfo from "../../../../components/tabs/home/spa/details/SpaDetailsInfo";
import SpaDetailsActions from "../../../../components/tabs/home/spa/details/SpaDetailsActions";
import SpaDetailsTabs from "../../../../components/tabs/home/spa/details/SpaDetailsTabs";
import SpaOverviewContent from "../../../../components/tabs/home/spa/details/SpaOverviewContent";
import SpaMenuContent from "../../../../components/tabs/home/spa/details/SpaMenuContent";
import SpaGalleryContent from "../../../../components/tabs/home/spa/details/SpaGalleryContent";

const SPA_DATA = {
  1: {
    id: 1,
    title: "Serenity Spa & Wellness",
    rating: "4.8",
    reviews: "324",
    cuisine: "Massage",
    type: "Wellness",
    distance: "1.2 km",
    location: "Al Qassar",
    image: require("../../../../assets/images/spa/galley/Rectangle 2.png"),
  },
  2: {
    id: 2,
    title: "Zen Stone Massage",
    rating: "4.6",
    reviews: "189",
    cuisine: "Massage",
    type: "Hot Stone",
    distance: "0.8 km",
    location: "New Doha",
    image: require("../../../../assets/images/spa/galley/Rectangle 3.png"),
  },
  3: {
    id: 3,
    title: "Royal Hammam & Spa",
    rating: "4.5",
    reviews: "267",
    cuisine: "Hammam",
    type: "Traditional",
    distance: "2.1 km",
    location: "Doha Industrial Area",
    image: require("../../../../assets/images/spa/galley/Rectangle 5.png"),
  },
  4: {
    id: 4,
    title: "Harmony Couples Retreat",
    rating: "4.7",
    reviews: "412",
    cuisine: "Couples",
    type: "Message",
    distance: "1.5 km",
    location: "Fereej Abdel Aziz",
    image: require("../../../../assets/images/spa/galley/Rectangle 7.png"),
  },
  5: {
    id: 5,
    title: "Glow Beauty & Facial",
    rating: "4.4",
    reviews: "98",
    cuisine: "Facial",
    type: "Skincare",
    distance: "3.2 km",
    location: "Lekhwair",
    image: require("../../../../assets/images/spa/galley/Rectangle 8.png"),
  },
};

export default function SpaDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState("Overview");

  const spa = SPA_DATA[id] || SPA_DATA["1"];

  const showActions = activeTab !== "Menu" && activeTab !== "Gallery";

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[3]}
      >
        <SpaImageHeader image={spa.image} />
        <SpaDetailsInfo spa={spa} />

        <SpaDetailsActions />

        <SpaDetailsTabs activeTab={activeTab} onTabPress={setActiveTab} />

        {/* Tab Content */}
        <View style={styles.content}>
          {activeTab === "Overview" && <SpaOverviewContent />}
          {activeTab === "Menu" && <SpaMenuContent />}
          {activeTab === "Gallery" && <SpaGalleryContent />}
          {activeTab === "Reviews" && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Reviews</Text>
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
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
  },
});
