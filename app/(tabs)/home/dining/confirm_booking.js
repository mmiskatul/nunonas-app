import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import theme from "../../../../constants/theme";
import Button from "../../../../components/ui/Button";
import PageHeader from "../../../../components/ui/PageHeader";

// Import Modular Components
import ConfirmSummaryCard from "../../../../components/tabs/home/dining/details/booking/confirm_booking/ConfirmSummaryCard";
import ConfirmationDetails from "../../../../components/tabs/home/dining/details/booking/confirm_booking/ConfirmationDetails";
import ConfirmNotes from "../../../../components/tabs/home/dining/details/booking/confirm_booking/ConfirmNotes";

const RESTAURANTS_DATA = {
  1: {
    id: 1,
    title: "Serenity Spa & Wellness",
    rating: "4.8",
    reviews: "230",
    location: "Downtown",
    distance: "2.3 km",
    image: require("../../../../assets/images/discover-experience.png"),
  },
};

export default function ConfirmBookingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const { id, date, time, guests, notes, seating } = params;
  
  const restaurant = RESTAURANTS_DATA[id] || RESTAURANTS_DATA["1"];

  const handleBack = () => {
    router.back();
  };

  const handleConfirm = () => {
    router.replace({
      pathname: "/(tabs)/home/dining/booking_success",
      params: {
        id,
        restaurantName: restaurant.title,
        dateTime: displayDate.replace("Wednesday, ", ""), // Simplified for success screen
        guests: displayGuests,
        seating: displaySeating,
      }
    });
  };

  // Format date for display
  const displayDate = date ? `Wednesday, Jan ${date}, 2026` : "Saturday, Jan 24, 2026";
  const displayTime = time || "7:30 PM";
  const displayGuests = guests || "4";
  const displaySeating = seating || "Outdoor";

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
  },
  confirmButtonText: {
    textTransform: "capitalize",
  },
});
