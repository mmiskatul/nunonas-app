import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import theme from "../../../../constants/theme";
import Button from "../../../../components/ui/Button";
import { Ionicons } from "@expo/vector-icons";

export default function SpaBookingSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { spaName, dateTime, guests } = params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successIconBox}>
          <Ionicons
            name="checkmark-circle"
            size={100}
            color={theme.COLORS.primary}
          />
        </View>

        <Text style={styles.title}>Booking Successful!</Text>
        <Text style={styles.subtitle}>
          Your appointment at {spaName || "Serenity Spa"} has been confirmed.
        </Text>

        <View style={styles.detailsBox}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date & Time</Text>
            <Text style={styles.detailValue}>
              {dateTime || "Saturday, Jan 24, 7:30 PM"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Guests</Text>
            <Text style={styles.detailValue}>{guests || "4"} People</Text>
          </View>
        </View>

        <Button
          title="Back to Home"
          onPress={() => router.push("/home")}
          style={styles.homeButton}
        />

        <Button
          title="View My Bookings"
          onPress={() => router.push("/profile")}
          variant="outline"
          style={styles.bookingsButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  content: {
    flex: 1,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  successIconBox: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: theme.COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  detailsBox: {
    width: "100%",
    backgroundColor: theme.COLORS.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 40,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 14,
    color: theme.COLORS.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.COLORS.textPrimary,
  },
  homeButton: {
    width: "100%",
    height: 56,
    borderRadius: 16,
    marginBottom: 16,
  },
  bookingsButton: {
    width: "100%",
    height: 56,
    borderRadius: 16,
  },
});
