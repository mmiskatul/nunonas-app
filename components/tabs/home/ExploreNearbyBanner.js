import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import theme from "../../../constants/theme";
import { reverseGeocode } from "../../../lib/google-maps";

const { width } = Dimensions.get("window");

const ExploreNearbyBanner = () => {
  const router = useRouter();
  const [showMap, setShowMap] = useState(false); // Toggle state: false = default image-like card, true = expanded map card
  const [gpsCoords, setGpsCoords] = useState({ latitude: 25.2854, longitude: 51.5310 });
  const [address, setAddress] = useState("Doha, Qatar");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCoords() {
      try {
        setLoading(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const position = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setGpsCoords({ latitude: lat, longitude: lng });
          
          const addr = await reverseGeocode(lat, lng);
          if (addr) {
            setAddress(addr);
          }
        }
      } catch (e) {
        console.warn("Error fetching coords for map card: ", e);
      } finally {
        setLoading(false);
      }
    }
    getCoords();
  }, []);

  if (showMap) {
    // STATE 2: Expanded Live Map Card (with address footer)
    return (
      <View style={styles.container}>
        <View style={styles.mapCard}>
          {/* Map Preview section */}
          <View style={styles.mapPreviewContainer}>
            {loading ? (
              <View style={styles.mapPlaceholder}>
                <ActivityIndicator size="small" color={theme.COLORS.primary} />
              </View>
            ) : (
              <MapView
                provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
                style={styles.staticMap}
                initialRegion={{
                  latitude: gpsCoords.latitude,
                  longitude: gpsCoords.longitude,
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.0121,
                }}
                scrollEnabled={true}
                zoomEnabled={true}
                pitchEnabled={true}
                rotateEnabled={true}
              >
                <Marker
                  coordinate={{
                    latitude: gpsCoords.latitude,
                    longitude: gpsCoords.longitude,
                  }}
                  pinColor="red"
                />
              </MapView>
            )}

            {/* Toggle Button at the top right of the whole card */}
            <TouchableOpacity
              style={styles.topRightToggleBtn}
              onPress={() => setShowMap(false)}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-up" size={20} color="#1e3a8a" />
            </TouchableOpacity>

            {/* Open Live Map Button */}
            <TouchableOpacity
              style={styles.openMapBtn}
              activeOpacity={0.9}
              onPress={() => {
                router.push("/map");
              }}
            >
              <Ionicons name="map" size={16} color={theme.COLORS.white} />
              <Text style={styles.openMapBtnText}>Open Live Map</Text>
            </TouchableOpacity>
          </View>

          {/* Card Details Footer */}
          <View style={styles.cardFooter}>
            <View style={styles.locationInfo}>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={16} color={theme.COLORS.primary} />
                <Text style={styles.locationLabel}>Active Location</Text>
              </View>
              <Text style={styles.locationText} numberOfLines={1}>
                {address}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.refreshBtn}
              onPress={() => {
                router.push("/map");
              }}
            >
              <Ionicons name="navigate-outline" size={18} color={theme.COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // STATE 1: Default Image Card Layout (Map background + white card overlaid)
  return (
    <View style={styles.container}>
      <View style={styles.bannerCard}>
        {/* Functional Live Map Background */}
        {loading ? (
          <View style={styles.mapPlaceholder}>
            <ActivityIndicator size="small" color={theme.COLORS.primary} />
          </View>
        ) : (
          <MapView
            provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
            style={StyleSheet.absoluteFillObject}
            initialRegion={{
              latitude: gpsCoords.latitude,
              longitude: gpsCoords.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}
            scrollEnabled={true}
            zoomEnabled={true}
            pitchEnabled={false}
            rotateEnabled={false}
          >
            {/* Martini/Cocktail Icon Marker (Functional/Interactable) */}
            <Marker
              coordinate={{
                latitude: gpsCoords.latitude + 0.003,
                longitude: gpsCoords.longitude - 0.003,
              }}
              title="Nearby Lounge"
              description="Happy hour deals nearby"
            >
              <View style={[styles.badge, { position: "relative" }]}>
                <Ionicons name="wine" size={16} color="#ffffff" />
              </View>
            </Marker>

            {/* Bed/Hotel Icon Marker (Functional/Interactable) */}
            <Marker
              coordinate={{
                latitude: gpsCoords.latitude + 0.002,
                longitude: gpsCoords.longitude + 0.004,
              }}
              title="Grand Plaza Hotel"
              description="Exclusive stay promotions"
            >
              <View style={[styles.badge, styles.badgeBed, { position: "relative" }]}>
                <Ionicons name="bed" size={15} color="#ffffff" />
              </View>
            </Marker>
          </MapView>
        )}

        {/* Toggle Button at the top right of the whole card */}
        <TouchableOpacity
          style={styles.topRightToggleBtn}
          onPress={() => setShowMap(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-down" size={20} color="#1e3a8a" />
        </TouchableOpacity>

        {/* Foreground Card Overlaid on top of Map */}
        <View style={styles.overlaidCard}>
          <Text style={styles.title}>Explore Nearby Offers</Text>
          <Text style={styles.sparkles}>✨</Text>
          
          <Text style={styles.description}>
            Discover happy hours, events, hotels, and exclusive promotions around you.
          </Text>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => router.push("/map")}
          >
            <Ionicons name="map-outline" size={16} color="#ffffff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Open Live Map</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  bannerCard: {
    height: 360,
    borderRadius: 28,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#e2ebd9",
    borderWidth: 1,
    borderColor: theme.COLORS.border,
    ...theme.SHADOWS.card,
  },
  badge: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2e489a", // Deep Blue
    width: 36,
    height: 36,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  badgeBed: {
    backgroundColor: "#4c8ccb", // Light Blue
  },
  topRightToggleBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#ffffff",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 100, // Make sure it sits above map/markers
  },
  overlaidCard: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: "#ffffff",
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1e3a8a",
    textAlign: "center",
    marginBottom: 2,
  },
  sparkles: {
    fontSize: 16,
    marginVertical: 4,
    color: "#f59e0b",
  },
  description: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 14,
    paddingHorizontal: 6,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#4285f4",
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    shadowColor: "#4285f4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonIcon: {
    marginRight: 6,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
  // Map Card styles
  mapCard: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.COLORS.border,
    overflow: "hidden",
    ...theme.SHADOWS.card,
  },
  mapPreviewContainer: {
    height: 220,
    position: "relative",
    width: "100%",
  },
  staticMap: {
    height: "100%",
    width: "100%",
  },
  mapPlaceholder: {
    alignItems: "center",
    backgroundColor: theme.COLORS.surface,
    height: "100%",
    justifyContent: "center",
    width: "100%",
  },
  openMapBtn: {
    alignItems: "center",
    backgroundColor: theme.COLORS.primary,
    borderRadius: 20,
    bottom: 12,
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    position: "absolute",
    right: 12,
    ...theme.SHADOWS.primary,
    zIndex: 99,
  },
  openMapBtnText: {
    color: theme.COLORS.white,
    fontSize: 13,
    fontWeight: "700",
  },
  cardFooter: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  locationInfo: {
    flex: 1,
    gap: 4,
  },
  locationRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  locationLabel: {
    color: theme.COLORS.textSecondary,
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  locationText: {
    color: theme.COLORS.textPrimary,
    fontSize: 15,
    fontWeight: "700",
  },
  refreshBtn: {
    alignItems: "center",
    backgroundColor: "#F0F4FF",
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
});

export default ExploreNearbyBanner;
