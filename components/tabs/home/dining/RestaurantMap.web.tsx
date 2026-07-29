import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import theme from "../../../../constants/theme";
import type { GeoCoordinates } from "../../../../lib/event-map-types";
import { getCurrentCoords, isExpectedLocationError } from "../../../../lib/location";
import {
  normalizeRestaurantMapItems,
} from "../../../../lib/restaurant-map";
import {
  attachRestaurantDistances,
  filterMapRestaurants,
} from "../../../../lib/map-filtering";
import type { ProviderPayload } from "../../../../lib/provider-types";
import GoogleWebMap from "../../../ui/GoogleWebMap";
import type { MapFilterKey } from "../../../ui/MapFilterChips";

type Props = {
  restaurants: ProviderPayload[];
  loading: boolean;
  activeFilters: MapFilterKey[];
};

export default function RestaurantMapWeb({
  restaurants,
  loading,
  activeFilters,
}: Props) {
  const router = useRouter();
  const [currentLocation, setCurrentLocation] = useState<GeoCoordinates | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const mapRestaurants = useMemo(
    () =>
      filterMapRestaurants(
        attachRestaurantDistances(
          normalizeRestaurantMapItems(restaurants),
          currentLocation,
        ),
        activeFilters,
      ),
    [activeFilters, currentLocation, restaurants],
  );
  const selectedRestaurant =
    mapRestaurants.find((restaurant) => restaurant.id === selectedId) ?? null;

  const loadCurrentLocation = useCallback(async () => {
    setLocationLoading(true);
    setLocationError("");
    try {
      const coordinates = await getCurrentCoords();
      if (!coordinates) {
        setLocationError("Turn on location access to see nearby restaurants.");
        return;
      }
      setCurrentLocation({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      });
    } catch (error: unknown) {
      setLocationError("Your current location could not be loaded. Please try again.");
      if (!isExpectedLocationError(error)) {
        console.error("Restaurant map location failed:", error);
      }
    } finally {
      setLocationLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCurrentLocation();
  }, [loadCurrentLocation]);

  useEffect(() => {
    if (selectedId && !mapRestaurants.some((restaurant) => restaurant.id === selectedId)) {
      setSelectedId(null);
    }
  }, [mapRestaurants, selectedId]);

  if (!currentLocation) {
    return (
      <View style={styles.state}>
        {locationLoading ? (
          <>
            <ActivityIndicator size="large" color={theme.COLORS.primary} />
            <Text style={styles.stateTitle}>Finding nearby restaurants…</Text>
            <Text style={styles.stateText}>
              The map opens after your real location is available.
            </Text>
          </>
        ) : (
          <>
            <Ionicons name="location-outline" size={38} color={theme.COLORS.primary} />
            <Text style={styles.stateTitle}>Location needed</Text>
            <Text style={styles.stateText}>{locationError}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => void loadCurrentLocation()}>
              <Text style={styles.retryText}>Try again</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GoogleWebMap
        center={
          selectedRestaurant
            ? {
                latitude: selectedRestaurant.latitude,
                longitude: selectedRestaurant.longitude,
              }
            : currentLocation
        }
        markers={mapRestaurants.map((restaurant) => ({
          id: restaurant.id,
          title: restaurant.title,
          latitude: restaurant.latitude,
          longitude: restaurant.longitude,
          kind: "restaurant",
        }))}
        selectedId={selectedId}
        onMarkerPress={(marker) => setSelectedId(marker.id)}
        height={560}
        zoomLevel={selectedRestaurant ? 15 : 13}
        showCenterMarker={!selectedRestaurant}
      />

      {loading ? (
        <View style={styles.loadingBadge}>
          <ActivityIndicator size="small" color={theme.COLORS.primary} />
          <Text style={styles.loadingText}>Updating restaurants</Text>
        </View>
      ) : mapRestaurants.length === 0 ? (
        <View style={styles.emptyBadge}>
          <Text style={styles.emptyText}>No restaurants with map locations found.</Text>
        </View>
      ) : null}

      {selectedRestaurant ? (
        <View style={styles.previewCard}>
          {selectedRestaurant.imageUrl ? (
            <Image source={{ uri: selectedRestaurant.imageUrl }} style={styles.previewImage} />
          ) : (
            <View style={[styles.previewImage, styles.previewFallback]}>
              <Ionicons name="restaurant" size={24} color="#ffffff" />
            </View>
          )}
          <View style={styles.previewBody}>
            <Text style={styles.previewTitle} numberOfLines={1}>
              {selectedRestaurant.title}
            </Text>
            <Text style={styles.previewLocation} numberOfLines={1}>
              {selectedRestaurant.location}
            </Text>
            <Text style={styles.previewMeta}>
              {selectedRestaurant.rating != null
                ? `★ ${selectedRestaurant.rating.toFixed(1)} · `
                : ""}
              {selectedRestaurant.distanceText}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.openButton}
            onPress={() => router.push(`/home/dining/${selectedRestaurant.id}`)}
          >
            <Text style={styles.openButtonText}>View restaurant</Text>
            <Ionicons name="chevron-forward" size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: 560,
    overflow: "hidden",
    backgroundColor: "#e2e8f0",
  },
  state: {
    flex: 1,
    minHeight: 560,
    paddingHorizontal: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eff6ff",
  },
  stateTitle: {
    marginTop: 13,
    color: theme.COLORS.textPrimary,
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
  },
  stateText: {
    marginTop: 7,
    color: theme.COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 18,
    borderRadius: 14,
    backgroundColor: theme.COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 11,
  },
  retryText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "800",
  },
  loadingBadge: {
    position: "absolute",
    top: 14,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: "rgba(255,255,255,0.97)",
    ...theme.SHADOWS.card,
  },
  loadingText: {
    color: theme.COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "700",
  },
  emptyBadge: {
    position: "absolute",
    top: 14,
    left: 20,
    right: 20,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(255,255,255,0.97)",
    ...theme.SHADOWS.card,
  },
  emptyText: {
    color: theme.COLORS.textSecondary,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  previewCard: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 18,
    minHeight: 82,
    borderRadius: 20,
    padding: 11,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255,255,255,0.98)",
    ...theme.SHADOWS.card,
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: "#dbeafe",
  },
  previewFallback: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.COLORS.primary,
  },
  previewBody: {
    flex: 1,
    minWidth: 0,
  },
  previewTitle: {
    color: theme.COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "800",
  },
  previewLocation: {
    marginTop: 3,
    color: theme.COLORS.textSecondary,
    fontSize: 12,
  },
  previewMeta: {
    marginTop: 5,
    color: theme.COLORS.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  openButton: {
    minHeight: 44,
    borderRadius: 15,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: theme.COLORS.primary,
  },
  openButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "800",
  },
});
