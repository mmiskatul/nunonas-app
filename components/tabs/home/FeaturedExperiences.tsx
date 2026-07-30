// @ts-nocheck
import React, { useMemo } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import theme from "../../../constants/theme";
import Button from "../../ui/Button";
import { formatDistanceKm } from "../../../lib/distance";
import { calculateDistanceKm } from "../../../lib/distance";
import { useHomeFeedQuery, dedupeFeedItems } from "../../../lib/queries/homeQueries";
import { useAppSelector } from "../../../store/hooks";

function normalizeItems(payload) {
  const items = payload?.featured_experiences;
  return Array.isArray(items) ? dedupeFeedItems(items) : [];
}

function routeFor(item) {
  if (item.detail_route) return item.detail_route;
  const id = item.id ?? item._id;
  const category = String(item.service_type ?? item.entity_type ?? item.category ?? "").toLowerCase();
  if (category === "hotel") return `/home/hotels/${id}`;
  if (category === "spa") return `/home/spa/${id}`;
  if (category === "event") return `/home/events/${id}`;
  return `/home/dining/${id}`;
}

const FeaturedExperiences = () => {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useHomeFeedQuery();
  const coords = useAppSelector((state) => state.location.coords);
  const items = useMemo(() => normalizeItems(data).map((item) => {
    const distanceKm = calculateDistanceKm(coords, item);
    return distanceKm == null ? item : { ...item, distance_km: distanceKm };
  }), [data, coords]);

  if (isLoading) {
    return <ActivityIndicator style={styles.loading} color={theme.COLORS.primary} />;
  }

  if (isError) {
    return <TouchableOpacity style={styles.status} onPress={() => refetch()}>
      <Text style={styles.statusText}>Featured experiences are unavailable. Tap to retry.</Text>
    </TouchableOpacity>;
  }

  if (!items.length) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Featured Experiences</Text>
      <View style={styles.list}>
        {items.map((item, index) => {
          const id = item.id ?? item._id;
          const title = item.name ?? item.title ?? item.business_name;
          const route = routeFor(item);
          const image = item.profile_image_url ?? item.cover_image_url ?? item.image_url ?? item.image;
          return (
          <TouchableOpacity key={`${String(item.service_type ?? item.entity_type ?? item.category ?? "experience")}-${id}-${index}`} style={styles.card} activeOpacity={0.9} onPress={() => router.push(route)}>
              {image ? <Image source={{ uri: image }} style={styles.image} /> : (
                <View style={[styles.image, styles.imagePlaceholder]}>
                  <Ionicons name="business-outline" size={34} color={theme.COLORS.border} />
                </View>
              )}
              <View style={styles.cardContent}>
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                <View style={styles.detailsRow}>
                  {item.avg_rating != null && <>
                    <Ionicons name="star" size={14} color="#f59e0b" />
                    <Text style={styles.ratingText}>{Number(item.avg_rating).toFixed(1)}</Text>
                    <Text style={styles.separator}>•</Text>
                  </>}
                  <Text style={styles.distance}>{formatDistanceKm(item.distance_km) ?? "Nearby"}</Text>
                </View>
                <Button title={String(item.category ?? "Explore").toLowerCase() === "hotel" ? "Book Stay" : "Explore"} onPress={() => router.push(route)} style={styles.actionBtn} textStyle={styles.actionBtnText} />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loading: { marginTop: 30 },
  container: { paddingHorizontal: 20, marginTop: 30, paddingBottom: 40 },
  sectionTitle: { fontSize: 20, fontWeight: "800", color: theme.COLORS.textPrimary, marginBottom: 16 },
  list: { gap: 16 },
  card: { flexDirection: "row", backgroundColor: theme.COLORS.white, borderRadius: 24, borderWidth: 1, borderColor: theme.COLORS.border, padding: 12, alignItems: "center", ...theme.SHADOWS.card },
  image: { width: 100, height: 100, borderRadius: 16 },
  imagePlaceholder: { backgroundColor: theme.COLORS.surface, justifyContent: "center", alignItems: "center" },
  cardContent: { flex: 1, marginLeft: 16, justifyContent: "center" },
  title: { fontSize: 17, fontWeight: "700", color: theme.COLORS.textPrimary, marginBottom: 6 },
  detailsRow: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 12 },
  ratingText: { fontSize: 14, fontWeight: "700", color: theme.COLORS.textPrimary },
  separator: { color: theme.COLORS.textSecondary },
  distance: { fontSize: 13, color: theme.COLORS.textSecondary },
  status: { marginHorizontal: 20, marginTop: 24, padding: 16, borderRadius: 14, backgroundColor: theme.COLORS.surface },
  statusText: { textAlign: "center", color: theme.COLORS.textSecondary, fontSize: 13 },
  actionBtn: { height: 36, borderRadius: 8, width: 110, paddingHorizontal: 12 },
  actionBtnText: { fontSize: 14 },
});

export default FeaturedExperiences;
