// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import theme from "../../constants/theme";
import { reverseGeocode } from "../../lib/google-maps";
import { getCurrentCoords, isExpectedLocationError } from "../../lib/location";
import { clearRecentSearches, listCategories, listRecentSearches } from "../../lib/customer-api";

// Import Components
import CategoryCard from "../../components/tabs/search/CategoryCard";
import RecentSearchItem from "../../components/tabs/search/RecentSearchItem";

const CATEGORIES = [
  {
    id: "restaurants",
    title: "Restaurants",
    count: "Loading...",
    iconName: "restaurant",
    iconColor: "#ef4444",
    iconBgColor: "#fef2f2",
  },
  {
    id: "events",
    title: "Events",
    count: "Loading...",
    iconName: "calendar",
    iconColor: "#a855f7",
    iconBgColor: "#f5f3ff",
  },
  {
    id: "spas",
    title: "Spas",
    count: "Loading...",
    iconName: "leaf",
    iconColor: "#ec4899",
    iconBgColor: "#fdf2f7",
  },
  {
    id: "hotels",
    title: "Hotels",
    count: "Loading...",
    iconName: "bed",
    iconColor: "#3b82f6",
    iconBgColor: "#eff6ff",
  },
];

const INITIAL_RECENT_SEARCHES = [];

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState(INITIAL_RECENT_SEARCHES);
  const [currentLocation, setCurrentLocation] = useState("Downtown, San Francisco");

  useEffect(() => {
    Promise.all([listRecentSearches(), listCategories()])
      .then(([recent, categories]) => {
        const recentItems = recent?.items ?? recent?.data ?? recent ?? [];
        setRecentSearches(Array.isArray(recentItems) ? recentItems.map((item) => item.query ?? item.text ?? item).filter(Boolean) : []);
        const categoryItems = categories?.items ?? categories?.data ?? [];
        if (Array.isArray(categoryItems) && categoryItems.length) {
          categoryItems.forEach((item) => {
            const match = CATEGORIES.find((category) => category.id.replace(/s$/, "") === String(item.key ?? "").toLowerCase());
            if (match) match.count = `${item.count ?? 0} places`;
          });
        }
      })
      .catch(() => { setRecentSearches([]); });
  }, []);

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
          setCurrentLocation(address);
        }
      } catch (error) {
        if (!isExpectedLocationError(error)) {
          console.warn("Could not retrieve current location in search: ", error);
        }
      }
    }

    getUserLocation();
  }, []);

  const handleRemoveSearch = (index) => {
    const newSearches = [...recentSearches];
    newSearches.splice(index, 1);
    setRecentSearches(newSearches);
  };

  const handleClearAll = () => {
    void clearRecentSearches().finally(() => setRecentSearches([]));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchHeader}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={theme.COLORS.textSecondary}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search restaurants, events, spas, hotels..."
            placeholderTextColor={theme.COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Current Location Card */}
        <TouchableOpacity 
          style={styles.locationCard} 
          activeOpacity={0.8}
          onPress={() => router.push("/map")}
        >
          <View style={styles.locationInfo}>
            <View style={styles.locationRow}>
              <Ionicons
                name="location"
                size={20}
                color={theme.COLORS.secondary}
              />
              <Text style={styles.locationLabel}>Current Location</Text>
            </View>
            <Text style={styles.locationText} numberOfLines={1}>{currentLocation}</Text>
          </View>
          <View style={styles.arrowContainer}>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.COLORS.white}
            />
          </View>
        </TouchableOpacity>

        {/* Browse by Category */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Browse by Category</Text>
        </View>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.id}
              title={category.title}
              count={category.count}
              iconName={category.iconName}
              iconColor={category.iconColor}
              iconBgColor={category.iconBgColor}
            />
          ))}
        </View>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <View style={styles.recentSection}>
            <View style={styles.recentHeader}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              <TouchableOpacity onPress={handleClearAll}>
                <Text style={styles.clearText}>Clear All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.recentList}>
              {recentSearches.map((query, index) => (
                <RecentSearchItem
                  key={index}
                  title={query}
                  onRemove={() => handleRemoveSearch(index)}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  searchHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.COLORS.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: theme.COLORS.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.COLORS.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  locationCard: {
    backgroundColor: theme.COLORS.primary,
    borderRadius: 20,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
    ...theme.SHADOWS.primary,
  },
  locationInfo: {
    flex: 1,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  locationLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  locationText: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.COLORS.white,
  },
  arrowContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.COLORS.textPrimary,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  recentSection: {
    marginTop: 8,
  },
  recentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  clearText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.COLORS.textLink,
  },
  recentList: {
    marginTop: 8,
  },
});


