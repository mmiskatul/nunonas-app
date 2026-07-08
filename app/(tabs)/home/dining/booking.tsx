import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import theme from "../../../../constants/theme";
import Button from "../../../../components/ui/Button";
import { getRestaurant } from "../../../../lib/customer-api";
import { getFirstQueryParam } from "../../../../lib/event-map-utils";
import { getErrorMessage, normalizeRestaurant } from "../../../../lib/provider-utils";
import type { NormalizedRestaurant, ProviderPayload } from "../../../../lib/provider-types";

// Import Modular Components
import PageHeader from "../../../../components/ui/PageHeader";
import RestaurantSummary from "../../../../components/tabs/home/dining/details/booking/RestaurantSummary";
import DateSelector from "../../../../components/tabs/home/dining/details/booking/DateSelector";
import TimeSelector from "../../../../components/tabs/home/dining/details/booking/TimeSelector";
import GuestCounter from "../../../../components/tabs/home/dining/details/booking/GuestCounter";
import SeatingPreference from "../../../../components/tabs/home/dining/details/booking/SeatingPreference";
import SpecialNotes from "../../../../components/tabs/home/dining/details/booking/SpecialNotes";
import BookingPolicy from "../../../../components/tabs/home/dining/details/booking/BookingPolicy";

export default function BookingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const restaurantId = getFirstQueryParam(id);
  const [selectedDate, setSelectedDate] = useState("16");
  const [selectedTime, setSelectedTime] = useState("7:00 PM");
  const [guests, setGuests] = useState(2);
  const [seating, setSeating] = useState("Outdoor");
  const [notes, setNotes] = useState("");
  const [restaurant, setRestaurant] = useState<NormalizedRestaurant | null>(null);
  const [loading, setLoading] = useState(true);
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
        const payload = await getRestaurant<ProviderPayload>(restaurantId);
        if (!cancelled) {
          setRestaurant(normalizeRestaurant(payload));
        }
      } catch (error: unknown) {
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <PageHeader title="Book a Table" onBack={handleBack} />
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={theme.COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !restaurant) {
    return (
      <SafeAreaView style={styles.container}>
        <PageHeader title="Book a Table" onBack={handleBack} />
        <View style={styles.centerState}>
          <Text style={styles.errorText}>{error || "Restaurant not found."}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader title="Book a Table" onBack={handleBack} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <RestaurantSummary restaurant={restaurant} />
        
        <DateSelector 
          selectedDate={selectedDate} 
          onDateSelect={setSelectedDate} 
        />
        
        <TimeSelector 
          selectedTime={selectedTime} 
          onTimeSelect={setSelectedTime} 
        />
        
        <GuestCounter 
          guests={guests} 
          onGuestsChange={setGuests} 
        />
        
        <SeatingPreference 
          seating={seating} 
          onSeatingChange={setSeating} 
        />
        
        <SpecialNotes 
          notes={notes} 
          onNotesChange={setNotes} 
        />
        
        <BookingPolicy />

        <Button
          title="Continue"
          onPress={() => {
            router.push({
              pathname: "/(tabs)/home/dining/confirm_booking",
              params: {
                id: restaurantId ?? "",
                date: selectedDate,
                time: selectedTime,
                guests,
                notes,
                seating,
              }
            });
          }}
          style={styles.continueButton}
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
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 15,
    color: theme.COLORS.textSecondary,
    textAlign: "center",
  },
  continueButton: {
    height: 56,
    borderRadius: 16,
    marginTop: 10,
  },
});


