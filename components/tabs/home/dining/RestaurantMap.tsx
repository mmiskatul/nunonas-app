import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import theme from "../../../../constants/theme";
import { getCurrentCoords, isExpectedLocationError } from "../../../../lib/location";
import {
  normalizeRestaurantMapItems,
  type RestaurantMapItem,
} from "../../../../lib/restaurant-map";
import {
  attachRestaurantDistances,
  filterMapRestaurants,
} from "../../../../lib/map-filtering";
import type { ProviderPayload } from "../../../../lib/provider-types";
import type { GeoCoordinates } from "../../../../lib/event-map-types";
import type { MapFilterKey } from "../../../ui/MapFilterChips";

type Props = {
  restaurants: ProviderPayload[];
  loading: boolean;
  activeFilters: MapFilterKey[];
};

export default function RestaurantMap({
  restaurants,
  loading,
  activeFilters,
}: Props) {
  const router = useRouter();
  const mapRef = useRef<MapView | null>(null);
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
      const location = {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      };
      setCurrentLocation(location);
      mapRef.current?.animateCamera({ center: location, zoom: 13 }, { duration: 450 });
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

  const selectRestaurant = (restaurant: RestaurantMapItem) => {
    setSelectedId(restaurant.id);
    mapRef.current?.animateCamera(
      {
        center: {
          latitude: restaurant.latitude,
          longitude: restaurant.longitude,
        },
        zoom: 15,
      },
      { duration: 450 },
    );
  };

  const zoomBy = async (amount: number) => {
    const camera = await mapRef.current?.getCamera();
    if (!camera) return;
    mapRef.current?.animateCamera(
      { zoom: Math.min(Math.max((camera.zoom ?? 13) + amount, 3), 20) },
      { duration: 250 },
    );
  };

  const recenter = () => {
    if (!currentLocation) {
      void loadCurrentLocation();
      return;
    }
    setSelectedId(null);
    mapRef.current?.animateCamera(
      { center: currentLocation, zoom: 13 },
      { duration: 450 },
    );
  };

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
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
        showsUserLocation
        showsMyLocationButton={false}
        toolbarEnabled={false}
        mapPadding={{ top: 24, right: 24, bottom: selectedRestaurant ? 180 : 90, left: 24 }}
      >
        {mapRestaurants.map((restaurant) => {
          const selected = selectedId === restaurant.id;
          return (
            <Marker
              key={restaurant.id}
              identifier={`restaurant-${restaurant.id}`}
              coordinate={{
                latitude: restaurant.latitude,
                longitude: restaurant.longitude,
              }}
              anchor={{ x: 0.5, y: 0.5 }}
              onPress={() => selectRestaurant(restaurant)}
              zIndex={selected ? 3 : 2}
            >
              <View
                style={[styles.marker, selected && styles.markerSelected]}
                accessibilityLabel={`Restaurant: ${restaurant.title}`}
              >
                <Ionicons name="restaurant" size={17} color="#ffffff" />
              </View>
            </Marker>
          );
        })}
      </MapView>

      <View style={styles.mapControls}>
        <TouchableOpacity
          style={styles.mapControlButton}
          onPress={() => void zoomBy(1)}
          accessibilityLabel="Zoom in"
        >
          <Ionicons name="add" size={25} color={theme.COLORS.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.mapControlButton}
          onPress={() => void zoomBy(-1)}
          accessibilityLabel="Zoom out"
        >
          <Ionicons name="remove" size={25} color={theme.COLORS.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.mapControlButton}
          onPress={recenter}
          accessibilityLabel="Go to my location"
        >
          <Ionicons name="locate" size={21} color={theme.COLORS.primary} />
        </TouchableOpacity>
      </View>

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
            accessibilityLabel={`View ${selectedRestaurant.title}`}
          >
            <Ionicons name="chevron-forward" size={21} color="#ffffff" />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: "#e2e8f0",
  },
  state: {
    flex: 1,
    minHeight: 420,
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
  marker: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 3,
    borderColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.COLORS.primary,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 6,
    elevation: 7,
  },
  markerSelected: {
    transform: [{ scale: 1.18 }],
    borderColor: "#bfdbfe",
  },
  mapControls: {
    position: "absolute",
    right: 16,
    bottom: 96,
    gap: 9,
  },
  mapControlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.98)",
    ...theme.SHADOWS.card,
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
    left: 16,
    right: 16,
    bottom: 16,
    minHeight: 76,
    borderRadius: 20,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255,255,255,0.98)",
    ...theme.SHADOWS.card,
  },
  previewImage: {
    width: 56,
    height: 56,
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
    fontSize: 15,
    fontWeight: "800",
  },
  previewLocation: {
    marginTop: 3,
    color: theme.COLORS.textSecondary,
    fontSize: 12,
  },
  previewMeta: {
    marginTop: 4,
    color: theme.COLORS.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  openButton: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.COLORS.primary,
  },
});
