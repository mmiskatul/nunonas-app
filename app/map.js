import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Platform,
  Animated,
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
  
  // Set default region & marker coordinates immediately (Doha Qatar) to prevent initial blank load
  const [region, setRegion] = useState({
    latitude: 25.2854,
    longitude: 51.5310,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });
  const [markerCoords, setMarkerCoords] = useState({
    latitude: 25.2854,
    longitude: 51.5310,
  });
  const [addressText, setAddressText] = useState("Doha Qatar");
  const [animationComplete, setAnimationComplete] = useState(false);

  // Animation values
  const transitionProgress = useRef(new Animated.Value(0)).current;
  const cloudOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start the animations immediately on mount
    startTransitionAnimation();

    // Fetch user location silently in the background
    async function initLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const position = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          setMarkerCoords({ latitude: lat, longitude: lng });
          setRegion({
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          });
          
          const address = await reverseGeocode(lat, lng);
          if (address) {
            setAddressText(address);
          }
        }
      } catch (error) {
        console.error("Error fetching location: ", error);
      }
    }

    initLocation();
  }, []);

  const startTransitionAnimation = () => {
    // 1. Expand map card to full screen size first (1000ms)
    Animated.timing(transitionProgress, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start(() => {
      // 2. Show white sky clouds overlay (300ms fade-in)
      Animated.timing(cloudOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        // 3. Clear/part the clouds to reveal map (700ms fade-out)
        Animated.timing(cloudOpacity, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }).start(() => {
          setAnimationComplete(true);
        });
      });
    });
  };

  const updateLocation = async (coords) => {
    setMarkerCoords(coords);
    try {
      const address = await reverseGeocode(coords.latitude, coords.longitude);
      if (address) {
        setAddressText(address);
      }
    } catch (e) {
      console.error("Error reverse geocoding on update: ", e);
    }
  };

  const handleMapPress = (e) => {
    updateLocation(e.nativeEvent.coordinate);
  };

  const handleMarkerDragEnd = (e) => {
    updateLocation(e.nativeEvent.coordinate);
  };

  // Interpolations for the card-to-fullscreen scaling
  const mapWidth = transitionProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [width - 48, width],
  });

  const mapHeight = transitionProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [200, height],
  });

  const mapRadius = transitionProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 0],
  });

  const mapTop = transitionProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [(height - 200) / 2 - 20, 0],
  });

  const mapLeft = transitionProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 0],
  });

  return (
    <View style={styles.container}>
      {/* Animated Map Container */}
      <Animated.View
        style={[
          styles.animatedMapContainer,
          {
            width: mapWidth,
            height: mapHeight,
            borderRadius: mapRadius,
            top: mapTop,
            left: mapLeft,
          },
        ]}
      >
        <MapView
          provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
          style={StyleSheet.absoluteFillObject}
          region={region}
          onPress={handleMapPress}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {markerCoords && (
            <Marker
              coordinate={markerCoords}
              draggable
              onDragEnd={handleMarkerDragEnd}
              title="Selected Location"
              description={addressText}
              pinColor="red"
            />
          )}
        </MapView>

        {/* Cloud Sky Overlay (Shown after expansion, then clears out) */}
        {!animationComplete && (
          <Animated.View style={[styles.cloudOverlay, { opacity: cloudOpacity }]}>
            <View style={styles.cloudContent}>
              {/* Styled clouds visual representation */}
              <View style={styles.cloudRow}>
                <Ionicons name="cloud" size={100} color="#ffffff" style={styles.cloudIconShadow} />
                <Ionicons name="cloud" size={80} color="#f8fafc" style={[styles.cloudIconShadow, { marginLeft: -30, marginTop: 20 }]} />
              </View>
              <ActivityIndicator size="small" color={theme.COLORS.primary} style={{ marginTop: 24 }} />
              <Text style={styles.cloudText}>Clearing sky...</Text>
            </View>
          </Animated.View>
        )}
      </Animated.View>

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
  animatedMapContainer: {
    position: "absolute",
    overflow: "hidden",
  },
  cloudOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#ffffff", // Pure white sky backdrop
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  cloudContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  cloudRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cloudIconShadow: {
    shadowColor: "#cbd5e1",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cloudText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "700",
    color: theme.COLORS.primary,
    letterSpacing: 0.5,
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
