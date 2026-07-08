import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import theme from "../../../../constants/theme";
import Button from "../../../../components/ui/Button";
import { getSpa } from "../../../../lib/customer-api";
import { getFirstQueryParam } from "../../../../lib/event-map-utils";
import { getErrorMessage, normalizeSpa } from "../../../../lib/provider-utils";
import type { NormalizedSpa, ProviderPayload } from "../../../../lib/provider-types";

// Import Modular Components
import PageHeader from "../../../../components/ui/PageHeader";
import SpaSummary from "../../../../components/tabs/home/spa/details/booking/SpaSummary";
import DateSelector from "../../../../components/tabs/home/dining/details/booking/DateSelector";
import TimeSelector from "../../../../components/tabs/home/dining/details/booking/TimeSelector";
import GuestCounter from "../../../../components/tabs/home/dining/details/booking/GuestCounter";
import SpecialNotes from "../../../../components/tabs/home/spa/details/booking/SpaSpecialNotes";

export default function SpaBookingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const spaId = getFirstQueryParam(id);
  const [selectedDate, setSelectedDate] = useState("24");
  const [selectedTime, setSelectedTime] = useState("7:30 PM");
  const [guests, setGuests] = useState(4);
  const [notes, setNotes] = useState("");
  const [spa, setSpa] = useState<NormalizedSpa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadSpa() {
      if (!spaId) {
        setError("Spa not found.");
        setLoading(false);
        return;
      }

      try {
        const payload = await getSpa<ProviderPayload>(spaId);
        if (!cancelled) {
          setSpa(normalizeSpa(payload));
        }
      } catch (error: unknown) {
        if (!cancelled) {
          setError(getErrorMessage(error, "Failed to load spa."));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSpa();

    return () => {
      cancelled = true;
    };
  }, [spaId]);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <PageHeader title="Book Spa" onBack={handleBack} />
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={theme.COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !spa) {
    return (
      <SafeAreaView style={styles.container}>
        <PageHeader title="Book Spa" onBack={handleBack} />
        <View style={styles.centerState}>
          <Text style={styles.errorText}>{error || "Spa not found."}</Text>
        </View>
      </SafeAreaView>
    );
  }

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
                id: spaId ?? "",
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


