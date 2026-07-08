import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
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
    imageUrl: item.banner_image_url ?? item.cover_image_url ?? "",
    description: item.description ?? "",
    ticketPrice: item.ticket_price != null ? `${item.ticket_price}` : null,
    distance: getDistanceText(distanceValue),
    distanceKm: Number.isFinite(distanceValue) ? distanceValue : null,
    latitude: item.latitude != null ? Number(item.latitude) : null,
    longitude: item.longitude != null ? Number(item.longitude) : null,
    bookingMode: item.booking_mode ?? item.bookingMode ?? "simple",
    canBookOnMap: Boolean(item.can_book_on_map ?? item.canBookOnMap),
    currentBookingStatus: item.current_booking_status ?? item.currentBookingStatus ?? "",
    currentBookingCode: item.current_booking_code ?? item.currentBookingCode ?? "",
    isSoldOut: Boolean(item.is_sold_out ?? item.isSoldOut),
    detailRoute: item.detail_route ?? item.detailRoute ?? (item.id ? `/home/events/${item.id}` : null),
  };
}

export default function MapScreenWeb() {
  const router = useRouter();
  const { offerId, eventId } = useLocalSearchParams();
  const [markerCoords, setMarkerCoords] = useState({ latitude: 25.2854, longitude: 51.531 });
  const [addressText, setAddressText] = useState("Doha Qatar");
  const [offersLoading, setOffersLoading] = useState(true);
  const [nearbyEvents, setNearbyEvents] = useState([]);
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
    async function initLocation() {
      try {
        const coords = await getCurrentCoords();
        if (!coords) {
          return;
        }

        setMarkerCoords({ latitude: coords.latitude, longitude: coords.longitude });
        const address = await reverseGeocode(coords.latitude, coords.longitude);
        if (address) {
          setAddressText(address);
        }
      } catch (error) {
        if (!isExpectedLocationError(error)) {
          console.error("Error fetching location:", error);
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
        console.error("Error loading offers for web map:", error);
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

  const cardEvent = selectedEventDetails ?? selectedEvent;
  const resolvedBookingStatus = bookingState.status || cardEvent?.currentBookingStatus || "";
  const resolvedBookingCode = bookingState.code || cardEvent?.currentBookingCode || "";
  const resolvedBookingStatusText = resolvedBookingCode
    ? `${resolvedBookingStatus || "confirmed"} - ${resolvedBookingCode}`
    : resolvedBookingStatus || "Not booked yet";
  const canShowInlineBooking =
    cardEvent?.bookingMode === "simple" &&
    cardEvent?.canBookOnMap &&
    !cardEvent?.isSoldOut &&
    !resolvedBookingCode;
  const routeDistanceText =
    routeInfo?.distanceText ??
    (typeof cardEvent?.distanceKm === "number" ? `${cardEvent.distanceKm.toFixed(1)} km away` : cardEvent?.distance ?? "Nearby");
  const routeDurationText = routeInfo?.durationText ?? "Select for route";
  const routeLocationText = cardEvent?.address ?? cardEvent?.location ?? "Location available";

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

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={theme.COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Nearby Events</Text>
        <View style={styles.topBarSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.noticeCard}>
          <Ionicons name="desktop-outline" size={22} color={theme.COLORS.primary} />
          <View style={styles.noticeBody}>
            <Text style={styles.noticeTitle}>Web fallback view</Text>
            <Text style={styles.noticeText}>
              Native map rendering is disabled on web. You can still inspect nearby events,
              open directions, and book supported events.
            </Text>
          </View>
        </View>

            <View style={styles.locationCard}>
          <Text style={styles.locationLabel}>Nearby events</Text>
          <Text style={styles.locationValue}>{addressText}</Text>
          <Text style={styles.locationHint}>
            All events are listed below. Select one to load directions.
          </Text>
        </View>

        {offersLoading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="small" color={theme.COLORS.primary} />
            <Text style={styles.loadingText}>Loading nearby events...</Text>
          </View>
        ) : (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.eventPills}
            >
              {nearbyEvents.map((offer) => (
                <TouchableOpacity
                  key={String(offer.id)}
                  style={[
                    styles.eventPill,
                    selectedEvent?.id === offer.id ? styles.eventPillActive : null,
                  ]}
                  onPress={() => setSelectedEvent(offer)}
                >
                  <Text
                    style={[
                      styles.eventPillText,
                      selectedEvent?.id === offer.id ? styles.eventPillTextActive : null,
                    ]}
                    numberOfLines={1}
                  >
                    {offer.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {cardEvent ? (
              <View style={styles.detailsCard}>
                {selectedEventLoading ? (
                  <View style={styles.inlineLoadingRow}>
                    <ActivityIndicator size="small" color={theme.COLORS.primary} />
                    <Text style={styles.loadingText}>Loading event details...</Text>
                  </View>
                ) : null}

                {cardEvent.imageUrl ? (
                  <Image source={{ uri: cardEvent.imageUrl }} style={styles.heroImage} />
                ) : (
                  <View style={styles.heroFallback}>
                    <Ionicons name="calendar" size={28} color={theme.COLORS.white} />
                  </View>
                )}

                <Text style={styles.offerTitle}>{cardEvent.title}</Text>
                <Text style={styles.offerSubtitle}>{cardEvent.tag ?? "Active event"}</Text>
                <View style={styles.routeSummaryCard}>
                  <View style={styles.routeSummaryHeader}>
                    <Ionicons name="location-outline" size={18} color={theme.COLORS.primary} />
                    <Text style={styles.routeSummaryTitle}>{cardEvent.venue ?? "Event location"}</Text>
                  </View>
                  <Text style={styles.offerLocation}>{routeLocationText}</Text>
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
                </View>

                {cardEvent.description ? (
                  <Text style={styles.descriptionText}>{cardEvent.description}</Text>
                ) : null}

                {canShowInlineBooking ? (
                  <View style={styles.quantityCard}>
                    <Text style={styles.quantityLabel}>Tickets</Text>
                    <View style={styles.quantityControls}>
                      <TouchableOpacity
                        style={styles.stepperButton}
                        onPress={() => setTicketQuantity((current) => Math.max(1, current - 1))}
                      >
                        <Ionicons name="remove" size={16} color={theme.COLORS.textPrimary} />
                      </TouchableOpacity>
                      <Text style={styles.quantityValue}>{ticketQuantity}</Text>
                      <TouchableOpacity
                        style={styles.stepperButton}
                        onPress={() => setTicketQuantity((current) => Math.min(20, current + 1))}
                      >
                        <Ionicons name="add" size={16} color={theme.COLORS.textPrimary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null}

                <View style={styles.actionsRow}>
                  <TouchableOpacity style={styles.secondaryButton} onPress={openEventDetails}>
                    <Ionicons name="information-circle-outline" size={18} color="#1d4ed8" />
                    <Text style={styles.secondaryButtonText}>View Details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.directionsButton} onPress={openDirections}>
                    <Ionicons name="navigate-outline" size={18} color={theme.COLORS.white} />
                    <Text style={styles.directionsButtonText}>Directions</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[
                    styles.bookButton,
                    resolvedBookingCode ? styles.bookedButton : null,
                    cardEvent.isSoldOut && !resolvedBookingCode ? styles.disabledButton : null,
                  ]}
                  onPress={handleBookNow}
                  disabled={bookingState.loading || (cardEvent.isSoldOut && !resolvedBookingCode)}
                >
                  {bookingState.loading ? (
                    <ActivityIndicator size="small" color={theme.COLORS.white} />
                  ) : (
                    <Text style={styles.bookButtonText}>
                      {resolvedBookingCode
                        ? "View Booking"
                        : cardEvent.isSoldOut
                          ? "Sold Out"
                          : canShowInlineBooking
                            ? "Book Now"
                            : "Open Details"}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.emptyStateCard}>
                <Ionicons name="location-outline" size={28} color={theme.COLORS.primary} />
                <Text style={styles.emptyStateTitle}>Select an event</Text>
                <Text style={styles.emptyStateText}>
                  Choose any event from the list to load its directions and booking options.
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  topBar: {
    paddingTop: 28,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.COLORS.white,
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
  },
  topBarSpacer: {
    width: 42,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 14,
  },
  noticeCard: {
    backgroundColor: "#eff6ff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#bfdbfe",
    padding: 16,
    flexDirection: "row",
    gap: 12,
  },
  noticeBody: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
  },
  noticeText: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    color: theme.COLORS.textSecondary,
  },
  locationCard: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 18,
    padding: 16,
  },
  locationLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.COLORS.textSecondary,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  locationValue: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.COLORS.textPrimary,
  },
  locationHint: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    color: theme.COLORS.textSecondary,
  },
  loadingState: {
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  loadingText: {
    color: theme.COLORS.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },
  eventPills: {
    gap: 8,
    paddingVertical: 4,
  },
  eventPill: {
    backgroundColor: "#e2e8f0",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    maxWidth: 220,
  },
  eventPillActive: {
    backgroundColor: theme.COLORS.primary,
  },
  eventPillText: {
    color: theme.COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
  eventPillTextActive: {
    color: theme.COLORS.white,
  },
  detailsCard: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 24,
    padding: 16,
  },
  routeSummaryCard: {
    marginTop: 14,
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
  emptyStateCard: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    gap: 10,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
  },
  emptyStateText: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    color: theme.COLORS.textSecondary,
  },
  inlineLoadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  heroImage: {
    width: "100%",
    height: 180,
    borderRadius: 18,
    backgroundColor: "#dbeafe",
    marginBottom: 14,
  },
  heroFallback: {
    width: "100%",
    height: 180,
    borderRadius: 18,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  offerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
  },
  offerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "700",
    color: theme.COLORS.primary,
  },
  offerLocation: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 19,
    color: theme.COLORS.textSecondary,
  },
  metricsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  metricPill: {
    flex: 1,
    backgroundColor: "#eff6ff",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  metricText: {
    color: theme.COLORS.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  infoGrid: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  infoTile: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    padding: 12,
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
    marginTop: 14,
    fontSize: 13,
    lineHeight: 19,
    color: theme.COLORS.textSecondary,
  },
  quantityCard: {
    marginTop: 14,
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    padding: 12,
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
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  secondaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
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
    height: 48,
    borderRadius: 16,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  directionsButtonText: {
    color: theme.COLORS.white,
    fontSize: 14,
    fontWeight: "700",
  },
  bookButton: {
    marginTop: 12,
    height: 50,
    borderRadius: 16,
    backgroundColor: theme.COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  bookedButton: {
    backgroundColor: "#16a34a",
  },
  disabledButton: {
    backgroundColor: "#94a3b8",
  },
  bookButtonText: {
    color: theme.COLORS.white,
    fontSize: 15,
    fontWeight: "800",
  },
});
