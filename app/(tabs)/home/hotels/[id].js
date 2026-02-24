import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  Text,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import theme from "../../../../constants/theme";

// Import Details Components
import HotelImageHeader from "../../../../components/tabs/home/hotels/details/HotelImageHeader";
import HotelDetailsInfo from "../../../../components/tabs/home/hotels/details/HotelDetailsInfo";
import HotelDetailsTabs from "../../../../components/tabs/home/hotels/details/HotelDetailsTabs";
import HotelOverviewContent from "../../../../components/tabs/home/hotels/details/HotelOverviewContent";
import HotelRoomsContent from "../../../../components/tabs/home/hotels/details/HotelRoomsContent";
import HotelGalleryContent from "../../../../components/tabs/home/hotels/details/HotelGalleryContent";
import HotelReviewsContent from "../../../../components/tabs/home/hotels/details/HotelReviewsContent";

const HOTELS_DATA = {
  1: {
    id: 1,
    title: "Grand Plaza Hotel",
    rating: "4.8",
    reviews: "1,247",
    price: "189",
    image: require("../../../../assets/images/hotel/hotel.jpg"),
  },
};

const HotelDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState("Overview");

  const hotel = HOTELS_DATA[id] || HOTELS_DATA["1"];

  const renderTabContent = () => {
    switch (activeTab) {
      case "Overview":
        return <HotelOverviewContent />;
      case "Rooms":
        return <HotelRoomsContent />;
      case "Gallery":
        return <HotelGalleryContent />;
      case "Reviews":
        return <HotelReviewsContent />;
      default:
        return <HotelOverviewContent />;
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
        <HotelImageHeader image={hotel.image} />
        <HotelDetailsInfo hotel={hotel} />
        <HotelDetailsTabs activeTab={activeTab} onTabPress={setActiveTab} />
        {renderTabContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  scrollContent: {
    paddingBottom: 100, // Space for fixed actions
  },
});

export default HotelDetailsScreen;
