import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Platform,
  Animated,
  Image,
  Linking,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import theme from "../constants/theme";
import {
  buildDirectionsUrl,
  getDrivingRoute,
  reverseGeocode,
} from "../lib/google-maps";
import { getCurrentCoords, isExpectedLocationError } from "../lib/location";
import { listNearbyOffers } from "../lib/nearby-offers";

const { width, height } = Dimensions.get("window");

const CLOUDS_CONFIG = [
  { id: 1, size: 220, xStart: 0, yStart: 0, xEnd: -width, yEnd: -height, top: "5%", left: "-10%" },
  { id: 2, size: 250, xStart: 0, yStart: 0, xEnd: -width, yEnd: -height, top: "10%", left: "10%" },
  { id: 3, size: 200, xStart: 0, yStart: 0, xEnd: -width, yEnd: -height, top: "25%", left: "-5%" },
  { id: 4, size: 240, xStart: 0, yStart: 0, xEnd: -width, yEnd: -height, top: "20%", left: "15%" },
  { id: 5, size: 210, xStart: 0, yStart: 0, xEnd: -width, yEnd: -height, top: "35%", left: "0%" },
  { id: 6, size: 260, xStart: 0, yStart: 0, xEnd: width, yEnd: -height, top: "5%", left: "50%" },
  { id: 7, size: 230, xStart: 0, yStart: 0, xEnd: width, yEnd: -height, top: "12%", left: "70%" },
  { id: 8, size: 200, xStart: 0, yStart: 0, xEnd: width, yEnd: -height, top: "28%", left: "60%" },
  { id: 9, size: 250, xStart: 0, yStart: 0, xEnd: width, yEnd: -height, top: "20%", left: "80%" },
  { id: 10, size: 220, xStart: 0, yStart: 0, xEnd: width, yEnd: -height, top: "32%", left: "75%" },
  { id: 11, size: 240, xStart: 0, yStart: 0, xEnd: -width, yEnd: height, top: "55%", left: "-10%" },
  { id: 12, size: 210, xStart: 0, yStart: 0, xEnd: -width, yEnd: height, top: "60%", left: "10%" },
  { id: 13, size: 250, xStart: 0, yStart: 0, xEnd: -width, yEnd: height, top: "75%", left: "-5%" },
  { id: 14, size: 200, xStart: 0, yStart: 0, xEnd: -width, yEnd: height, top: "70%", left: "15%" },
  { id: 15, size: 230, xStart: 0, yStart: 0, xEnd: -width, yEnd: height, top: "85%", left: "0%" },
  { id: 16, size: 250, xStart: 0, yStart: 0, xEnd: width, yEnd: height, top: "55%", left: "50%" },
  { id: 17, size: 220, xStart: 0, yStart: 0, xEnd: width, yEnd: height, top: "62%", left: "70%" },
  { id: 18, size: 260, xStart: 0, yStart: 0, xEnd: width, yEnd: height, top: "78%", left: "60%" },
  { id: 19, size: 210, xStart: 0, yStart: 0, xEnd: width, yEnd: height, top: "70%", left: "80%" },
  { id: 20, size: 240, xStart: 0, yStart: 0, xEnd: width, yEnd: height, top: "85%", left: "75%" },
  { id: 21, size: 260, xStart: 0, yStart: 0, xEnd: -width, yEnd: 0, top: "40%", left: "-15%" },
  { id: 22, size: 230, xStart: 0, yStart: 0, xEnd: -width, yEnd: 0, top: "45%", left: "10%" },
  { id: 23, size: 250, xStart: 0, yStart: 0, xEnd: -width, yEnd: 0, top: "30%", left: "5%" },
  { id: 24, size: 220, xStart: 0, yStart: 0, xEnd: -width, yEnd: 0, top: "50%", left: "8%" },
  { id: 25, size: 250, xStart: 0, yStart: 0, xEnd: width, yEnd: 0, top: "40%", left: "75%" },
  { id: 26, size: 220, xStart: 0, yStart: 0, xEnd: width, yEnd: 0, top: "45%", left: "60%" },
  { id: 27, size: 260, xStart: 0, yStart: 0, xEnd: width, yEnd: 0, top: "65%", left: "65%" },
  { id: 28, size: 230, xStart: 0, yStart: 0, xEnd: width, yEnd: 0, top: "50%", left: "62%" },
  { id: 29, size: 270, xStart: 0, yStart: 0, xEnd: -width, yEnd: -height / 2, top: "35%", left: "25%" },
  { id: 30, size: 280, xStart: 0, yStart: 0, xEnd: width, yEnd: -height / 2, top: "30%", left: "45%" },
  { id: 31, size: 260, xStart: 0, yStart: 0, xEnd: -width, yEnd: height / 2, top: "45%", left: "20%" },
  { id: 32, size: 290, xStart: 0, yStart: 0, xEnd: width, yEnd: height / 2, top: "40%", left: "40%" },
  { id: 33, size: 280, xStart: 0, yStart: 0, xEnd: -width, yEnd: -height / 4, top: "25%", left: "30%" },
  { id: 34, size: 270, xStart: 0, yStart: 0, xEnd: width, yEnd: -height / 4, top: "28%", left: "48%" },
  { id: 35, size: 290, xStart: 0, yStart: 0, xEnd: -width, yEnd: height / 4, top: "48%", left: "32%" },
  { id: 36, size: 280, xStart: 0, yStart: 0, xEnd: width, yEnd: height / 4, top: "50%", left: "45%" },
  { id: 37, size: 200, xStart: 0, yStart: 0, xEnd: -width, yEnd: -height, top: "0%", left: "20%" },
  { id: 38, size: 220, xStart: 0, yStart: 0, xEnd: width, yEnd: -height, top: "0%", left: "40%" },
  { id: 39, size: 210, xStart: 0, yStart: 0, xEnd: -width, yEnd: height, top: "90%", left: "20%" },
  { id: 40, size: 230, xStart: 0, yStart: 0, xEnd: width, yEnd: height, top: "90%", left: "50%" },
  { id: 41, size: 250, xStart: 0, yStart: 0, xEnd: -width, yEnd: -height / 3, top: "15%", left: "-15%" },
  { id: 42, size: 240, xStart: 0, yStart: 0, xEnd: width, yEnd: -height / 3, top: "15%", left: "85%" },
  { id: 43, size: 230, xStart: 0, yStart: 0, xEnd: -width, yEnd: height / 3, top: "80%", left: "-15%" },
  { id: 44, size: 260, xStart: 0, yStart: 0, xEnd: width, yEnd: height / 3, top: "80%", left: "85%" },
  { id: 45, size: 210, xStart: 0, yStart: 0, xEnd: -width, yEnd: -height / 2, top: "8%", left: "28%" },
  { id: 46, size: 220, xStart: 0, yStart: 0, xEnd: width, yEnd: -height / 2, top: "8%", left: "55%" },
  { id: 47, size: 230, xStart: 0, yStart: 0, xEnd: -width, yEnd: height / 2, top: "88%", left: "30%" },
  { id: 48, size: 240, xStart: 0, yStart: 0, xEnd: width, yEnd: height / 2, top: "88%", left: "58%" },
  { id: 49, size: 250, xStart: 0, yStart: 0, xEnd: -width, yEnd: 0, top: "45%", left: "-8%" },
  { id: 50, size: 240, xStart: 0, yStart: 0, xEnd: width, yEnd: 0, top: "45%", left: "78%" },
  { id: 51, size: 220, xStart: 0, yStart: 0, xEnd: -width, yEnd: -height, top: "2%", left: "5%" },
  { id: 52, size: 230, xStart: 0, yStart: 0, xEnd: width, yEnd: -height, top: "2%", left: "75%" },
  { id: 53, size: 210, xStart: 0, yStart: 0, xEnd: -width, yEnd: height, top: "95%", left: "5%" },
  { id: 54, size: 220, xStart: 0, yStart: 0, xEnd: width, yEnd: height, top: "95%", left: "75%" },
  { id: 55, size: 260, xStart: 0, yStart: 0, xEnd: -width, yEnd: -height / 4, top: "12%", left: "-5%" },
  { id: 56, size: 250, xStart: 0, yStart: 0, xEnd: width, yEnd: -height / 4, top: "12%", left: "80%" },
  { id: 57, size: 270, xStart: 0, yStart: 0, xEnd: -width, yEnd: height / 4, top: "82%", left: "-5%" },
  { id: 58, size: 260, xStart: 0, yStart: 0, xEnd: width, yEnd: height / 4, top: "82%", left: "80%" },
  { id: 59, size: 280, xStart: 0, yStart: 0, xEnd: -width / 2, yEnd: -height, top: "10%", left: "38%" },
  { id: 60, size: 290, xStart: 0, yStart: 0, xEnd: width / 2, yEnd: height, top: "85%", left: "42%" },
];

