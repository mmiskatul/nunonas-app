import React, { useEffect, useMemo, useState } from "react";
import { Alert, StyleSheet, View, ScrollView, ActivityIndicator, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import theme from "../../../../constants/theme";
import { bookEventTickets, getEvent } from "../../../../lib/customer-api";
import { getCurrentCoords } from "../../../../lib/location";

import EventImageHeader from "../../../../components/tabs/home/events/details/EventImageHeader";
import EventKeyInfo from "../../../../components/tabs/home/events/details/EventKeyInfo";
import EventAbout from "../../../../components/tabs/home/events/details/EventAbout";
import EventLocationMap from "../../../../components/tabs/home/events/details/EventLocationMap";
import EventFooter from "../../../../components/tabs/home/events/details/EventFooter";

function formatEventDate(value) {
  if (!value) return "Date TBA";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function formatEventTime(startTime, endTime) {
  if (!startTime) return "Time TBA";
  const start = startTime.slice(0, 5);
  const end = endTime ? endTime.slice(0, 5) : "";
  return end ? `${start} - ${end}` : start;
}

function getDistanceText(distanceKm) {
  if (typeof distanceKm !== "number") return "Nearby";
  return `${distanceKm.toFixed(1)} km`;
}

function normalizeEvent(item = {}) {
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
    rating: item.rating ?? null,
    reviewsCount: item.reviews_count ?? null,
    coordinates:
      item.latitude != null && item.longitude != null
        ? { latitude: Number(item.latitude), longitude: Number(item.longitude) }
        : null,
  };
}

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [error, setError] = useState("");
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [bookingState, setBookingState] = useState({
    loading: false,
    code: "",
  });

  useEffect(() => {
    let cancelled = false;

    async function loadDetails() {
      try {
        setLoading(true);
        setError("");
        const [eventPayload, coords] = await Promise.all([
          getEvent(id),
          getCurrentCoords().catch(() => null),
        ]);
        if (cancelled) {
          return;
        }
        setEvent(normalizeEvent(eventPayload));
        setOrigin(coords ? { latitude: coords.latitude, longitude: coords.longitude } : null);
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Could not load event details.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDetails();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const content = useMemo(() => {
    if (!event) {
      return null;
    }

    return (
      <>
        <EventImageHeader event={event} />
        <EventKeyInfo event={event} />
        <EventAbout description={event.description} artists={[event.eventType, event.venue]} />
        <EventLocationMap
          venueName={event.venue}
          address={event.address}
          coordinates={event.coordinates}
          origin={origin}
        />
      </>
    );
  }, [event, origin]);

  const handleBook = async () => {
    if (!event?.id || bookingState.loading) {
      return;
    }

    try {
      setBookingState({ loading: true, code: bookingState.code });
      const response = await bookEventTickets(event.id, {
        quantity: ticketQuantity,
        auto_confirm: true,
      });
      const bookingCode = response?.booking_code ?? response?.bookingCode ?? "";
      setBookingState({ loading: false, code: bookingCode });
      Alert.alert(
        "Ticket booked",
        bookingCode
          ? `Your booking reference is ${bookingCode}.`
          : "Your event ticket has been booked."
      );
    } catch (err) {
      setBookingState({ loading: false, code: bookingState.code });
      Alert.alert("Booking failed", err?.message || "Could not book tickets right now.");
    }
  };

  if (loading) {
    return (
      <View style={styles.centerState}>
        <ActivityIndicator color={theme.COLORS.primary} />
      </View>
    );
  }

  if (error || !event) {
    return (
      <View style={styles.centerState}>
        <Text style={styles.messageText}>{error || "Event not found."}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {content}
      </ScrollView>
      <EventFooter
        event={event}
        quantity={ticketQuantity}
        onChangeQuantity={setTicketQuantity}
        onBook={handleBook}
        booking={bookingState}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  centerState: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  messageText: {
    color: theme.COLORS.textSecondary,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});
