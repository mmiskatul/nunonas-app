import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Text,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import theme from "../../../../constants/theme";

// Import Details Components
import ImageHeader from "../../../../components/tabs/home/dining/details/ImageHeader";
import DetailsInfo from "../../../../components/tabs/home/dining/details/DetailsInfo";
import DetailsActions from "../../../../components/tabs/home/dining/details/DetailsActions";
import DetailsTabs from "../../../../components/tabs/home/dining/details/DetailsTabs";
import OverviewContent from "../../../../components/tabs/home/dining/details/OverviewContent";
import MenuContent from "../../../../components/tabs/home/dining/details/MenuContent";
import GalleryContent from "../../../../components/tabs/home/dining/details/GalleryContent";
import ReviewsContent from "../../../../components/tabs/home/reviews/ReviewsContent";

import {
  getRestaurant,
  getRestaurantMenu,
  getRestaurantGallery,
  getRestaurantOffers,
} from "../../../../lib/customer-api";

export default function RestaurantDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState("Overview");

  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      // Fetch all in parallel
      const [detail, menu, gallery, offerData] = await Promise.allSettled([
        getRestaurant(id),
        getRestaurantMenu(id),
        getRestaurantGallery(id),
        getRestaurantOffers(id),
      ]);

      if (detail.status === "fulfilled") setRestaurant(detail.value);
      else setError("Restaurant not found.");

      if (menu.status === "fulfilled") setMenuItems(menu.value?.items ?? []);
      if (gallery.status === "fulfilled") setGalleryItems(gallery.value?.items ?? []);
      if (offerData.status === "fulfilled") setOffers(offerData.value?.items ?? []);
    } catch (err) {
      setError(err.message ?? "Failed to load restaurant.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.COLORS.primary} />
      </View>
    );
  }

  if (error || !restaurant) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error ?? "Restaurant not found."}</Text>
      </View>
    );
  }

  const coverImage = restaurant.cover_image_url
    ? { uri: restaurant.cover_image_url }
    : require("../../../../assets/images/discover-experience.png");

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[3]}>
        <ImageHeader image={coverImage} />
        <DetailsInfo restaurant={restaurant} offers={offers} />
        <DetailsActions restaurantId={id} />
        <DetailsTabs activeTab={activeTab} onTabPress={setActiveTab} />

        {/* Tab Content */}
        <View style={styles.content}>
          {activeTab === "Overview" && <OverviewContent restaurant={restaurant} />}
          {activeTab === "Menu" && <MenuContent items={menuItems} />}
          {activeTab === "Gallery" && <GalleryContent items={galleryItems} />}
          {activeTab === "Reviews" && <ReviewsContent restaurantId={id} />}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.COLORS.white,
  },
  errorText: {
    fontSize: 16,
    color: theme.COLORS.error,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  content: {
    backgroundColor: theme.COLORS.white,
    paddingBottom: 40,
  },
});
