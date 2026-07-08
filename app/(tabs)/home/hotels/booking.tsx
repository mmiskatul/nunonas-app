import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import theme from "../../../../constants/theme";
import PageHeader from "../../../../components/ui/PageHeader";
import { getHotel } from "../../../../lib/customer-api";
import { getFirstQueryParam } from "../../../../lib/event-map-utils";
import { getErrorMessage, normalizeHotel } from "../../../../lib/provider-utils";
import type { NormalizedHotel, ProviderPayload } from "../../../../lib/provider-types";
import { bookHotelRoom, bookHotelStay, getHotelRoom } from "../../../../lib/customer-api";

// Import Modular Components
import HotelStayDetails from "../../../../components/tabs/home/hotels/details/booking/HotelStayDetails";
import HotelGuestInfo from "../../../../components/tabs/home/hotels/details/booking/HotelGuestInfo";
import HotelPriceBreakdown from "../../../../components/tabs/home/hotels/details/booking/HotelPriceBreakdown";
import HotelCancellationPolicy from "../../../../components/tabs/home/hotels/details/booking/HotelCancellationPolicy";

export default function HotelBookingScreen() {
  const router = useRouter();
  const { id, roomId } = useLocalSearchParams();
  const hotelId = getFirstQueryParam(id);
  const selectedRoomId = getFirstQueryParam(roomId);
  const [hotel, setHotel] = useState<NormalizedHotel | null>(null);
  const [roomTitle, setRoomTitle] = useState("Executive King Suite");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadHotel() {
      if (!hotelId) {
        setError("Hotel not found.");
        setLoading(false);
        return;
      }

      try {
        const payload = await getHotel<ProviderPayload>(hotelId);
        if (!cancelled) {
          setHotel(normalizeHotel(payload));
        }
        if (selectedRoomId) {
          const roomPayload = await getHotelRoom<{ title?: string }>(selectedRoomId);
          if (!cancelled && roomPayload?.title) {
            setRoomTitle(roomPayload.title);
          }
        }
      } catch (error: unknown) {
        if (!cancelled) {
          setError(getErrorMessage(error, "Failed to load hotel."));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadHotel();

    return () => {
      cancelled = true;
    };
  }, [hotelId, selectedRoomId]);

  const handleConfirm = async () => {
    if (!hotelId || submitting) {
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        check_in_date: "2026-02-15",
        check_out_date: "2026-02-18",
        guests: 2,
        special_notes: "",
        auto_confirm: true,
      };
      const response = selectedRoomId
        ? await bookHotelRoom(selectedRoomId, payload)
        : await bookHotelStay(hotelId, payload);

      const bookingId =
        response?.booking_code ??
        response?.bookingCode ??
        response?.booking_id ??
        response?.id ??
        "HTL-BOOKING";

      router.replace({
        pathname: "/home/hotels/booking_success",
        params: {
          id: hotelId,
          bookingId: String(bookingId),
        },
      });
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Could not complete hotel booking."));
      Alert.alert("Booking failed", getErrorMessage(error, "Could not complete hotel booking."));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <PageHeader title="Booking" onBack={() => router.back()} />
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={theme.COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !hotel) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <PageHeader title="Booking" onBack={() => router.back()} />
        <View style={styles.centerState}>
          <Text style={styles.emptyText}>{error || "Hotel not found."}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <PageHeader title="Booking" onBack={() => router.back()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hotel Card */}
        <View style={styles.summaryCard}>
          <Image
            source={
              hotel.imageUrl
                ? { uri: hotel.imageUrl }
                : require("../../../../assets/images/discover-experience.png")
            }
            style={styles.hotelImage}
          />
          <View style={styles.hotelDetails}>
            <Text style={styles.hotelName}>{hotel.title}</Text>
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Ionicons key={i} name="star" size={14} color="#facc15" />
              ))}
              <Text style={styles.ratingText}>{hotel.ratingText}</Text>
            </View>
            <View style={styles.locationRow}>
              <Ionicons
                name="location-outline"
                size={14}
                color={theme.COLORS.textSecondary}
              />
              <Text style={styles.locationText}>{hotel.locationText}</Text>
            </View>
          </View>
        </View>

        {/* Room Card */}
        <View style={styles.summaryCard}>
          <Image
            source={require("../../../../assets/images/plan-smarter-with-ai.png")}
            style={styles.roomImage}
          />
          <View style={styles.hotelDetails}>
            <Text style={styles.hotelName}>{roomTitle}</Text>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Ionicons
                  name="bed-outline"
                  size={14}
                  color={theme.COLORS.textSecondary}
                />
                <Text style={styles.infoText}>King bed</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons
                  name="people-outline"
                  size={14}
                  color={theme.COLORS.textSecondary}
                />
                <Text style={styles.infoText}>2 guests</Text>
              </View>
            </View>
            <View style={styles.amenitiesRow}>
              <Text style={styles.amenityText}>
                • Free WiFi • City View • Room Service
              </Text>
            </View>
          </View>
        </View>

        <HotelStayDetails />
        <HotelGuestInfo />
        <HotelPriceBreakdown />
        <HotelCancellationPolicy />

        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm} disabled={submitting}>
          {submitting ? (
            <ActivityIndicator size="small" color={theme.COLORS.white} />
          ) : (
            <Text style={styles.confirmBtnText}>Confirm Book</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcfcfc",
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
  emptyText: {
    fontSize: 15,
    color: theme.COLORS.textSecondary,
    textAlign: "center",
  },
  summaryCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    gap: 12,
  },
  hotelImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  roomImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  hotelDetails: {
    flex: 1,
    justifyContent: "center",
  },
  hotelName: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.COLORS.textPrimary,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    color: theme.COLORS.textSecondary,
    marginLeft: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: theme.COLORS.textSecondary,
  },
  infoRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 4,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: theme.COLORS.textSecondary,
  },
  amenitiesRow: {
    marginTop: 2,
  },
  amenityText: {
    fontSize: 11,
    color: theme.COLORS.textSecondary,
  },
  confirmBtn: {
    backgroundColor: "#1e3a8a",
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  confirmBtnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});


