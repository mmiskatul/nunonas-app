import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import theme from "../../../../constants/theme";

// Import Dining Components
import DiningSearch from "../../../../components/tabs/home/dining/DiningSearch";
import DiningViewToggle from "../../../../components/tabs/home/dining/DiningViewToggle";
import DiningFilters from "../../../../components/tabs/home/dining/DiningFilters";
import RestaurantCard from "../../../../components/tabs/home/dining/RestaurantCard";

const RESTAURANTS = [
  {
    id: 1,
    title: "The Golden Spoon",
    rating: "4.8",
    reviews: "324",
    cuisine: "Italian",
    type: "Fine Dining",
    distance: "1.2 km",
    location: "Al Qassar",
    badge: "30% OFF",
    badgeColor: "#ef4444",
    image: require("../../../../assets/images/discover-experience.png"),
  },
  {
    id: 3,
    title: "Brew & Bite",
    rating: "4.5",
    reviews: "257",
    cuisine: "Cafe",
    type: "Continental",
    distance: "2.1 km",
    location: "Doha Industrial Area",
    badge: "Free Delivery",
    badgeColor: "#22c55e",
    image: require("../../../../assets/images/plan-smarter-with-ai.png"),
  },
  {
    id: 2,
    title: "Sakura Sushi",
    rating: "4.6",
    reviews: "189",
    cuisine: "Japanese",
    type: "Sushi",
    distance: "0.8 km",
    location: "New Doha",
    image: require("../../../../assets/images/discover-experience.png"),
  },
  {
    id: 4,
    title: "Mediterranean Breeze",
    rating: "4.4",
    reviews: "98",
    cuisine: "Mediterranean",
    type: "Healthy",
    distance: "3.2 km",
    location: "Lekhwair",
    badge: "New",
    badgeColor: "#3b82f6",
    image: require("../../../../assets/images/plan-smarter-with-ai.png"),
  },
];

export default function DiningScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <DiningSearch />
        <DiningViewToggle />
        <DiningFilters />

        <View style={styles.list}>
          {RESTAURANTS.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
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
