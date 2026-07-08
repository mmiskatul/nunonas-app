// @ts-nocheck
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import theme from "../../../constants/theme";

// Import Home Components
import ExploreNearbyBanner from "../../../components/tabs/home/ExploreNearbyBanner";
import PlanForMeBanner from "../../../components/tabs/home/PlanForMeBanner";
import QuickAccess from "../../../components/tabs/home/QuickAccess";
import TrendingNow from "../../../components/tabs/home/TrendingNow";
import FeaturedExperiences from "../../../components/tabs/home/FeaturedExperiences";
import LocationDrawerModal from "../../../components/ui/LocationDrawerModal";
import { reverseGeocode } from "../../../lib/google-maps";
import { getCurrentCoords, isExpectedLocationError } from "../../../lib/location";

export default function HomeScreen() {
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [locationText, setLocationText] = useState("Doha Qatar");

  useEffect(() => {
    async function getUserLocation() {
      try {
        const coords = await getCurrentCoords();
        if (!coords) return;

        const address = await reverseGeocode(
          coords.latitude,
          coords.longitude
        );
        if (address) {
          setLocationText(address);
        }
      } catch (error) {
        if (!isExpectedLocationError(error)) {
          console.warn("Could not retrieve current location: ", error);
        }
      }
    }

    getUserLocation();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <TouchableOpacity 
            style={styles.locationSelector}
            onPress={() => setIsLocationModalVisible(true)}
          >
            <Ionicons name="location" size={20} color={theme.COLORS.primary} />
            <Text style={styles.locationText} numberOfLines={1}>{locationText}</Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color={theme.COLORS.textSecondary}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons
            name="notifications-outline"
            size={24}
            color={theme.COLORS.textPrimary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Welcome Text */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Good Morning, Nuno!</Text>
          <Text style={styles.welcomeSubtitle}>
            What would you like to discover today?
          </Text>
        </View>

        {/* Components */}
        <ExploreNearbyBanner />
        <PlanForMeBanner />
        <QuickAccess />
        <TrendingNow />
        <FeaturedExperiences />
      </ScrollView>

      {/* Location Selection Modal Component */}
      <LocationDrawerModal
        visible={isLocationModalVisible}
        onClose={() => setIsLocationModalVisible(false)}
        onSelectLocation={setLocationText}
        currentLocation={locationText}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  locationContainer: {
    flex: 1,
  },
  locationSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
    gap: 4,
    borderWidth: 1,
    borderColor: theme.COLORS.border,
  },
  locationText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.COLORS.textPrimary,
  },
  notificationBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.COLORS.border,
  },
  notificationDot: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.COLORS.error,
    borderWidth: 1.5,
    borderColor: theme.COLORS.white,
  },
  welcomeSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: theme.COLORS.textSecondary,
  },
});


