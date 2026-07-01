import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../../../../../constants/theme";

function getDistanceText(restaurant) {
  const rawDistance = restaurant?.distance ?? restaurant?.distance_km;
  if (typeof rawDistance === "number") {
    return `${rawDistance.toFixed(1)} km away`;
  }
  return rawDistance ? String(rawDistance) : "";
}

const DetailsInfo = ({ restaurant }) => {
  const title = restaurant?.title ?? restaurant?.name ?? "Restaurant";
  const reviews = restaurant?.reviews ?? restaurant?.reviews_count ?? 0;
  const location =
    restaurant?.location ?? restaurant?.address ?? restaurant?.city ?? "Location unavailable";
  const distance = getDistanceText(restaurant);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.ratingRow}>
        <Ionicons name="star" size={18} color="#f59e0b" />
        <Text style={styles.ratingText}>{restaurant.rating ?? "4.5"}</Text>
        <Text style={styles.reviewText}>({reviews} reviews)</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.subText}>{restaurant.cuisine ?? restaurant.category ?? "Dining"}</Text>
        <View style={styles.dot} />
        <Text style={styles.priceText}>{restaurant.priceRange || "$$$"}</Text>
      </View>

      <View style={styles.locationRow}>
        <Ionicons name="location" size={18} color={theme.COLORS.primary} />
        <Text style={styles.locationText}>
          {[location, distance].filter(Boolean).join(", ")}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.COLORS.textPrimary,
    marginLeft: 6,
  },
  reviewText: {
    fontSize: 15,
    color: theme.COLORS.textSecondary,
    marginLeft: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  subText: {
    fontSize: 15,
    color: theme.COLORS.textSecondary,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.COLORS.textSecondary,
    marginHorizontal: 10,
  },
  priceText: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.COLORS.textPrimary,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 15,
    color: theme.COLORS.textSecondary,
    marginLeft: 6,
    flex: 1,
  },
});

export default DetailsInfo;
