// @ts-nocheck
import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import theme from "../../../../constants/theme";
import Button from "../../../../components/ui/Button";
import PageHeader from "../../../../components/ui/PageHeader";

// Import Modular Components
import SpaSummary from "../../../../components/tabs/home/spa/details/booking/SpaSummary";
import SpaBookingDetails from "../../../../components/tabs/home/spa/details/booking/SpaBookingDetails";
import SpaSpecialNotes from "../../../../components/tabs/home/spa/details/booking/SpaSpecialNotes";

const SPA_DATA = {
  1: {
    id: 1,
    title: "Serenity Spa & Wellness",
    rating: "4.8",
    reviews: "230",
    location: "Downtown",
    distance: "2.3 km",
    image: require("../../../../assets/images/spa/galley/Rectangle 2.png"),
  },
};

export default function SpaConfirmBookingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { id, date, time, guests, notes } = params;

  const spa = SPA_DATA[id] || SPA_DATA["1"];

  const handleBack = () => {
    router.back();
  };

  const handleConfirm = () => {
    router.replace({
      pathname: "/home/spa/booking_success",
      params: {
        id,
        spaName: spa.title,
        dateTime: displayDate,
        guests: displayGuests,
      },
    });
  };

  // Format date for display based on screenshot
  const displayDate = date
    ? `Saturday, Jan ${date}, 2026`
    : "Saturday, Jan 24, 2026";
  const displayTime = time || "7:30 PM";
  const displayGuests = guests || "4";

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader title="Booking Summary" onBack={handleBack} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <SpaSummary spa={spa} />

        <SpaBookingDetails
          date={displayDate}
          time={displayTime}
          guests={displayGuests}
        />

        <SpaSpecialNotes notes={notes} editable={false} />

        <Button
          title="confirm Booking"
          onPress={handleConfirm}
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
  confirmButton: {
    height: 56,
    borderRadius: 16,
    marginTop: 10,
    backgroundColor: theme.COLORS.primary,
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: "700",
    // textTransform: "capitalize", // Matches screenshot "confirm Booking"
  },
});


