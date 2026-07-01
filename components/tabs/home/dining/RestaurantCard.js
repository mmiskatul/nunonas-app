import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import theme from "../../../../constants/theme";
import Button from "../../../ui/Button";

function getImageSource(restaurant) {
  if (restaurant?.image?.uri || restaurant?.image?.width) {
    return restaurant.image;
  }
  if (restaurant?.cover_image_url || restaurant?.image_url) {
    return { uri: restaurant.cover_image_url ?? restaurant.image_url };
  }
  return null;
}

function getDistanceText(restaurant) {
  const rawDistance = restaurant?.distance ?? restaurant?.distance_km;
  if (typeof rawDistance === "number") {
    return `${rawDistance.toFixed(1)} km away`;
  }
  if (rawDistance) {
    return String(rawDistance);
  }
  return "";
}

const RestaurantCard = ({ restaurant }) => {
  const router = useRouter();
  const title = restaurant?.title ?? restaurant?.name ?? "Restaurant";
  const reviews = restaurant?.reviews ?? restaurant?.reviews_count ?? 0;
  const cuisine = restaurant?.cuisine ?? restaurant?.category ?? "Dining";
  const type = restaurant?.type ?? "";
  const location =
    restaurant?.location ?? restaurant?.address ?? restaurant?.city ?? "Location unavailable";
  const imageSource = getImageSource(restaurant);
  const distanceText = getDistanceText(restaurant);

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        {imageSource ? (
          <Image source={imageSource} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]} />
        )}
        {restaurant.badge && (
          <View
            style={[
              styles.badge,
              { backgroundColor: restaurant.badgeColor || "#ef4444" },
            ]}
          >
            <Text style={styles.badgeText}>{restaurant.badge}</Text>
          </View>
        )}
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity
          style={styles.ratingRow}
          onPress={() => {
            router.push({
              pathname: `/home/reviews/${restaurant.id}`,
              params: { title: `${title} Reviews` },
            });
          }}
        >
          <Ionicons name="star" size={16} color="#f59e0b" />
          <Text style={styles.ratingText}>{restaurant.rating ?? restaurant.avg_rating ?? "4.5"}</Text>
          <Text style={styles.reviewText}>({reviews})</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.infoText}>
            {cuisine}
            {type ? ` • ${type}` : ""}
          </Text>
        </TouchableOpacity>
        <View style={styles.locationRow}>
          <Ionicons
            name="location"
            size={16}
            color={theme.COLORS.textSecondary}
          />
          <Text style={styles.locationText}>
            {[distanceText, location].filter(Boolean).join(" • ")}
          </Text>
        </View>
        <Button
          title="Book Now"
          onPress={() => router.push(`/home/dining/${restaurant.id}`)}
          style={styles.bookBtn}
          textStyle={styles.bookBtnText}
        />
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
    flex: 1,
  },
  bookBtn: {
    height: 52,
    borderRadius: 16,
  },
  bookBtnText: {
    fontSize: 18,
    fontWeight: "700",
  },
});

export default RestaurantCard;
