import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import theme from "../constants/theme";
import { reverseGeocode } from "../lib/google-maps";

const { width, height } = Dimensions.get("window");

export default function MapScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState(null);
  const [addressText, setAddressText] = useState("Loading address...");

  useEffect(() => {
    async function initMap() {
      try {
        let latitude = 25.2854; // Default Doha
        let longitude = 51.5310;

        // Try getting current location first
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const position = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
        }

        const initialRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        };
        setRegion(initialRegion);

        // Fetch location name
        const address = await reverseGeocode(latitude, longitude);
        if (address) {
          setAddressText(address);
        } else {
          setAddressText("Current Location");
        }
      } catch (error) {
        console.error("Error initializing map: ", error);
        setAddressText("Doha Qatar");
      } finally {
        setLoading(false);
      }
    }

    initMap();
  }, []);

  const handleRegionChangeComplete = async (newRegion) => {
    try {
      const address = await reverseGeocode(newRegion.latitude, newRegion.longitude);
      if (address) {
        setAddressText(address);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.COLORS.primary} />
          <Text style={styles.loadingText}>Loading Map...</Text>
        </View>
      ) : (
        <>
          <MapView
            provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
            style={styles.map}
            initialRegion={region}
            onRegionChangeComplete={handleRegionChangeComplete}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {region && (
              <Marker
                coordinate={{
                  latitude: region.latitude,
                  longitude: region.longitude,
                }}
                title="Your Location"
                description={addressText}
              />
            )}
          </MapView>

          {/* Top Bar / Back Button */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={theme.COLORS.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.topBarTitle}>Live Map</Text>
            <View style={{ width: 44 }} />
          </View>

          {/* Bottom Card for Location Confirmation */}
          <View style={styles.bottomCard}>
            <View style={styles.locationInfo}>
              <Ionicons name="location" size={24} color={theme.COLORS.primary} />
              <View style={styles.textContainer}>
                <Text style={styles.locationTitle}>Selected Location</Text>
                <Text style={styles.locationSubtitle} numberOfLines={2}>
                  {addressText}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                router.back();
              }}
            >
              <Text style={styles.confirmButtonText}>Confirm Location</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: theme.COLORS.textSecondary,
    fontWeight: "500",
  },
  map: {
    width: width,
    height: height,
  },
  topBar: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    ...theme.SHADOWS.card,
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.COLORS.textPrimary,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: "hidden",
  },
  bottomCard: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 40 : 24,
    left: 20,
    right: 20,
    backgroundColor: theme.COLORS.white,
    borderRadius: 24,
    padding: 20,
    ...theme.SHADOWS.primary,
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  textContainer: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 14,
    color: theme.COLORS.textSecondary,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  locationSubtitle: {
    fontSize: 16,
    color: theme.COLORS.textPrimary,
    fontWeight: "700",
    marginTop: 2,
  },
  confirmButton: {
    backgroundColor: theme.COLORS.primary,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    ...theme.SHADOWS.primary,
  },
  confirmButtonText: {
    color: theme.COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
