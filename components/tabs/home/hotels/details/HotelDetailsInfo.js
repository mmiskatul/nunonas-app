import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../../../../../constants/theme";

const HotelDetailsInfo = ({ hotel }) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>{hotel.title}</Text>
          <View style={styles.locationRow}>
            <View style={styles.ratingBox}>
              <Ionicons name="star" size={14} color="#facc15" />
              <Text style={styles.ratingText}>{hotel.rating}</Text>
              <Text style={styles.reviewsText}>({hotel.reviews})</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.locationBox}>
              <Ionicons
                name="location-outline"
                size={14}
                color={theme.COLORS.textSecondary}
              />
              <Text style={styles.locationText}>Downtown, Midtown</Text>
            </View>
          </View>
        </View>
        <View style={styles.priceColumn}>
          <Text style={styles.price}>${hotel.price}</Text>
          <Text style={styles.perNight}>/night</Text>
        </View>
      </View>

      <View style={styles.statusRow}>
        <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
        <Text style={styles.statusText}>Available Now</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: theme.COLORS.white,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.COLORS.textPrimary,
  },
  reviewsText: {
    fontSize: 14,
    color: theme.COLORS.textSecondary,
  },
  divider: {
    width: 1,
    height: 14,
    backgroundColor: "#ddd",
    marginHorizontal: 12,
  },
  locationBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    color: theme.COLORS.textSecondary,
  },
  priceColumn: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1e3a8a",
  },
  perNight: {
    fontSize: 14,
    color: theme.COLORS.textSecondary,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#22c55e",
  },
});

export default HotelDetailsInfo;
