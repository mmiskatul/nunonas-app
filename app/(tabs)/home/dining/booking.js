import React, { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import theme from "../../../../constants/theme";
import Button from "../../../../components/ui/Button";

// Import Modular Components
import PageHeader from "../../../../components/ui/PageHeader";
import RestaurantSummary from "../../../../components/tabs/home/dining/details/booking/RestaurantSummary";
import DateSelector from "../../../../components/tabs/home/dining/details/booking/DateSelector";
import TimeSelector from "../../../../components/tabs/home/dining/details/booking/TimeSelector";
import GuestCounter from "../../../../components/tabs/home/dining/details/booking/GuestCounter";
import SeatingPreference from "../../../../components/tabs/home/dining/details/booking/SeatingPreference";
import SpecialNotes from "../../../../components/tabs/home/dining/details/booking/SpecialNotes";
import BookingPolicy from "../../../../components/tabs/home/dining/details/booking/BookingPolicy";

const RESTAURANTS_DATA = {
  1: {
    title: "Serenity Spa & Wellness",
    rating: "4.8",
    reviews: "230",
    location: "Downtown",
    distance: "2.3 km",
  },
};

export default function BookingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [selectedDate, setSelectedDate] = useState("16");
  const [selectedTime, setSelectedTime] = useState("7:00 PM");
  const [guests, setGuests] = useState(2);
  const [seating, setSeating] = useState("Outdoor");
  const [notes, setNotes] = useState("");

  const restaurant = RESTAURANTS_DATA[id] || RESTAURANTS_DATA["1"];

  const handleBack = () => {
    router.back();
  };

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
                id,
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
  continueButton: {
    height: 56,
    borderRadius: 16,
    marginTop: 10,
  },
});
