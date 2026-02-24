import React, { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import theme from "../../../../constants/theme";
import Button from "../../../../components/ui/Button";

// Import Modular Components
import PageHeader from "../../../../components/ui/PageHeader";
import SpaSummary from "../../../../components/tabs/home/spa/details/booking/SpaSummary";
import DateSelector from "../../../../components/tabs/home/dining/details/booking/DateSelector";
import TimeSelector from "../../../../components/tabs/home/dining/details/booking/TimeSelector";
import GuestCounter from "../../../../components/tabs/home/dining/details/booking/GuestCounter";
import SpecialNotes from "../../../../components/tabs/home/spa/details/booking/SpaSpecialNotes";

const SPA_DATA = {
  1: {
    title: "Serenity Spa & Wellness",
    rating: "4.8",
    reviews: "230",
    location: "Downtown",
    distance: "2.3 km",
    image: require("../../../../assets/images/spa/galley/Rectangle 2.png"),
  },
};

export default function SpaBookingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [selectedDate, setSelectedDate] = useState("24");
  const [selectedTime, setSelectedTime] = useState("7:30 PM");
  const [guests, setGuests] = useState(4);
  const [notes, setNotes] = useState("");

  const spa = SPA_DATA[id] || SPA_DATA["1"];

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader title="Book Spa" onBack={handleBack} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <SpaSummary spa={spa} />

        <DateSelector
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />

        <TimeSelector
          selectedTime={selectedTime}
          onTimeSelect={setSelectedTime}
        />

        <GuestCounter guests={guests} onGuestsChange={setGuests} />

        <SpecialNotes notes={notes} onNotesChange={setNotes} />

        <Button
          title="Continue"
          onPress={() => {
            router.push({
              pathname: "/home/spa/confirm_booking",
              params: {
                id,
                date: selectedDate,
                time: selectedTime,
                guests,
                notes,
              },
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
  continueButton: {
    height: 56,
    borderRadius: 16,
    marginTop: 10,
  },
});
