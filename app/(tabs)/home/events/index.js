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

import EventSearchBar from "../../../../components/tabs/home/events/EventSearchBar";
import EventFilterToggle from "../../../../components/tabs/home/events/EventFilterToggle";
import CategoryFilters from "../../../../components/tabs/home/events/CategoryFilters";
import EventCard from "../../../../components/tabs/home/events/EventCard";

function formatEventDate(value) {
  if (!value) return "Date TBA";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatEventTime(startTime, endTime) {
  if (!startTime) return "Time TBA";
  const start = startTime.slice(0, 5);
  const end = endTime ? endTime.slice(0, 5) : "";
  return end ? `${start} - ${end}` : start;
}

function getDistanceText(distanceKm) {
  if (typeof distanceKm !== "number") return "Nearby";
  return `${distanceKm.toFixed(1)} km`;
}

function normalizeEventCard(item = {}) {
  return {
    id: item.id,
    title: item.title ?? "Untitled Event",
    date: formatEventDate(item.event_date),
    time: formatEventTime(item.start_time, item.end_time),
    location: item.location ?? item.venue ?? "Venue available",
    distance: getDistanceText(
      typeof item.distance_km === "number" ? item.distance_km : Number(item.distance_km)
    ),
    tag: item.offer_text ?? item.event_type ?? "",
    tagColor: item.offer_text ? "#ef4444" : "#2563eb",
    imageUrl: item.banner_image_url ?? item.cover_image_url ?? "",
    category: item.category ?? "Event",
  };
}

export default function EventsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("List");
  const [activeCategory, setActiveCategory] = useState("All");
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadEvents() {
      try {
        setLoading(true);
        setError("");
        const payload = await listEvents({ limit: 50, search: searchQuery || undefined });
        if (cancelled) {
          return;
        }
        setEvents(Array.isArray(payload?.items) ? payload.items : []);
      } catch (err) {
        if (!cancelled) {
          setEvents([]);
          setError(err?.message || "Could not load events.");
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

  const handleTabChange = (nextTab) => {
    if (nextTab === "Map") {
      router.push("/map");
      return;
    }
    setActiveTab(nextTab);
  };

  const categories = useMemo(() => {
    const dynamic = events
      .map((item) => String(item.category || "").trim())
      .filter(Boolean);
    return ["All", ...Array.from(new Set(dynamic))];
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events
      .filter((item) => activeCategory === "All" || item.category === activeCategory)
      .map(normalizeEventCard);
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
