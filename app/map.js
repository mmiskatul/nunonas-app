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

const CLOUDS_CONFIG = [
  // Top-Left Sector (Moves Up and Left)
  { id: 1, size: 220, xStart: 0, yStart: 0, xEnd: -width, yEnd: -height, top: "5%", left: "-10%" },
  { id: 2, size: 250, xStart: 0, yStart: 0, xEnd: -width, yEnd: -height, top: "10%", left: "10%" },
  { id: 3, size: 200, xStart: 0, yStart: 0, xEnd: -width, yEnd: -height, top: "25%", left: "-5%" },
  { id: 4, size: 240, xStart: 0, yStart: 0, xEnd: -width, yEnd: -height, top: "20%", left: "15%" },
  { id: 5, size: 210, xStart: 0, yStart: 0, xEnd: -width, yEnd: -height, top: "35%", left: "0%" },

  // Top-Right Sector (Moves Up and Right)
  { id: 6, size: 260, xStart: 0, yStart: 0, xEnd: width, yEnd: -height, top: "5%", left: "50%" },
  { id: 7, size: 230, xStart: 0, yStart: 0, xEnd: width, yEnd: -height, top: "12%", left: "70%" },
  { id: 8, size: 200, xStart: 0, yStart: 0, xEnd: width, yEnd: -height, top: "28%", left: "60%" },
  { id: 9, size: 250, xStart: 0, yStart: 0, xEnd: width, yEnd: -height, top: "20%", left: "80%" },
  { id: 10, size: 220, xStart: 0, yStart: 0, xEnd: width, yEnd: -height, top: "32%", left: "75%" },

  // Bottom-Left Sector (Moves Down and Left)
  { id: 11, size: 240, xStart: 0, yStart: 0, xEnd: -width, yEnd: height, top: "55%", left: "-10%" },
  { id: 12, size: 210, xStart: 0, yStart: 0, xEnd: -width, yEnd: height, top: "60%", left: "10%" },
  { id: 13, size: 250, xStart: 0, yStart: 0, xEnd: -width, yEnd: height, top: "75%", left: "-5%" },
  { id: 14, size: 200, xStart: 0, yStart: 0, xEnd: -width, yEnd: height, top: "70%", left: "15%" },
  { id: 15, size: 230, xStart: 0, yStart: 0, xEnd: -width, yEnd: height, top: "85%", left: "0%" },

  // Bottom-Right Sector (Moves Down and Right)
  { id: 16, size: 250, xStart: 0, yStart: 0, xEnd: width, yEnd: height, top: "55%", left: "50%" },
  { id: 17, size: 220, xStart: 0, yStart: 0, xEnd: width, yEnd: height, top: "62%", left: "70%" },
  { id: 18, size: 260, xStart: 0, yStart: 0, xEnd: width, yEnd: height, top: "78%", left: "60%" },
  { id: 19, size: 210, xStart: 0, yStart: 0, xEnd: width, yEnd: height, top: "70%", left: "80%" },
  { id: 20, size: 240, xStart: 0, yStart: 0, xEnd: width, yEnd: height, top: "85%", left: "75%" },

  // Middle-Left Sector (Moves Left)
  { id: 21, size: 260, xStart: 0, yStart: 0, xEnd: -width, yEnd: 0, top: "40%", left: "-15%" },
  { id: 22, size: 230, xStart: 0, yStart: 0, xEnd: -width, yEnd: 0, top: "45%", left: "10%" },
  { id: 23, size: 250, xStart: 0, yStart: 0, xEnd: -width, yEnd: 0, top: "30%", left: "5%" },
  { id: 24, size: 220, xStart: 0, yStart: 0, xEnd: -width, yEnd: 0, top: "50%", left: "8%" },

  // Middle-Right Sector (Moves Right)
  { id: 25, size: 250, xStart: 0, yStart: 0, xEnd: width, yEnd: 0, top: "40%", left: "75%" },
  { id: 26, size: 220, xStart: 0, yStart: 0, xEnd: width, yEnd: 0, top: "45%", left: "60%" },
  { id: 27, size: 260, xStart: 0, yStart: 0, xEnd: width, yEnd: 0, top: "65%", left: "65%" },
  { id: 28, size: 230, xStart: 0, yStart: 0, xEnd: width, yEnd: 0, top: "50%", left: "62%" },

  // Middle-Center Area (Moves Outwards to all sides - heavily covering the center)
  { id: 29, size: 270, xStart: 0, yStart: 0, xEnd: -width, yEnd: -height/2, top: "35%", left: "25%" },
  { id: 30, size: 280, xStart: 0, yStart: 0, xEnd: width, yEnd: -height/2, top: "30%", left: "45%" },
  { id: 31, size: 260, xStart: 0, yStart: 0, xEnd: -width, yEnd: height/2, top: "45%", left: "20%" },
  { id: 32, size: 290, xStart: 0, yStart: 0, xEnd: width, yEnd: height/2, top: "40%", left: "40%" },
  { id: 33, size: 280, xStart: 0, yStart: 0, xEnd: -width, yEnd: -height/4, top: "25%", left: "30%" },
  { id: 34, size: 270, xStart: 0, yStart: 0, xEnd: width, yEnd: -height/4, top: "28%", left: "48%" },
  { id: 35, size: 290, xStart: 0, yStart: 0, xEnd: -width, yEnd: height/4, top: "48%", left: "32%" },
  { id: 36, size: 280, xStart: 0, yStart: 0, xEnd: width, yEnd: height/4, top: "50%", left: "45%" },

  // Additional Filler clouds to guarantee 100% density across the screen edges
  { id: 37, size: 200, xStart: 0, yStart: 0, xEnd: -width, yEnd: -height, top: "0%", left: "20%" },
  { id: 38, size: 220, xStart: 0, yStart: 0, xEnd: width, yEnd: -height, top: "0%", left: "40%" },
  { id: 39, size: 210, xStart: 0, yStart: 0, xEnd: -width, yEnd: height, top: "90%", left: "20%" },
  { id: 40, size: 230, xStart: 0, yStart: 0, xEnd: width, yEnd: height, top: "90%", left: "50%" },
  { id: 41, size: 250, xStart: 0, yStart: 0, xEnd: -width, yEnd: -height/3, top: "15%", left: "-15%" },
  { id: 42, size: 240, xStart: 0, yStart: 0, xEnd: width, yEnd: -height/3, top: "15%", left: "85%" },
  { id: 43, size: 230, xStart: 0, yStart: 0, xEnd: -width, yEnd: height/3, top: "80%", left: "-15%" },
  { id: 44, size: 260, xStart: 0, yStart: 0, xEnd: width, yEnd: height/3, top: "80%", left: "85%" },
  { id: 45, size: 210, xStart: 0, yStart: 0, xEnd: -width, yEnd: -height/2, top: "8%", left: "28%" },
  { id: 46, size: 220, xStart: 0, yStart: 0, xEnd: width, yEnd: -height/2, top: "8%", left: "55%" },
  { id: 47, size: 230, xStart: 0, yStart: 0, xEnd: -width, yEnd: height/2, top: "88%", left: "30%" },
  { id: 48, size: 240, xStart: 0, yStart: 0, xEnd: width, yEnd: height/2, top: "88%", left: "58%" },
  { id: 49, size: 250, xStart: 0, yStart: 0, xEnd: -width, yEnd: 0, top: "45%", left: "-8%" },
  { id: 50, size: 240, xStart: 0, yStart: 0, xEnd: width, yEnd: 0, top: "45%", left: "78%" },
  { id: 51, size: 220, xStart: 0, yStart: 0, xEnd: -width, yEnd: -height, top: "2%", left: "5%" },
  { id: 52, size: 230, xStart: 0, yStart: 0, xEnd: width, yEnd: -height, top: "2%", left: "75%" },
  { id: 53, size: 210, xStart: 0, yStart: 0, xEnd: -width, yEnd: height, top: "95%", left: "5%" },
  { id: 54, size: 220, xStart: 0, yStart: 0, xEnd: width, yEnd: height, top: "95%", left: "75%" },
  { id: 55, size: 260, xStart: 0, yStart: 0, xEnd: -width, yEnd: -height/4, top: "12%", left: "-5%" },
  { id: 56, size: 250, xStart: 0, yStart: 0, xEnd: width, yEnd: -height/4, top: "12%", left: "80%" },
  { id: 57, size: 270, xStart: 0, yStart: 0, xEnd: -width, yEnd: height/4, top: "82%", left: "-5%" },
  { id: 58, size: 260, xStart: 0, yStart: 0, xEnd: width, yEnd: height/4, top: "82%", left: "80%" },
  { id: 59, size: 280, xStart: 0, yStart: 0, xEnd: -width/2, yEnd: -height, top: "10%", left: "38%" },
  { id: 60, size: 290, xStart: 0, yStart: 0, xEnd: width/2, yEnd: height, top: "85%", left: "42%" },
];

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
  const cloudAnim = useRef(new Animated.Value(0)).current;

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
    cloudOpacity.setValue(1);
    cloudAnim.setValue(1);

    // Animate clouds parting from middle to all sides slowly (2500ms)
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(cloudOpacity, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(cloudAnim, {
          toValue: 2,
          duration: 2500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setAnimationComplete(true);
      });
    }, 400);
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

  return (
    <View style={styles.container}>
      {/* Live Map View Rendered Full Screen Immediately */}
      <View style={StyleSheet.absoluteFillObject}>
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
            {/* Render 40 animated clouds coming from different sides */}
            {CLOUDS_CONFIG.map((cloud) => {
              const translateX = cloudAnim.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [cloud.xStart, 0, cloud.xEnd],
              });
              const translateY = cloudAnim.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [cloud.yStart, 0, cloud.yEnd],
              });

              return (
                <Animated.View
                  key={cloud.id}
                  style={[
                    styles.cloudWrapper,
                    {
                      top: cloud.top,
                      left: cloud.left,
                      transform: [{ translateX }, { translateY }],
                    },
                  ]}
                >
                  <Ionicons name="cloud" size={cloud.size} color="#ffffff" style={styles.cloudIconShadow} />
                </Animated.View>
              );
            })}

            <ActivityIndicator size="large" color="#ffffff" style={styles.spinnerOverCloud} />
          </Animated.View>
        )}
      </View>

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
    backgroundColor: "transparent", // Transparent background
    zIndex: 999,
  },
  cloudWrapper: {
    position: "absolute",
    opacity: 0.7, // Semi-transparent clouds
  },
  spinnerOverCloud: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -18,
    marginTop: -18,
    zIndex: 100,
  },
  cloudIconShadow: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
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
