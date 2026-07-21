// @ts-nocheck
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../../../../constants/theme";

// Import Spa Components
import SpaSearch from "../../../../components/tabs/home/spa/SpaSearch";
import SpaViewToggle from "../../../../components/tabs/home/spa/SpaViewToggle";
import SpaFilters from "../../../../components/tabs/home/spa/SpaFilters";
import SpaCard from "../../../../components/tabs/home/spa/SpaCard";
import { listSpas } from "../../../../lib/customer-api";
import { normalizeSpa, getErrorMessage } from "../../../../lib/provider-utils";

export default function SpaScreen() {
  const [spas, setSpas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSpas = useCallback(async () => {
    try {
      const payload = await listSpas({ limit: 50, nearby: true });
      const items = payload?.items ?? payload?.data ?? payload ?? [];
      setSpas(Array.isArray(items) ? items.map((item) => {
        const spa = normalizeSpa(item);
        return {
          ...item,
          id: spa.id,
          title: spa.title,
          rating: spa.ratingText,
          reviews: spa.reviewsText,
          cuisine: spa.category,
          type: spa.typeText,
          distance: spa.distanceText,
          location: spa.locationText,
          image: spa.imageUrl ? { uri: spa.imageUrl } : undefined,
        };
      }) : []);
    } catch (loadError) {
      setError(getErrorMessage(loadError, "Could not load spas."));
      setSpas([]);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void loadSpas(); }, [loadSpas]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SpaSearch />
        <SpaViewToggle count={spas.length} />
        <SpaFilters />

        <View style={styles.list}>
          {loading ? <ActivityIndicator size="large" color={theme.COLORS.primary} /> : null}
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {!loading && !error && spas.length === 0 ? <Text style={styles.error}>No spas available.</Text> : null}
          {spas.map((spa) => (
            <SpaCard key={spa.id} spa={spa} />
          ))}
        </View>
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
  error: {
    textAlign: "center",
    color: theme.COLORS.textSecondary,
    padding: 24,
  },
});


