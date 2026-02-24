import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../../../../constants/theme";

// Import Hotel Components
import HotelSearch from "../../../../components/tabs/home/hotels/HotelSearch";
import HotelViewToggle from "../../../../components/tabs/home/hotels/HotelViewToggle";
import HotelFilters from "../../../../components/tabs/home/hotels/HotelFilters";
import HotelCard from "../../../../components/tabs/home/hotels/HotelCard";

const HOTELS_DATA = [
  {
    id: 1,
    title: "Grand Plaza Hotel",
    rating: "4.8",
    reviews: "324",
    location: "Midtown • 0.5 km away",
    price: "189",
    status: "Available",
    badge: "20% OFF",
    badgeColor: "#3b82f6",
    amenities: ["WiFi", "Pool", "Breakfast"],
    image: require("../../../../assets/images/hotel/hotel.jpg"),
  },
  {
    id: 2,
    title: "Boutiwqe Central",
    rating: "4.8",
    reviews: "199",
    location: "SoHo • 1.5 km away",
    price: "250",
    status: "Limited",
    badge: "Free Breakfast",
    badgeColor: "#3b82f6",
    amenities: ["WiFi", "Gym", "Parking"],
    image: require("../../../../assets/images/hotel/hotel 2.webp"),
  },
  {
    id: 3,
    title: "City Budget Inn",
    rating: "4.4",
    reviews: "80",
    location: "Brooklyn • 1.5 km away",
    price: "89",
    status: "Available",
    amenities: ["WiFi", "Metro", "Safe"],
    image: require("../../../../assets/images/hotel/hotel 3.webp"),
  },
  {
    id: 4,
    title: "Family Suites Hotel",
    rating: "4.6",
    reviews: "156",
    location: "Upper West Side • 1.8 km away",
    price: "89",
    status: "Available",
    badge: "Family Deal",
    badgeColor: "#3b82f6",
    amenities: ["WiFi", "Kids Club", "Restaurant"],
    image: require("../../../../assets/images/hotel/hotel 4.jpg"),
  },
];

const HotelScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HotelSearch />
        <View style={styles.headerRow}>
          <HotelViewToggle />
          <Text style={styles.resultsCount}>48 Hotels</Text>
        </View>
        <HotelFilters />

        <View style={styles.list}>
          {HOTELS_DATA.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  resultsCount: {
    fontSize: 14,
    color: theme.COLORS.textSecondary,
    fontWeight: "500",
  },
  list: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
});

export default HotelScreen;
