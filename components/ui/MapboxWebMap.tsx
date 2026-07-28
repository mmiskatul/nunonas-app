import RNMapbox from "@rnmapbox/maps";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import theme from "../../constants/theme";
import { MAPBOX_ACCESS_TOKEN } from "../../lib/mapbox";
import type { GeoCoordinates } from "../../lib/event-map-types";

export type MapboxWebMarker = {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  imageUrl?: string | null;
};

type Props = {
  center: GeoCoordinates;
  markers?: MapboxWebMarker[];
  selectedId?: string | null;
  onMarkerPress?: (marker: MapboxWebMarker) => void;
  height?: number;
  zoomLevel?: number;
  showCenterMarker?: boolean;
};

RNMapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

export default function MapboxWebMap({
  center,
  markers = [],
  selectedId,
  onMarkerPress,
  height = 260,
  zoomLevel = 13,
  showCenterMarker = true,
}: Props) {
  if (!MAPBOX_ACCESS_TOKEN) {
    return (
      <View style={[styles.unavailable, { height }]}>
        <Text style={styles.unavailableText}>Mapbox access token is not configured.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }]}>
      <RNMapbox.MapView style={styles.map} styleURL={RNMapbox.StyleURL.Street}>
        <RNMapbox.Camera
          key={`${center.longitude}-${center.latitude}-${selectedId ?? ""}`}
          centerCoordinate={[center.longitude, center.latitude]}
          zoomLevel={zoomLevel}
        />
        {showCenterMarker ? (
          <RNMapbox.MarkerView
            id="mapbox-current-location"
            coordinate={[center.longitude, center.latitude]}
          >
            <View style={styles.currentLocationMarker}>
              <View style={styles.currentLocationDot} />
            </View>
          </RNMapbox.MarkerView>
        ) : null}
        {markers.map((marker) => (
          <RNMapbox.MarkerView
            key={marker.id}
            id={`web-event-${marker.id}`}
            coordinate={[marker.longitude, marker.latitude]}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => onMarkerPress?.(marker)}
              style={[
                styles.markerRing,
                selectedId === marker.id ? styles.markerRingSelected : null,
              ]}
              accessibilityLabel={`Event location: ${marker.title}`}
            >
              {marker.imageUrl ? (
                <Image source={{ uri: marker.imageUrl }} style={styles.markerImage} />
              ) : (
                <View style={[styles.markerImage, styles.markerFallback]}>
                  <Text style={styles.markerFallbackText}>
                    {marker.title.slice(0, 1).toUpperCase()}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </RNMapbox.MarkerView>
        ))}
      </RNMapbox.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#dbeafe",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  markerRing: {
    width: 50,
    height: 50,
    borderRadius: 25,
    padding: 3,
    borderWidth: 3,
    borderColor: "#ffffff",
    backgroundColor: "#ffffff",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.28,
    shadowRadius: 7,
  },
  currentLocationMarker: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 4,
    borderColor: "#ffffff",
    backgroundColor: "#2563eb",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.24,
    shadowRadius: 5,
  },
  currentLocationDot: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: "#2563eb",
  },
  markerRingSelected: {
    borderColor: theme.COLORS.primary,
    transform: [{ scale: 1.12 }],
  },
  markerImage: {
    width: "100%",
    height: "100%",
    borderRadius: 21,
  },
  markerFallback: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.COLORS.primary,
  },
  markerFallbackText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
  unavailable: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#eff6ff",
  },
  unavailableText: {
    color: theme.COLORS.textSecondary,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "600",
  },
});
