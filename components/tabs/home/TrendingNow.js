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
import { listRestaurants } from "../../../lib/customer-api";

const TrendingNow = () => {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrending = useCallback(async () => {
    try {
      const data = await listRestaurants({ limit: 6, top_rated: true });
      const list = data?.items ?? data ?? [];
      setItems(list);
    } catch {
      // Silently fail — UI will stay empty
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

  if (!items.length) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Trending Now</Text>
        <TouchableOpacity onPress={() => router.push("/home/dining")}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {items.map((item) => (
          <TouchableOpacity
            key={item.id ?? item._id}
            style={styles.card}
            onPress={() => router.push(`/home/dining/${item.id ?? item._id}`)}
            activeOpacity={0.85}
          >
            {item.cover_image_url || item.image_url ? (
              <Image
                source={{ uri: item.cover_image_url ?? item.image_url }}
                style={styles.image}
              />
            ) : (
              <View style={[styles.image, styles.imagePlaceholder]}>
                <Ionicons name="restaurant" size={40} color={theme.COLORS.border} />
              </View>
            )}
            <View style={styles.cardContent}>
              <View style={styles.titleRow}>
                <Text style={styles.title} numberOfLines={1}>
                  {item.name}
                </Text>
                {item.avg_rating != null && (
                  <TouchableOpacity
                    style={styles.ratingBox}
                    onPress={() =>
                      router.push({
                        pathname: `/home/reviews/${item.id ?? item._id}`,
                        params: { title: `${item.name} Reviews` },
                      })
                    }
                  >
                    <Ionicons name="star" size={14} color="#f59e0b" />
                    <Text style={styles.ratingText}>
                      {Number(item.avg_rating).toFixed(1)}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              {item.area && (
                <View style={styles.locationRow}>
                  <Ionicons
                    name="location"
                    size={14}
                    color={theme.COLORS.textSecondary}
                  />
                  <Text style={styles.distance}>{item.area}</Text>
                </View>
              )}
              <Button
                title="Book Now"
                onPress={() =>
                  router.push(`/home/dining/${item.id ?? item._id}`)
                }
                style={styles.bookBtn}
                textStyle={styles.bookBtnText}
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    paddingRight: 10,
  },
  card: {
    width: 260,
    backgroundColor: theme.COLORS.white,
    borderRadius: 24,
    marginRight: 15,
    borderWidth: 1,
    borderColor: theme.COLORS.border,
    overflow: "hidden",
    ...theme.SHADOWS.card,
  },
  image: {
    width: "100%",
    height: 150,
  },
  imagePlaceholder: {
    backgroundColor: theme.COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    padding: 16,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.COLORS.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fffbeb",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#b45309",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 16,
  },
  distance: {
    fontSize: 13,
    color: theme.COLORS.textSecondary,
  },
  bookBtn: {
    height: 48,
    borderRadius: 12,
  },
  bookBtnText: {
    fontSize: 16,
  },
});

export default TrendingNow;