function OfferMarker({ offer, onPress, active }) {
  return (
    <Marker
      coordinate={{ latitude: offer.latitude, longitude: offer.longitude }}
      onPress={() => onPress(offer)}
    >
      <View style={styles.offerMarkerWrap}>
        <View style={[styles.offerMarkerRing, active && styles.offerMarkerRingActive]}>
          {offer.imageUrl ? (
            <Image source={{ uri: offer.imageUrl }} style={styles.offerMarkerImage} />
          ) : (
            <View style={[styles.offerMarkerImage, styles.offerMarkerFallback]}>
              <Ionicons name="business" size={18} color={theme.COLORS.white} />
            </View>
          )}
        </View>
        <View style={styles.offerMarkerChip}>
          <Text style={styles.offerMarkerChipText} numberOfLines={1}>
            {offer.offerText}
          </Text>
        </View>
      </View>
    </Marker>
  );
}

export default function MapScreen() {
  const router = useRouter();
  const { offerId } = useLocalSearchParams();
  const mapRef = useRef(null);
  const transitionProgress = useRef(new Animated.Value(0)).current;
  const cloudOpacity = useRef(new Animated.Value(0)).current;
  const cloudAnim = useRef(new Animated.Value(0)).current;

  const [region, setRegion] = useState({
    latitude: 25.2854,
    longitude: 51.531,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  });
  const [markerCoords, setMarkerCoords] = useState({
    latitude: 25.2854,
    longitude: 51.531,
  });
  const [addressText, setAddressText] = useState("Doha Qatar");
  const [animationComplete, setAnimationComplete] = useState(false);
  const [nearbyOffers, setNearbyOffers] = useState([]);
  const [offersLoading, setOffersLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);

  useEffect(() => {
    startTransitionAnimation();

    async function initLocation() {
      try {
        const coords = await getCurrentCoords();
        if (!coords) {
          return;
        }

        setMarkerCoords({ latitude: coords.latitude, longitude: coords.longitude });
        setRegion({
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        });

        const address = await reverseGeocode(coords.latitude, coords.longitude);
        if (address) {
          setAddressText(address);
        }
      } catch (error) {
        if (!isExpectedLocationError(error)) {
          console.error("Error fetching location: ", error);
        }
      }
    }

    async function loadOffers() {
      try {
        setOffersLoading(true);
        const items = await listNearbyOffers(16);
        setNearbyOffers(items);
        const initialOffer =
          items.find((item) => String(item.id) === String(offerId ?? "")) ?? items[0] ?? null;
        setSelectedOffer(initialOffer);
      } catch (error) {
        console.error("Error loading offers for map: ", error);
        setNearbyOffers([]);
      } finally {
        setOffersLoading(false);
      }
    }

    initLocation();
    loadOffers();
  }, [offerId]);

  useEffect(() => {
    let cancelled = false;

    async function loadRoute() {
      if (!selectedOffer) {
        setRouteInfo(null);
        return;
      }

      const route = await getDrivingRoute(markerCoords, {
        latitude: selectedOffer.latitude,
        longitude: selectedOffer.longitude,
      });

      if (!cancelled) {
        setRouteInfo(route);
      }
    }

    loadRoute();

    return () => {
      cancelled = true;
    };
  }, [markerCoords.latitude, markerCoords.longitude, selectedOffer]);

  useEffect(() => {
    if (!selectedOffer || !mapRef.current) {
      return;
    }

    mapRef.current.fitToCoordinates(
      [
        markerCoords,
        { latitude: selectedOffer.latitude, longitude: selectedOffer.longitude },
      ],
      {
        edgePadding: { top: 140, right: 80, bottom: 240, left: 80 },
        animated: true,
      }
    );
  }, [markerCoords, selectedOffer]);

  const startTransitionAnimation = () => {
    cloudOpacity.setValue(1);
    cloudAnim.setValue(1);
    transitionProgress.setValue(0);

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
        Animated.timing(transitionProgress, {
          toValue: 1,
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
    setRegion((current) => ({
      ...current,
      latitude: coords.latitude,
      longitude: coords.longitude,
    }));
    setSelectedOffer(null);
    setRouteInfo(null);

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

  const openDirections = async () => {
    if (!selectedOffer) {
      return;
    }

    const url = buildDirectionsUrl(markerCoords, {
      latitude: selectedOffer.latitude,
      longitude: selectedOffer.longitude,
    });

    if (!url) {
      return;
    }

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error("Error opening directions:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFillObject}>
        <MapView
          ref={mapRef}
          provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
          style={StyleSheet.absoluteFillObject}
          region={region}
          onRegionChangeComplete={setRegion}
          onPress={handleMapPress}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {routeInfo?.coordinates?.length ? (
            <Polyline
              coordinates={routeInfo.coordinates}
              strokeColor="#2563eb"
              strokeWidth={5}
              lineCap="round"
              lineJoin="round"
            />
          ) : null}

          {markerCoords ? (
            <Marker
              coordinate={markerCoords}
              draggable
              onDragEnd={handleMarkerDragEnd}
              title="Your location"
              description={addressText}
              pinColor="#2563eb"
            />
          ) : null}

          {nearbyOffers.map((offer) => (
            <OfferMarker
              key={offer.id}
              offer={offer}
              active={selectedOffer?.id === offer.id}
              onPress={setSelectedOffer}
            />
          ))}
        </MapView>

        {!animationComplete && (
          <Animated.View style={[styles.cloudOverlay, { opacity: cloudOpacity }]}>
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

      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Nearby Offers Map</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.bottomCard}>
        {selectedOffer ? (
          <>
            <View style={styles.offerHeader}>
              {selectedOffer.imageUrl ? (
                <Image source={{ uri: selectedOffer.imageUrl }} style={styles.bottomOfferImage} />
              ) : (
                <View style={[styles.bottomOfferImage, styles.offerMarkerFallback]}>
                  <Ionicons name="business" size={22} color={theme.COLORS.white} />
                </View>
              )}

              <View style={styles.textContainer}>
                <Text style={styles.offerTitle} numberOfLines={1}>
                  {selectedOffer.title}
                </Text>
                <Text style={styles.offerSubtitle} numberOfLines={1}>
                  {selectedOffer.offerText}
                </Text>
                <Text style={styles.locationSubtitle} numberOfLines={2}>
                  {selectedOffer.locationLabel}
                </Text>
              </View>
            </View>

            <View style={styles.metricsRow}>
              <View style={styles.metricPill}>
                <Ionicons name="trail-sign-outline" size={15} color={theme.COLORS.primary} />
                <Text style={styles.metricText}>
                  {routeInfo?.distanceText ??
                    (typeof selectedOffer.distanceKm === "number"
                      ? `${selectedOffer.distanceKm.toFixed(1)} km`
                      : "Nearby")}
                </Text>
              </View>
              <View style={styles.metricPill}>
                <Ionicons name="time-outline" size={15} color={theme.COLORS.primary} />
                <Text style={styles.metricText}>{routeInfo?.durationText ?? "Route preview"}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.directionsButton} onPress={openDirections}>
              <Ionicons name="navigate" size={18} color={theme.COLORS.white} />
              <Text style={styles.directionsButtonText}>Open Driving Directions</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmButton} onPress={() => router.back()}>
              <Text style={styles.confirmButtonText}>Confirm Location</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.locationInfo}>
              <Ionicons name="location" size={24} color={theme.COLORS.primary} />
              <View style={styles.textContainer}>
                <Text style={styles.locationTitle}>Selected Location</Text>
                <Text style={styles.locationSubtitle} numberOfLines={2}>
                  {addressText}
                </Text>
                <Text style={styles.locationHint}>
                  Tap any offer marker to see the real road distance and directions.
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.confirmButton} onPress={() => router.back()}>
              <Text style={styles.confirmButtonText}>
                {offersLoading ? "Loading offers..." : "Confirm Location"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  cloudOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    zIndex: 999,
  },
  cloudWrapper: {
    position: "absolute",
    opacity: 0.7,
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
  offerMarkerWrap: {
    alignItems: "center",
    minWidth: 90,
  },
  offerMarkerRing: {
    width: 58,
    height: 58,
    borderRadius: 29,
    padding: 3,
    backgroundColor: theme.COLORS.white,
    borderWidth: 2,
    borderColor: theme.COLORS.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 6,
  },
  offerMarkerRingActive: {
    borderColor: theme.COLORS.primary,
    transform: [{ scale: 1.06 }],
  },
  offerMarkerImage: {
    width: "100%",
    height: "100%",
    borderRadius: 26,
    backgroundColor: "#cbd5e1",
  },
  offerMarkerFallback: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.COLORS.primary,
  },
  offerMarkerChip: {
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "rgba(15, 23, 42, 0.86)",
    maxWidth: width * 0.44,
  },
  offerMarkerChipText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "700",
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
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 20,
  },
  offerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 16,
  },
  bottomOfferImage: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#cbd5e1",
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
  offerTitle: {
    fontSize: 18,
    color: theme.COLORS.textPrimary,
    fontWeight: "800",
  },
  offerSubtitle: {
    fontSize: 13,
    color: theme.COLORS.primary,
    fontWeight: "700",
    marginTop: 2,
  },
  locationSubtitle: {
    fontSize: 15,
    color: theme.COLORS.textPrimary,
    fontWeight: "700",
    marginTop: 4,
  },
  locationHint: {
    fontSize: 13,
    color: theme.COLORS.textSecondary,
    marginTop: 8,
    lineHeight: 18,
  },
  metricsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  metricPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 14,
    backgroundColor: "#eff6ff",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  metricText: {
    color: theme.COLORS.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  directionsButton: {
    backgroundColor: "#2563eb",
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
    ...theme.SHADOWS.primary,
  },
  directionsButtonText: {
    color: theme.COLORS.white,
    fontSize: 15,
    fontWeight: "700",
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
