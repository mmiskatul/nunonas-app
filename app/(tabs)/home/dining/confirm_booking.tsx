// @ts-nocheck
import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, Alert, ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import theme from "../../../../constants/theme";
import Button from "../../../../components/ui/Button";
import PageHeader from "../../../../components/ui/PageHeader";
import {
  bookRestaurantTable,
  getRestaurant,
} from "../../../../lib/customer-api";
import { getFirstQueryParam, getErrorMessage } from "../../../../lib/event-map-utils";
import { normalizeRestaurant } from "../../../../lib/provider-utils";

// Import Modular Components
import ConfirmSummaryCard from "../../../../components/tabs/home/dining/details/booking/confirm_booking/ConfirmSummaryCard";
import ConfirmationDetails from "../../../../components/tabs/home/dining/details/booking/confirm_booking/ConfirmationDetails";
import ConfirmNotes from "../../../../components/tabs/home/dining/details/booking/confirm_booking/ConfirmNotes";

export default function ConfirmBookingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const { id, date, time, guests, notes, seating } = params;
  const restaurantId = getFirstQueryParam(id);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadRestaurant() {
      if (!restaurantId) {
        setError("Restaurant not found.");
        setLoading(false);
        return;
      }

      try {
        const payload = await getRestaurant(restaurantId);
        if (!cancelled) {
          const normalized = normalizeRestaurant(payload);
          setRestaurant({
            title: normalized.title,
            location: normalized.locationText,
            distance: normalized.distanceText,
            rating: normalized.ratingText,
            reviews: normalized.reviewsText,
            image: normalized.imageUrl
              ? { uri: normalized.imageUrl }
              : require("../../../../assets/images/discover-experience.png"),
          });
        }
      } catch (error) {
        if (!cancelled) {
          setError(getErrorMessage(error, "Failed to load restaurant."));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadRestaurant();

    return () => {
      cancelled = true;
    };
  }, [restaurantId]);

  const handleBack = () => {
    router.back();
  };

  const buildBookingDate = (value) => {
    if (!value) {
      return "2026-01-24";
    }

    const parsed = String(value).padStart(2, "0");
    return `2026-01-${parsed}`;
  };

  const handleConfirm = async () => {
    if (!restaurantId || submitting) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await bookRestaurantTable(restaurantId, {
        date: buildBookingDate(date),
        time: String(time || "7:30 PM"),
        guests: Number(guests || 4),
        seating_preference: String(seating || "Outdoor"),
        special_notes: typeof notes === "string" ? notes : "",
        auto_confirm: true,
      });

      const bookingId = response?.booking_code ?? response?.bookingCode ?? response?.booking_id ?? response?.id ?? "#BK2026";
      router.replace({
        pathname: "/(tabs)/home/dining/booking_success",
        params: {
          id: restaurantId,
          restaurantName: restaurant?.title ?? "Restaurant",
          dateTime: `${displayDate.replace("Wednesday, ", "")} at ${displayTime}`,
          guests: displayGuests,
          seating: displaySeating,
          bookingId: String(bookingId),
        }
      });
    } catch (error) {
      Alert.alert("Booking failed", getErrorMessage(error, "Could not confirm restaurant booking."));
    } finally {
      setSubmitting(false);
    }
  };

  // Format date for display
  const displayDate = date ? `Wednesday, Jan ${date}, 2026` : "Saturday, Jan 24, 2026";
  const displayTime = time || "7:30 PM";
  const displayGuests = guests || "4";
  const displaySeating = seating || "Outdoor";

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <PageHeader title="Booking Summary" onBack={handleBack} />
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={theme.COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !restaurant) {
    return (
      <SafeAreaView style={styles.container}>
        <PageHeader title="Booking Summary" onBack={handleBack} />
        <View style={styles.centerState}>
          <Text style={styles.errorText}>{error || "Restaurant not found."}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader title="Booking Summary" onBack={handleBack} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ConfirmSummaryCard restaurant={restaurant} />
        
        <ConfirmationDetails 
          date={displayDate}
          time={displayTime}
          guests={displayGuests}
          seating={displaySeating}
        />
        
        <ConfirmNotes notes={notes} />

        <Button
          title="confirm Booking"
          onPress={handleConfirm}
          loading={submitting}
          style={styles.confirmButton}
          textStyle={styles.confirmButtonText}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  centerState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 15,
    color: theme.COLORS.textSecondary,
    textAlign: "center",
  },
  confirmButton: {
    height: 56,
    borderRadius: 16,
    marginTop: 10,
  },
  confirmButtonText: {
    textTransform: "capitalize",
  },
});


