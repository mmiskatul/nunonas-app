import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import theme from "../../../../constants/theme";
import { listEvents } from "../../../../lib/customer-api";
import { getErrorMessage, normalizeMapEvent } from "../../../../lib/event-map-utils";
import type { CustomerMapEventPayload, CustomerMapEventsResponse, NormalizedMapEvent } from "../../../../lib/event-map-types";

import EventSearchBar from "../../../../components/tabs/home/events/EventSearchBar";
import EventFilterToggle from "../../../../components/tabs/home/events/EventFilterToggle";
import CategoryFilters from "../../../../components/tabs/home/events/CategoryFilters";
import EventCard from "../../../../components/tabs/home/events/EventCard";

export default function EventsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"List" | "Map">("List");
  const [activeCategory, setActiveCategory] = useState("All");
  const [events, setEvents] = useState<NormalizedMapEvent[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadEvents() {
      try {
        setLoading(true);
        setError("");
        const payload = await listEvents<CustomerMapEventsResponse>({
          limit: 50,
          search: searchQuery || undefined,
        });
        if (cancelled) {
          return;
        }
        const items = Array.isArray(payload?.items) ? payload.items : [];
        setEvents(items.map((item: CustomerMapEventPayload) => normalizeMapEvent(item)));
      } catch (error: unknown) {
        if (!cancelled) {
          setEvents([]);
          setError(getErrorMessage(error, "Could not load events."));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    const timeout = setTimeout(loadEvents, searchQuery ? 250 : 0);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [searchQuery]);

  const handleTabChange = (nextTab: "List" | "Map") => {
    if (nextTab === "Map") {
      router.push("/map");
      return;
    }
    setActiveTab(nextTab);
  };

  const categories = useMemo(() => {
    const dynamic = events
      .map((item) => String(item.eventType || item.tag || "").trim())
      .filter(Boolean);
    return ["All", ...Array.from(new Set(dynamic))];
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events
      .filter((item) => activeCategory === "All" || item.eventType === activeCategory || item.tag === activeCategory);
  }, [activeCategory, events]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <EventSearchBar value={searchQuery} onChangeText={setSearchQuery} />
        <EventFilterToggle
          eventCount={filteredEvents.length}
          activeTab={activeTab}
          onChangeTab={handleTabChange}
        />
        <CategoryFilters
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        <View style={styles.list}>
          {loading ? (
            <View style={styles.centerState}>
              <ActivityIndicator color={theme.COLORS.primary} />
            </View>
          ) : error ? (
            <View style={styles.centerState}>
              <Text style={styles.messageText}>{error}</Text>
            </View>
          ) : filteredEvents.length ? (
            filteredEvents.map((event) => <EventCard key={event.id} event={event} />)
          ) : (
            <View style={styles.centerState}>
              <Text style={styles.messageText}>No events matched your search.</Text>
            </View>
          )}
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
    paddingTop: 5,
    paddingBottom: 20,
  },
  centerState: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  messageText: {
    color: theme.COLORS.textSecondary,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});


