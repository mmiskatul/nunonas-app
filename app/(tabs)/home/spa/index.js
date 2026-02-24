import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../../../../constants/theme";

// Import Spa Components
import SpaSearch from "../../../../components/tabs/home/spa/SpaSearch";
import SpaViewToggle from "../../../../components/tabs/home/spa/SpaViewToggle";
import SpaFilters from "../../../../components/tabs/home/spa/SpaFilters";
import SpaCard from "../../../../components/tabs/home/spa/SpaCard";

const SPA_DATA = [
  {
    id: 1,
    title: "Serenity Spa & Wellness",
    rating: "4.8",
    reviews: "324",
    cuisine: "Massage",
    type: "Wellness",
    distance: "1.2 km",
    location: "Al Qassar",
    badge: "20% OFF",
    badgeColor: "#ef4444",
    image: require("../../../../assets/images/spa/galley/Rectangle 2.png"),
  },
  {
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
  {
    id: 3,
    title: "Royal Hammam & Spa",
    rating: "4.5",
    reviews: "267",
    cuisine: "Hammam",
    type: "Traditional",
    distance: "2.1 km",
    location: "Doha Industrial Area",
    badge: "New Opening",
    badgeColor: "#3b82f6",
    image: require("../../../../assets/images/spa/galley/Rectangle 5.png"),
  },
  {
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
  {
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
];

export default function SpaScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SpaSearch />
        <SpaViewToggle count={SPA_DATA.length} />
        <SpaFilters />

        <View style={styles.list}>
          {SPA_DATA.map((spa) => (
            <SpaCard key={spa.id} spa={spa} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  list: {
    marginTop: 5,
    paddingBottom: 20,
  },
});
