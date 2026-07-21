// @ts-nocheck
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../../../../constants/theme";

// Import Hotel Components
import HotelSearch from "../../../../components/tabs/home/hotels/HotelSearch";
import HotelViewToggle from "../../../../components/tabs/home/hotels/HotelViewToggle";
import HotelFilters from "../../../../components/tabs/home/hotels/HotelFilters";
import HotelCard from "../../../../components/tabs/home/hotels/HotelCard";
import { listHotels } from "../../../../lib/customer-api";

const HotelScreen = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchHotels() {
      try {
        setError("");
        const res = await listHotels({ nearby: true });
        setHotels(res.items || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load hotels right now.");
        console.error("Failed to fetch hotels from API:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHotels();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HotelSearch />
        <View style={styles.headerRow}>
          <HotelViewToggle />
          <Text style={styles.resultsCount}>{loading ? "..." : `${hotels.length} Hotels`}</Text>
        </View>
        <HotelFilters />

        {loading ? (
          <ActivityIndicator size="large" color="#1e3a8a" style={{ marginTop: 40 }} />
        ) : error ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Hotels could not be loaded</Text>
            <Text style={styles.emptyText}>Please try again in a moment.</Text>
          </View>
        ) : hotels.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No hotels available</Text>
            <Text style={styles.emptyText}>Approved hotels with available rooms will appear here.</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {hotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  resultsCount: {
    fontSize: 14,
    color: theme.COLORS.textSecondary,
    fontWeight: "500",
  },
  list: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  emptyState: {
    marginHorizontal: 20,
    marginTop: 40,
    padding: 24,
    borderRadius: 20,
    backgroundColor: theme.COLORS.surface,
    alignItems: "center",
  },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: theme.COLORS.textPrimary },
  emptyText: { marginTop: 6, textAlign: "center", color: theme.COLORS.textSecondary },
});

export default HotelScreen;


