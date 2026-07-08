import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  Text,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import theme from "../../../../constants/theme";
import { getFirstQueryParam } from "../../../../lib/event-map-utils";
import { getErrorMessage, normalizeHotel } from "../../../../lib/provider-utils";
import type { NormalizedHotel, ProviderPayload } from "../../../../lib/provider-types";

// Import Details Components
import HotelImageHeader from "../../../../components/tabs/home/hotels/details/HotelImageHeader";
import HotelDetailsInfo from "../../../../components/tabs/home/hotels/details/HotelDetailsInfo";
import HotelDetailsTabs from "../../../../components/tabs/home/hotels/details/HotelDetailsTabs";
import HotelOverviewContent from "../../../../components/tabs/home/hotels/details/HotelOverviewContent";
import HotelRoomsContent from "../../../../components/tabs/home/hotels/details/HotelRoomsContent";
import HotelGalleryContent from "../../../../components/tabs/home/hotels/details/HotelGalleryContent";
import HotelReviewsContent from "../../../../components/tabs/home/hotels/details/HotelReviewsContent";
import { getHotel } from "../../../../lib/customer-api";

export default function HotelDetailsScreen() {
  const { id } = useLocalSearchParams();
  const hotelId = getFirstQueryParam(id);
  const [activeTab, setActiveTab] = useState("Overview");
  const [hotel, setHotel] = useState<NormalizedHotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchHotel() {
      if (!hotelId) {
        setError("Hotel not found.");
        setLoading(false);
        return;
      }

      try {
        const data = await getHotel<ProviderPayload>(hotelId);
        setHotel(normalizeHotel(data));
      } catch (error: unknown) {
        console.error("Failed to fetch hotel details:", error);
        setError(getErrorMessage(error, "Failed to load hotel details."));
      } finally {
        setLoading(false);
      }
    }
    fetchHotel();
  }, [hotelId]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#1e3a8a" />
      </View>
    );
  }

  if (error || !hotel) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ fontWeight: "700", color: "#64748b" }}>{error || "Hotel not found."}</Text>
      </View>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "Overview":
        return <HotelOverviewContent hotel={hotel} />;
      case "Rooms":
        return <HotelRoomsContent hotelId={hotel.id} />;
      case "Gallery":
        return <HotelGalleryContent hotelId={hotel.id} />;
      case "Reviews":
        return <HotelReviewsContent hotelId={hotel.id} />;
      default:
        return <HotelOverviewContent hotel={hotel} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[2]}
        contentContainerStyle={styles.scrollContent}
      >
        <HotelImageHeader image={hotel.imageUrl} />
        <HotelDetailsInfo hotel={hotel} />
        <HotelDetailsTabs activeTab={activeTab} onTabPress={setActiveTab} />
        {renderTabContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  scrollContent: {
    paddingBottom: 100, // Space for fixed actions
  },
});


