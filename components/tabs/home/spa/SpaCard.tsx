// @ts-nocheck
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import theme from "../../../../constants/theme";

const SpaCard = ({ spa }) => {
  const router = useRouter();

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        {spa.image ? <Image source={typeof spa.image === "string" ? { uri: spa.image } : spa.image} style={styles.image} /> : <View style={[styles.image, styles.imagePlaceholder]}><Ionicons name="image-outline" size={42} color={theme.COLORS.textSecondary} /></View>}
        {spa.badge && (
          <View
            style={[
              styles.badge,
              { backgroundColor: spa.badgeColor || "#ef4444" },
            ]}
          >
            <Text style={styles.badgeText}>{spa.badge}</Text>
          </View>
        )}
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.title}>{spa.title}</Text>
        <TouchableOpacity
          style={styles.ratingRow}
          onPress={() => {
            router.push({
              pathname: `/home/reviews/${spa.id}`,
              params: { title: `${spa.title} Reviews` },
            });
          }}
        >
          <Ionicons name="star" size={16} color="#f59e0b" />
          <Text style={styles.ratingText}>{spa.rating}</Text>
          <Text style={styles.reviewText}>({spa.reviews})</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.infoText}>
            {spa.cuisine} • {spa.type}
          </Text>
        </TouchableOpacity>
        <View style={styles.locationRow}>
          <Ionicons
            name="location"
            size={16}
            color={theme.COLORS.textSecondary}
          />
          <Text style={styles.locationText}>
            {spa.distance} • {spa.location}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.detailsBtn}
          activeOpacity={0.8}
          onPress={() => router.push(`/home/spa/${spa.id}`)}
        >
          <Text style={styles.detailsBtnText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 24,
    marginHorizontal: 20,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.COLORS.border,
    ...theme.SHADOWS.card,
  },
  imageContainer: {
    height: 200,
    width: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.COLORS.surface,
  },
  badge: {
    position: "absolute",
    top: 16,
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    color: theme.COLORS.white,
    fontWeight: "800",
    fontSize: 12,
  },
  cardContent: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.COLORS.textPrimary,
    marginLeft: 4,
  },
  reviewText: {
    fontSize: 14,
    color: theme.COLORS.textSecondary,
    marginLeft: 4,
  },
  dot: {
    marginHorizontal: 6,
    color: theme.COLORS.textSecondary,
  },
  infoText: {
    fontSize: 14,
    color: theme.COLORS.textSecondary,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    color: theme.COLORS.textSecondary,
    marginLeft: 4,
  },
  detailsBtn: {
    backgroundColor: theme.COLORS.primary,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  detailsBtnText: {
    color: theme.COLORS.white,
    fontSize: 18,
    fontWeight: "700",
  },
});

export default SpaCard;


