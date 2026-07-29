import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import theme from "../../../../constants/theme";
import { listEvents } from "../../../../lib/customer-api";
import { normalizeMapEvent } from "../../../../lib/event-map-utils";
import type { CustomerMapEventPayload, CustomerMapEventsResponse, GeoCoordinates, NormalizedMapEvent } from "../../../../lib/event-map-types";
import { getCurrentCoords, isExpectedLocationError } from "../../../../lib/location";
import GoogleWebMap from "../../../ui/GoogleWebMap";
import type { MapFilterKey } from "../../../ui/MapFilterChips";
import { attachEventDistances, filterMapEvents } from "../../../../lib/map-filtering";

type Props = { events?: NormalizedMapEvent[]; loading?: boolean; activeFilters?: MapFilterKey[] };

export default function EventMapWeb({ events: suppliedEvents, loading: suppliedLoading, activeFilters = ["near-me"] }: Props = {}) {
  const router = useRouter();
  const [fetchedEvents, setFetchedEvents] = useState<NormalizedMapEvent[]>([]);
  const [location, setLocation] = useState<GeoCoordinates | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const events = suppliedEvents ?? fetchedEvents;
  const displayLoading = suppliedLoading ?? loading;
  const [error, setError] = useState("");
  const filteredEvents = useMemo(() => filterMapEvents(attachEventDistances(events, location), activeFilters), [activeFilters, events, location]);
  const selected = filteredEvents.find((event) => String(event.id) === selectedId) ?? null;
  const mappedEvents = useMemo(() => filteredEvents.flatMap((event) => {
    const latitude = event.latitude ?? location?.latitude;
    const longitude = event.longitude ?? location?.longitude;
    return latitude != null && longitude != null ? [{ event, latitude, longitude }] : [];
  }), [filteredEvents, location]);
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const [payload, coords] = await Promise.all([
        listEvents<CustomerMapEventsResponse>({ limit: 100 }),
        getCurrentCoords(),
      ]);
      const items = Array.isArray(payload?.items) ? payload.items : [];
      setFetchedEvents(items.map((item: CustomerMapEventPayload) => normalizeMapEvent(item)).filter((event) => event.entityType === "event"));
      if (coords) setLocation({ latitude: coords.latitude, longitude: coords.longitude });
      else setError("Turn on location access to see event locations.");
    } catch (value: unknown) {
      setError(value instanceof Error ? value.message : "Events could not be loaded.");
      if (!isExpectedLocationError(value)) console.error("Event map failed:", value);
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  if (!location) return <View style={styles.state}>{displayLoading ? <><ActivityIndicator size="large" color={theme.COLORS.primary} /><Text style={styles.text}>Finding your current location…</Text></> : <><Ionicons name="location-outline" size={38} color={theme.COLORS.primary} /><Text style={styles.title}>Event map unavailable</Text><Text style={styles.text}>{error}</Text><TouchableOpacity onPress={() => void load()}><Text style={styles.retry}>Try again</Text></TouchableOpacity></>}</View>;
  return <View style={styles.container}><GoogleWebMap center={selected?.latitude != null && selected.longitude != null ? { latitude: selected.latitude, longitude: selected.longitude } : location} markers={mappedEvents.map(({ event, latitude, longitude }) => ({ id: String(event.id), title: event.title, latitude, longitude, kind: "event" }))} selectedId={selectedId} onMarkerPress={(marker) => setSelectedId(marker.id)} height={560} zoomLevel={selected ? 15 : 13} showCenterMarker={!selected} />{displayLoading ? <View style={styles.badge}><ActivityIndicator size="small" color={theme.COLORS.primary} /><Text style={styles.badgeText}>Updating events</Text></View> : !mappedEvents.length ? <View style={styles.emptyBadge}><Text style={styles.emptyText}>No events found.</Text></View> : null}{selected ? <View style={styles.preview}><Text style={styles.previewTitle}>{selected.title}</Text><Text style={styles.text}>{selected.location}</Text><TouchableOpacity style={styles.button} onPress={() => router.push(`/home/events/${selected.id}`)}><Text style={styles.buttonText}>View event</Text></TouchableOpacity></View> : null}</View>;
}
const styles = StyleSheet.create({ container: { flex: 1, minHeight: 560 }, state: { flex: 1, minHeight: 560, alignItems: "center", justifyContent: "center", padding: 24, gap: 8 }, title: { color: theme.COLORS.textPrimary, fontWeight: "700" }, text: { color: theme.COLORS.textSecondary, textAlign: "center" }, retry: { color: theme.COLORS.primary, fontWeight: "700", marginTop: 8 }, badge: { position: "absolute", top: 14, alignSelf: "center", flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 9, backgroundColor: "rgba(255,255,255,0.97)", ...theme.SHADOWS.card }, badgeText: { color: theme.COLORS.textSecondary, fontSize: 12, fontWeight: "700" }, emptyBadge: { position: "absolute", top: 14, left: 20, right: 20, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "rgba(255,255,255,0.97)", ...theme.SHADOWS.card }, emptyText: { color: theme.COLORS.textSecondary, fontSize: 13, fontWeight: "700", textAlign: "center" }, preview: { position: "absolute", left: 16, right: 16, bottom: 16, padding: 16, borderRadius: 16, backgroundColor: "#fff", shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 12 }, previewTitle: { color: theme.COLORS.textPrimary, fontSize: 16, fontWeight: "800" }, button: { marginTop: 10, padding: 10, borderRadius: 10, backgroundColor: theme.COLORS.primary, alignItems: "center" }, buttonText: { color: "#fff", fontWeight: "700" }, });
