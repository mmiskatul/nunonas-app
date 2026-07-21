// @ts-nocheck
import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../../../../constants/theme";

// Import Dining Components
import DiningSearch from "../../../../components/tabs/home/dining/DiningSearch";
import DiningViewToggle from "../../../../components/tabs/home/dining/DiningViewToggle";
import DiningFilters from "../../../../components/tabs/home/dining/DiningFilters";
import RestaurantCard from "../../../../components/tabs/home/dining/RestaurantCard";

import { listRestaurants } from "../../../../lib/customer-api";

export default function DiningScreen() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ open_now: null, top_rated: null, offers: null });

  const fetchRestaurants = useCallback(async (options = {}) => {
    try {
      const params = {
        limit: 30,
        skip: 0,
        nearby: true,
        ...(searchQuery ? { search: searchQuery } : {}),
        ...(filters.open_now != null ? { open_now: filters.open_now } : {}),
        ...(filters.top_rated != null ? { top_rated: filters.top_rated } : {}),
        ...(filters.offers != null ? { offers: filters.offers } : {}),
        ...options,
      };
      const data = await listRestaurants(params);
      const list = data?.items ?? data ?? [];
      setRestaurants(list);
    } catch (err) {
      console.warn("Failed to load restaurants:", err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery, filters]);

  useEffect(() => {
    setLoading(true);
    fetchRestaurants();
  }, [fetchRestaurants]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRestaurants();
  };

  const handleSearch = (q) => {
    setSearchQuery(q);
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <DiningSearch onSearch={handleSearch} />
        <DiningViewToggle />
        <DiningFilters onFilterChange={handleFilterChange} />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.COLORS.primary} />
          </View>
        ) : restaurants.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No restaurants found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id ?? restaurant._id}
                restaurant={restaurant}
              />
            ))}
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
  list: {
    marginTop: 5,
    paddingBottom: 20,
  },
  loadingContainer: {
    paddingTop: 60,
    alignItems: "center",
  },
  emptyContainer: {
    paddingTop: 60,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.COLORS.textPrimary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.COLORS.textSecondary,
  },
});


