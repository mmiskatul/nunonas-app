import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../../../../constants/theme";

const BookingCard = ({ item, onViewDetails }) => (
  <View style={styles.card}>
    <View style={styles.cardContent}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.cardDetails}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
        </View>
        <Text style={styles.cardCategory}>{item.category}</Text>

        <View style={styles.infoRow}>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={theme.COLORS.textSecondary}
          />
          <Text style={styles.infoText}>{item.date}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons
            name="location-outline"
            size={16}
            color={theme.COLORS.textSecondary}
          />
          <Text style={styles.infoText}>{item.location}</Text>
        </View>

        <TouchableOpacity style={styles.viewDetailsBtn} onPress={onViewDetails}>
          <Text style={styles.viewDetailsText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.COLORS.border,
    overflow: "hidden",
  },
  cardContent: {
    flexDirection: "row",
    padding: 12,
  },
  imageWrapper: {
    position: "relative",
    width: 100,
    height: 100,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  cardDetails: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
    flex: 1,
  },
  statusBadge: {
    position: "absolute",
    bottom: 5,
    left: 5,
    backgroundColor: "rgba(34, 197, 94, 0.9)", // theme.COLORS.success with opacity
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "800",
    color: theme.COLORS.white,
  },
  cardCategory: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.COLORS.primary,
    marginTop: 2,
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  infoText: {
    fontSize: 12,
    color: theme.COLORS.textSecondary,
    marginLeft: 6,
    fontWeight: "500",
  },
  viewDetailsBtn: {
    alignSelf: "flex-start",
    marginTop: 2,
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.COLORS.primary,
  },
});

export default BookingCard;
