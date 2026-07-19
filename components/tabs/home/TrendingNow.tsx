// @ts-nocheck
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import theme from "../../../constants/theme";
import Button from "../../ui/Button";
import { getTrendingHotels } from "../../../lib/customer-api";

function getLocationLabel(item) {
  const rawLocation =
    item?.location_label ??
    item?.location ??
    item?.address ??
    item?.city;

  if (rawLocation == null) {
    return "";
  }

  return String(rawLocation).trim();
}

function normalizeTrendingItems(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  return [];
}

function getDistanceLabel(item) {
  const rawDistance =
    item?.distance ??
    item?.distance_km ??
    item?.proximity_km ??
    item?.nearby_distance ??
    item?.area;

  if (rawDistance == null || rawDistance === "") {
    return "Nearby";
  }

  if (typeof rawDistance === "number") {
    return `${rawDistance.toFixed(1)} km away`;
  }

  const normalized = String(rawDistance).trim();
  if (!normalized) {
    return "Nearby";
  }

  if (normalized.toLowerCase().includes("km")) {
    return normalized.toLowerCase().includes("away") ? normalized : `${normalized} away`;
  }

  return normalized;
}

function getDetailRoute(item) {
  if (item?.detail_route) {
    return item.detail_route;
  }

  const itemId = item?.id ?? item?._id;
  const type = String(item?.entity_type ?? item?.category ?? "").toLowerCase();
  if (type === "hotel") return `/home/hotels/${itemId}`;
  if (type === "spa") return `/home/spa/${itemId}`;
  if (type === "event") return `/home/events/${itemId}`;
  return `/home/dining/${itemId}`;
}

const TrendingNow = () => {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrending = useCallback(async () => {
    try {
      const trendingHotels = await getTrendingHotels(6);
      setItems(normalizeTrendingItems(trendingHotels));
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={theme.COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Trending Now</Text>
        <TouchableOpacity onPress={() => router.push("/home/hotels")}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {items.length ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {items.map((item, index) => {
            const itemId = item.id ?? item._id ?? `trending-${index}`;
            const title = item.name ?? item.title ?? "Trending Place";
            const detailRoute = getDetailRoute(item);

            return (
              <TouchableOpacity
                key={itemId}
                style={styles.card}
                onPress={() => router.push(detailRoute)}
                activeOpacity={0.9}
              >
                {item.cover_image_url || item.image_url ? (
                  <Image
                    source={{ uri: item.cover_image_url ?? item.image_url }}
                    style={styles.image}
                  />
                ) : (
                  <View style={[styles.image, styles.imagePlaceholder]}>
                    <Ionicons name="restaurant" size={42} color={theme.COLORS.border} />
                  </View>
                )}

                <View style={styles.cardContent}>
                  <View style={styles.titleRow}>
                    <Text style={styles.title} numberOfLines={1}>
                      {title}
                    </Text>

                    {item.avg_rating != null && (
                      <TouchableOpacity
                        style={styles.ratingBox}
                        onPress={() =>
                          router.push({
                            pathname: `/home/reviews/${itemId}`,
                            params: { title: `${title} Reviews` },
                          })
                        }
                      >
                        <Ionicons name="star" size={18} color="#f59e0b" />
                        <Text style={styles.ratingText}>
                          {Number(item.avg_rating).toFixed(1)}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={styles.locationRow}>
                    <Ionicons name="location" size={18} color="#9ca3af" />
                    <Text style={styles.distance}>{getDistanceLabel(item)}</Text>
                  </View>

                  {!!getLocationLabel(item) && (
                    <Text style={styles.locationText} numberOfLines={1}>
                      {getLocationLabel(item)}
                    </Text>
                  )}

                  <Button
                    title="Book Now"
                    onPress={() => router.push(detailRoute)}
                    style={styles.bookBtn}
                    textStyle={styles.bookBtnText}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="bed-outline" size={28} color={theme.COLORS.textSecondary} />
          <Text style={styles.emptyTitle}>No trending hotels right now</Text>
          <Text style={styles.emptyText}>
            Hotels appear here when they have an available room.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  container: {
    marginTop: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.COLORS.textLink,
  },
  scrollContent: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  emptyState: {
    marginHorizontal: 20,
    minHeight: 120,
    borderRadius: 24,
    backgroundColor: theme.COLORS.surface,
    borderWidth: 1,
    borderColor: theme.COLORS.border,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
    textAlign: "center",
  },
  emptyText: {
    marginTop: 4,
    fontSize: 13,
    color: theme.COLORS.textSecondary,
    textAlign: "center",
  },
  card: {
    width: 320,
    backgroundColor: theme.COLORS.white,
    borderRadius: 30,
    marginRight: 18,
    borderWidth: 1,
    borderColor: "#eef0f6",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  image: {
    width: "100%",
    height: 220,
  },
  imagePlaceholder: {
    backgroundColor: theme.COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 20,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  title: {
    fontSize: 19,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
    flex: 1,
    marginRight: 12,
  },
  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff7e8",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 4,
  },
  ratingText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#b45309",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 20,
  },
  distance: {
    fontSize: 15,
    color: "#6b7280",
    fontWeight: "500",
  },
  locationText: {
    marginTop: -12,
    marginBottom: 18,
    fontSize: 14,
    color: "#8b95a7",
  },
  bookBtn: {
    height: 56,
    borderRadius: 18,
    backgroundColor: "#29439a",
  },
  bookBtnText: {
    fontSize: 17,
    fontWeight: "800",
  },
});

export default TrendingNow;


