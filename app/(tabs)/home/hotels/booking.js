import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import theme from "../../../../constants/theme";
import PageHeader from "../../../../components/ui/PageHeader";

// Import Modular Components
import HotelStayDetails from "../../../../components/tabs/home/hotels/details/booking/HotelStayDetails";
import HotelGuestInfo from "../../../../components/tabs/home/hotels/details/booking/HotelGuestInfo";
import HotelPriceBreakdown from "../../../../components/tabs/home/hotels/details/booking/HotelPriceBreakdown";
import HotelCancellationPolicy from "../../../../components/tabs/home/hotels/details/booking/HotelCancellationPolicy";

export default function HotelBookingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const handleConfirm = () => {
    router.replace({
      pathname: "/home/hotels/booking_success",
      params: { id },
    });
  };

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
            source={require("../../../../assets/images/discover-experience.png")}
            style={styles.hotelImage}
          />
          <View style={styles.hotelDetails}>
            <Text style={styles.hotelName}>Grand Palace Hotel</Text>
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Ionicons key={i} name="star" size={14} color="#facc15" />
              ))}
              <Text style={styles.ratingText}>4.8</Text>
            </View>
            <View style={styles.locationRow}>
              <Ionicons
                name="location-outline"
                size={14}
                color={theme.COLORS.textSecondary}
              />
              <Text style={styles.locationText}>Downtown, New York</Text>
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
            <Text style={styles.hotelName}>Executive King Suite</Text>
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

        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
          <Text style={styles.confirmBtnText}>Confirm Book</Text>
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
