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
  Alert,
  ScrollView,
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
import { bookEventTickets, getEvent } from "../lib/customer-api";

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

function formatEventDate(value) {
  if (!value) return "Date TBA";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatEventTime(startTime, endTime) {
  if (!startTime) return "Time TBA";
  const start = String(startTime).slice(0, 5);
  const end = endTime ? String(endTime).slice(0, 5) : "";
  return end ? `${start} - ${end}` : start;
}

function getDistanceText(distanceKm) {
  if (typeof distanceKm !== "number") return "Nearby";
  return `${distanceKm.toFixed(1)} km`;
}

function normalizeEventDetails(item = {}) {
  const distanceValue =
    typeof item.distance_km === "number" ? item.distance_km : Number(item.distance_km);

  return {
    id: item.id,
    title: item.title ?? "Untitled Event",
    date: formatEventDate(item.event_date),
    time: formatEventTime(item.start_time, item.end_time),
    location: item.location ?? item.venue ?? "Venue available",
    venue: item.venue ?? item.location ?? "Venue available",
    address: item.address ?? item.location ?? item.venue ?? "Address available",
    tag: item.offer_text ?? item.event_type ?? "Live Event",
    eventType: item.event_type ?? "Event",
    imageUrl: item.banner_image_url ?? item.cover_image_url ?? "",
    description: item.description ?? "",
    capacity: item.capacity ?? null,
    ticketPrice: item.ticket_price != null ? `${item.ticket_price}` : null,
    distance: getDistanceText(distanceValue),
    distanceKm: Number.isFinite(distanceValue) ? distanceValue : null,
    rating: item.rating ?? null,
    reviewsCount: item.reviews_count ?? null,
    latitude: item.latitude != null ? Number(item.latitude) : null,
    longitude: item.longitude != null ? Number(item.longitude) : null,
    bookingMode: item.booking_mode ?? item.bookingMode ?? "simple",
    canBookOnMap: Boolean(item.can_book_on_map ?? item.canBookOnMap),
    currentBookingStatus: item.current_booking_status ?? item.currentBookingStatus ?? "",
    currentBookingCode: item.current_booking_code ?? item.currentBookingCode ?? "",
    isSoldOut: Boolean(item.is_sold_out ?? item.isSoldOut),
    remainingCapacity:
      item.remaining_capacity != null
        ? Number(item.remaining_capacity)
        : item.remainingCapacity != null
          ? Number(item.remainingCapacity)
          : null,
    detailRoute: item.detail_route ?? item.detailRoute ?? (item.id ? `/home/events/${item.id}` : null),
  };
}

export default function MapScreen() {
  const router = useRouter();
  const { offerId, eventId } = useLocalSearchParams();
  const mapRef = useRef(null);
  const transitionProgress = useRef(new Animated.Value(0)).current;
  const cloudOpacity = useRef(new Animated.Value(0)).current;
  const cloudAnim = useRef(new Animated.Value(0)).current;

  const [markerCoords, setMarkerCoords] = useState({
    latitude: 25.2854,
    longitude: 51.531,
  });
  const [addressText, setAddressText] = useState("Doha Qatar");
  const [animationComplete, setAnimationComplete] = useState(false);
  const [nearbyEvents, setNearbyEvents] = useState([]);
  const [offersLoading, setOffersLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedEventDetails, setSelectedEventDetails] = useState(null);
  const [selectedEventLoading, setSelectedEventLoading] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [bookingState, setBookingState] = useState({
    loading: false,
    code: "",
    status: "",
  });

  useEffect(() => {
    startTransitionAnimation();

    async function initLocation() {
      try {
        const coords = await getCurrentCoords();
        if (!coords) {
          return;
        }

        setMarkerCoords({ latitude: coords.latitude, longitude: coords.longitude });
        mapRef.current?.animateToRegion(
          {
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03,
          },
          500
        );

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
        const items = await listNearbyOffers(50);
        setNearbyEvents(items);
        const selectedId = eventId ?? offerId;
        const initialEvent = selectedId
          ? items.find((item) => String(item.id) === String(selectedId)) ?? null
          : null;
        setSelectedEvent(initialEvent);
      } catch (error) {
        console.error("Error loading offers for map: ", error);
        setNearbyEvents([]);
      } finally {
        setOffersLoading(false);
      }
    }

    initLocation();
    loadOffers();
  }, [eventId, offerId]);

  useEffect(() => {
    let cancelled = false;

    async function loadSelectedEventDetails() {
      if (!selectedEvent?.id) {
        setSelectedEventDetails(null);
        setBookingState({ loading: false, code: "", status: "" });
        return;
      }

      try {
        setSelectedEventLoading(true);
        setTicketQuantity(1);
        setSelectedEventDetails(normalizeEventDetails(selectedEvent));
        setBookingState({
          loading: false,
          code: selectedEvent.currentBookingCode ?? "",
          status: selectedEvent.currentBookingStatus ?? "",
        });
        const eventPayload = await getEvent(selectedEvent.id);
        if (cancelled) {
          return;
        }

        const normalized = normalizeEventDetails({
          ...selectedEvent,
          ...eventPayload,
        });

        setSelectedEventDetails(normalized);
        setBookingState({
          loading: false,
          code: normalized.currentBookingCode ?? "",
          status: normalized.currentBookingStatus ?? "",
        });
      } catch (error) {
        if (!cancelled) {
          console.error("Error loading selected event details:", error);
          setSelectedEventDetails(normalizeEventDetails(selectedEvent));
          setBookingState({
            loading: false,
            code: selectedEvent.currentBookingCode ?? "",
            status: selectedEvent.currentBookingStatus ?? "",
          });
        }
      } finally {
        if (!cancelled) {
          setSelectedEventLoading(false);
        }
      }
    }

    loadSelectedEventDetails();

    return () => {
      cancelled = true;
    };
  }, [selectedEvent]);

  useEffect(() => {
    let cancelled = false;

    async function loadRoute() {
      if (!selectedEvent?.id) {
        setRouteInfo(null);
        return;
      }
      const targetEvent = selectedEventDetails ?? selectedEvent;
      if (!targetEvent?.latitude || !targetEvent?.longitude) {
        setRouteInfo(null);
        return;
      }

      const route = await getDrivingRoute(markerCoords, {
        latitude: targetEvent.latitude,
        longitude: targetEvent.longitude,
      });

      if (!cancelled) {
        setRouteInfo(route);
      }
    }

    loadRoute();

    return () => {
      cancelled = true;
    };
  }, [markerCoords.latitude, markerCoords.longitude, selectedEvent, selectedEventDetails]);

  useEffect(() => {
    const targetEvent = selectedEventDetails ?? selectedEvent;
    if (!targetEvent?.latitude || !targetEvent?.longitude || !mapRef.current) {
      return;
    }

    mapRef.current.fitToCoordinates(
      [
        markerCoords,
        { latitude: targetEvent.latitude, longitude: targetEvent.longitude },
      ],
      {
        edgePadding: { top: 140, right: 80, bottom: 240, left: 80 },
        animated: true,
      }
    );
  }, [markerCoords, selectedEvent, selectedEventDetails]);

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

  const openDirections = async () => {
    const targetEvent = selectedEventDetails ?? selectedEvent;
    if (!targetEvent?.latitude || !targetEvent?.longitude) {
      return;
    }

    const url = buildDirectionsUrl(markerCoords, {
      latitude: targetEvent.latitude,
      longitude: targetEvent.longitude,
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

  const openEventDetails = () => {
    const detailRoute = selectedEventDetails?.detailRoute ?? selectedEvent?.detailRoute;
    const eventDetailsId = selectedEventDetails?.id ?? selectedEvent?.id;
    if (detailRoute) {
      router.push(detailRoute);
      return;
    }
    if (eventDetailsId) {
      router.push(`/home/events/${eventDetailsId}`);
    }
  };

  const handleBookNow = async () => {
    const targetEvent = selectedEventDetails ?? selectedEvent;
    const eventDetailsId = targetEvent?.id;
    if (!eventDetailsId || bookingState.loading) {
      return;
    }
    if (!targetEvent?.canBookOnMap || targetEvent?.bookingMode !== "simple") {
      openEventDetails();
      return;
    }
    if (targetEvent?.isSoldOut) {
      return;
    }
    if (bookingState.code) {
      openEventDetails();
      return;
    }

    try {
      setBookingState((current) => ({ ...current, loading: true }));
      const response = await bookEventTickets(eventDetailsId, {
        quantity: ticketQuantity,
        auto_confirm: true,
      });
      const bookingCode = response?.booking_code ?? response?.bookingCode ?? "";
      const bookingStatus = response?.status ?? "confirmed";
      setBookingState({
        loading: false,
        code: bookingCode,
        status: bookingStatus,
      });
      setSelectedEventDetails((current) =>
        current
          ? {
              ...current,
              currentBookingCode: bookingCode,
              currentBookingStatus: bookingStatus,
            }
          : current
      );
      Alert.alert(
        "Ticket booked",
        bookingCode
          ? `Your booking reference is ${bookingCode}.`
          : "Your event ticket has been booked."
      );
    } catch (error) {
      setBookingState((current) => ({ ...current, loading: false }));
      Alert.alert("Booking failed", error?.message || "Could not book tickets right now.");
    }
  };
  const cardEvent = selectedEventDetails ?? selectedEvent;
  const resolvedBookingStatus = bookingState.status || cardEvent?.currentBookingStatus || "";
  const resolvedBookingCode = bookingState.code || cardEvent?.currentBookingCode || "";
  const resolvedBookingStatusText = resolvedBookingCode
    ? `${resolvedBookingStatus || "confirmed"} - ${resolvedBookingCode}`
    : resolvedBookingStatus
      ? resolvedBookingStatus
      : "Not booked yet";
  const canShowInlineBooking =
    cardEvent?.bookingMode === "simple" &&
    cardEvent?.canBookOnMap &&
    !cardEvent?.isSoldOut &&
    !resolvedBookingCode;
  const routeDistanceText =
    routeInfo?.distanceText ??
    (typeof cardEvent?.distanceKm === "number" ? `${cardEvent.distanceKm.toFixed(1)} km away` : cardEvent?.distance ?? "Nearby");
  const routeDurationText = routeInfo?.durationText ?? "Tap Directions";
  const routeLocationText = cardEvent?.address ?? cardEvent?.locationLabel ?? cardEvent?.location ?? "Location available";
  const primaryActionLabel = resolvedBookingCode
    ? "View Booking"
    : cardEvent?.isSoldOut
      ? "Sold Out"
      : canShowInlineBooking
        ? "Book Now"
        : "Open Details";

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFillObject}>
        <MapView
          ref={mapRef}
          provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            latitude: markerCoords.latitude,
            longitude: markerCoords.longitude,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03,
          }}
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

          {nearbyEvents.map((offer) => (
            <Marker
              key={String(offer.id)}
              coordinate={{ latitude: offer.latitude, longitude: offer.longitude }}
              title={offer.title}
              description={offer.locationLabel}
              onPress={() => setSelectedEvent(offer)}
              tracksViewChanges={false}
            >
              <View style={styles.eventMarkerWrap}>
                <View style={styles.eventMarkerLabel}>
                  <Text style={styles.eventMarkerLabelText} numberOfLines={1}>
                    {offer.title}
                  </Text>
                </View>
                <View style={styles.eventMarkerPin}>
                  <View style={styles.eventMarkerPinInner} />
                </View>
              </View>
            </Marker>
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
        <Text style={styles.topBarTitle}>Nearby Events Map</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.bottomCard}>
        {offersLoading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="small" color="#2563eb" />
            <Text style={styles.loadingText}>Loading nearby events...</Text>
          </View>
        ) : cardEvent ? (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.cardScrollContent}>
            {selectedEventLoading ? (
              <View style={styles.inlineLoadingRow}>
                <ActivityIndicator size="small" color="#2563eb" />
                <Text style={styles.loadingText}>Loading event details...</Text>
              </View>
            ) : null}

            {cardEvent.imageUrl ? (
              <Image source={{ uri: cardEvent.imageUrl }} style={styles.heroImage} />
            ) : (
              <View style={styles.heroImageFallback}>
                <Ionicons name="calendar" size={28} color={theme.COLORS.white} />
              </View>
            )}

            <View style={styles.headerTextBlock}>
              <Text style={styles.offerTitle} numberOfLines={2}>
                {cardEvent.title}
              </Text>
              <Text style={styles.offerSubtitle} numberOfLines={1}>
                {cardEvent.tag ?? cardEvent.offerText ?? "Active event"}
              </Text>
            </View>

            <View style={styles.routeSummaryCard}>
              <View style={styles.routeSummaryHeader}>
                <Ionicons name="location-outline" size={18} color={theme.COLORS.primary} />
                <Text style={styles.routeSummaryTitle} numberOfLines={1}>
                  {cardEvent.venue ?? "Event location"}
                </Text>
              </View>
              <Text style={styles.routeSummaryAddress} numberOfLines={2}>
                {routeLocationText}
              </Text>
              <View style={styles.metricsRow}>
                <View style={styles.metricPill}>
                  <Ionicons name="trail-sign-outline" size={15} color={theme.COLORS.primary} />
                  <Text style={styles.metricText}>{routeDistanceText}</Text>
                </View>
                <View style={styles.metricPill}>
                  <Ionicons name="time-outline" size={15} color={theme.COLORS.primary} />
                  <Text style={styles.metricText}>{routeDurationText}</Text>
                </View>
              </View>
            </View>

            <View style={styles.infoGrid}>
              <View style={styles.infoTile}>
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={styles.infoValue}>{cardEvent.date ?? "Date TBA"}</Text>
              </View>
              <View style={styles.infoTile}>
                <Text style={styles.infoLabel}>Booking</Text>
                <Text style={styles.infoValue} numberOfLines={1}>
                  {resolvedBookingStatusText}
                </Text>
              </View>
              <View style={styles.infoTile}>
                <Text style={styles.infoLabel}>Venue</Text>
                <Text style={styles.infoValue} numberOfLines={1}>
                  {cardEvent.venue ?? "Venue available"}
                </Text>
              </View>
              <View style={styles.infoTile}>
                <Text style={styles.infoLabel}>Ticket</Text>
                <Text style={styles.infoValue}>
                  {cardEvent.ticketPrice != null ? cardEvent.ticketPrice : "Check details"}
                </Text>
              </View>
            </View>

            {cardEvent.description ? (
              <Text style={styles.descriptionText} numberOfLines={3}>
                {cardEvent.description}
              </Text>
            ) : null}

            <View style={styles.bookingRow}>
              {canShowInlineBooking ? (
                <View style={styles.quantityCard}>
                  <Text style={styles.quantityLabel}>Tickets</Text>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={styles.stepperButton}
                      onPress={() => setTicketQuantity((current) => Math.max(1, current - 1))}
                      disabled={bookingState.loading}
                    >
                      <Ionicons name="remove" size={16} color={theme.COLORS.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.quantityValue}>{ticketQuantity}</Text>
                    <TouchableOpacity
                      style={styles.stepperButton}
                      onPress={() => setTicketQuantity((current) => Math.min(20, current + 1))}
                      disabled={bookingState.loading}
                    >
                      <Ionicons name="add" size={16} color={theme.COLORS.textPrimary} />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null}

              <TouchableOpacity
                style={[
                  styles.bookNowButton,
                  resolvedBookingCode ? styles.bookedButton : null,
                  cardEvent?.isSoldOut && !resolvedBookingCode ? styles.disabledButton : null,
                ]}
                onPress={handleBookNow}
                disabled={bookingState.loading || (cardEvent?.isSoldOut && !resolvedBookingCode)}
              >
                {bookingState.loading ? (
                  <ActivityIndicator size="small" color={theme.COLORS.white} />
                ) : (
                  <>
                    <Ionicons
                      name={
                        resolvedBookingCode
                          ? "receipt-outline"
                          : cardEvent?.isSoldOut
                            ? "ban-outline"
                            : canShowInlineBooking
                              ? "ticket-outline"
                              : "open-outline"
                      }
                      size={18}
                      color={theme.COLORS.white}
                    />
                    <Text style={styles.bookNowButtonText}>{primaryActionLabel}</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.secondaryButton} onPress={openEventDetails}>
                <Ionicons name="information-circle-outline" size={18} color="#1d4ed8" />
                <Text style={styles.secondaryButtonText}>View Details</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.directionsButton} onPress={openDirections}>
                <Ionicons name="navigate" size={18} color={theme.COLORS.white} />
                <Text style={styles.directionsButtonText}>Directions</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : (
          <>
            <View style={styles.locationInfo}>
              <Ionicons name="location" size={24} color={theme.COLORS.primary} />
              <View style={styles.textContainer}>
                <Text style={styles.locationTitle}>Nearby Events</Text>
                <Text style={styles.locationSubtitle} numberOfLines={2}>
                  {addressText}
                </Text>
                <Text style={styles.locationHint}>
                  All events are shown on the map. Tap any event pin to load its route and directions.
                </Text>
              </View>
            </View>
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
  loadingState: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    minHeight: 72,
  },
  loadingText: {
    color: theme.COLORS.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },
  inlineLoadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  bottomCard: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 40 : 24,
    left: 20,
    right: 20,
    backgroundColor: theme.COLORS.white,
    borderRadius: 24,
    padding: 16,
    maxHeight: height * 0.5,
    ...theme.SHADOWS.primary,
  },
  cardScrollContent: {
    paddingBottom: 4,
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
  heroImage: {
    width: "100%",
    height: 144,
    borderRadius: 18,
    backgroundColor: "#dbeafe",
    marginBottom: 14,
  },
  heroImageFallback: {
    width: "100%",
    height: 144,
    borderRadius: 18,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  headerTextBlock: {
    marginBottom: 14,
  },
  eventMarkerWrap: {
    alignItems: "center",
  },
  eventMarkerLabel: {
    maxWidth: 150,
    backgroundColor: "#1d4ed8",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.92)",
  },
  eventMarkerLabelText: {
    color: theme.COLORS.white,
    fontSize: 11,
    fontWeight: "800",
  },
  eventMarkerPin: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#2563eb",
    borderWidth: 3,
    borderColor: theme.COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    ...theme.SHADOWS.card,
  },
  eventMarkerPinInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.COLORS.white,
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
  routeSummaryCard: {
    marginTop: 14,
    marginBottom: 14,
    backgroundColor: "#f8fafc",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  routeSummaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  routeSummaryTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
  },
  routeSummaryAddress: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 18,
    color: theme.COLORS.textSecondary,
  },
  locationHint: {
    fontSize: 13,
    color: theme.COLORS.textSecondary,
    marginTop: 8,
    lineHeight: 18,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14,
  },
  infoTile: {
    width: "48%",
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.COLORS.textSecondary,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.COLORS.textPrimary,
  },
  descriptionText: {
    fontSize: 13,
    lineHeight: 19,
    color: theme.COLORS.textSecondary,
    marginBottom: 14,
  },
  metricsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
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
  bookingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  quantityCard: {
    width: 110,
    borderRadius: 14,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  quantityLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.COLORS.textSecondary,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepperButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.COLORS.white,
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
  },
  bookNowButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: theme.COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    ...theme.SHADOWS.primary,
  },
  bookedButton: {
    backgroundColor: "#16a34a",
  },
  disabledButton: {
    backgroundColor: "#94a3b8",
  },
  bookNowButtonText: {
    color: theme.COLORS.white,
    fontSize: 15,
    fontWeight: "800",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#bfdbfe",
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  secondaryButtonText: {
    color: "#1d4ed8",
    fontSize: 14,
    fontWeight: "700",
  },
  directionsButton: {
    flex: 1,
    backgroundColor: "#2563eb",
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    ...theme.SHADOWS.primary,
  },
  directionsButtonText: {
    color: theme.COLORS.white,
    fontSize: 15,
    fontWeight: "700",
  },
});

