import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../../../../../constants/theme";
import {
  buildDirectionsUrl,
  buildPlaceUrl,
  buildStaticMapUrl,
} from "../../../../../lib/google-maps";
import type { GeoCoordinates } from "../../../../../lib/event-map-types";

type EventLocationMapProps = {
  venueName?: string;
  address?: string;
  coordinates: GeoCoordinates | null;
  origin: GeoCoordinates | null;
};

export default function EventLocationMap({
  venueName,
  address,
  coordinates,
  origin,
}: EventLocationMapProps) {
  const resolvedVenueName = venueName || "Skyline Arena";
  const resolvedAddress = address || "123 Downtown Boulevard, City Center";
  const mapUrl = buildStaticMapUrl({
    center:
      coordinates?.latitude != null && coordinates?.longitude != null
        ? `${coordinates.latitude},${coordinates.longitude}`
        : resolvedAddress,
    markerLabel: resolvedVenueName,
  });

  const handleDirections = async () => {
    const url = origin && coordinates
      ? buildDirectionsUrl(origin, coordinates)
      : coordinates
        ? buildPlaceUrl(coordinates)
        : null;

    if (!url) {
      return;
    }

    try {
      await Linking.openURL(url);
    } catch (error: unknown) {
      console.warn("Could not open event directions:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Location & Directions</Text>

      <View style={styles.mapContainer}>
        <Image
          source={
            mapUrl
              ? { uri: mapUrl }
              : require("../../../../../assets/images/discover-experience.png")
          }
          style={styles.map}
          resizeMode="cover"
        />
      </View>

      <View style={styles.venueInfo}>
        <Text style={styles.venueName}>{resolvedVenueName}</Text>
        <Text style={styles.address}>{resolvedAddress}</Text>
      </View>

      <TouchableOpacity style={styles.directionsBtn} activeOpacity={0.8} onPress={handleDirections}>
        <Ionicons name="navigate" size={20} color={theme.COLORS.textPrimary} />
        <Text style={styles.directionsText}>Get Directions</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
    marginBottom: 15,
  },
  mapContainer: {
    height: 180,
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#f3f4f6",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  venueInfo: {
    marginTop: 15,
  },
  venueName: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.COLORS.textPrimary,
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: theme.COLORS.textSecondary,
    fontWeight: "500",
  },
  directionsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
  },
  directionsText: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.COLORS.textPrimary,
  },
});


