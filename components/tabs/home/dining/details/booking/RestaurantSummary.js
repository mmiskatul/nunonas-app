import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../../../../../../constants/theme";

const RestaurantSummary = ({ restaurant }) => {
  return (
    <View style={styles.restaurantCard}>
      <Text style={styles.restaurantName}>{restaurant.title}</Text>
      <Text style={styles.restaurantAddress}>123 Oak Street, Downtown</Text>
      <View style={styles.ratingRow}>
        <Ionicons name="star" size={16} color="#fbbf24" />
        <Text style={styles.ratingText}>{restaurant.rating}</Text>
        <Text style={styles.reviewsText}>({restaurant.reviews} reviews)</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  restaurantCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.COLORS.border,
    backgroundColor: theme.COLORS.white,
    marginBottom: 25,
    ...theme.SHADOWS.card,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.COLORS.textPrimary,
    marginBottom: 4,
  },
  restaurantAddress: {
    fontSize: 14,
    color: theme.COLORS.textSecondary,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.COLORS.textPrimary,
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 14,
    color: theme.COLORS.textSecondary,
    marginLeft: 4,
  },
});

export default RestaurantSummary;
