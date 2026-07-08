import React, { useEffect, useMemo, useState } from "react";
import { Alert, StyleSheet, View, ScrollView, ActivityIndicator, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import theme from "../../../../constants/theme";
import { bookEventTickets, getEvent } from "../../../../lib/customer-api";
import { getErrorMessage, getFirstQueryParam, normalizeMapEvent } from "../../../../lib/event-map-utils";
import type {
  CustomerMapEventPayload,
  EventBookingResponse,
  GeoCoordinates,
  NormalizedMapEvent,
} from "../../../../lib/event-map-types";
import { getCurrentCoords } from "../../../../lib/location";

import EventImageHeader from "../../../../components/tabs/home/events/details/EventImageHeader";
import EventKeyInfo from "../../../../components/tabs/home/events/details/EventKeyInfo";
import EventAbout from "../../../../components/tabs/home/events/details/EventAbout";
import EventLocationMap from "../../../../components/tabs/home/events/details/EventLocationMap";
import EventFooter from "../../../../components/tabs/home/events/details/EventFooter";

type BookingState = {
  loading: boolean;
  code: string;
};

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams();
  const eventId = getFirstQueryParam(id);
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<NormalizedMapEvent | null>(null);
  const [origin, setOrigin] = useState<GeoCoordinates | null>(null);
  const [error, setError] = useState("");
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [bookingState, setBookingState] = useState<BookingState>({
    loading: false,
    code: "",
  });

  useEffect(() => {
    let cancelled = false;

    async function loadDetails() {
      if (!eventId) {
        setError("Event not found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const [eventPayload, coords] = await Promise.all([
          getEvent<CustomerMapEventPayload>(eventId),
          getCurrentCoords().catch(() => null),
        ]);
        if (cancelled) {
          return;
        }
        setEvent(normalizeMapEvent(eventPayload));
        setOrigin(coords ? { latitude: coords.latitude, longitude: coords.longitude } : null);
      } catch (error: unknown) {
        if (!cancelled) {
          setError(getErrorMessage(error, "Could not load event details."));
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
  }, [eventId]);

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
          coordinates={
            event.latitude != null && event.longitude != null
              ? { latitude: event.latitude, longitude: event.longitude }
              : null
          }
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
      const response = await bookEventTickets<EventBookingResponse, { quantity: number; auto_confirm: boolean }>(event.id, {
        quantity: ticketQuantity,
        auto_confirm: true,
      });
      const bookingCode = response.booking_code ?? response.bookingCode ?? "";
      setBookingState({ loading: false, code: bookingCode });
      Alert.alert(
        "Ticket booked",
        bookingCode
          ? `Your booking reference is ${bookingCode}.`
          : "Your event ticket has been booked."
      );
    } catch (error: unknown) {
      setBookingState({ loading: false, code: bookingState.code });
      Alert.alert("Booking failed", getErrorMessage(error, "Could not book tickets right now."));
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


