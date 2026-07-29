import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import theme from "../../../constants/theme";
import type { GeoCoordinates } from "../../../lib/event-map-types";
import type { ProviderPayload } from "../../../lib/provider-types";
import { getCurrentCoords, isExpectedLocationError } from "../../../lib/location";
import GoogleWebMap from "../../ui/GoogleWebMap";

export type CategoryMapKind = "spa" | "hotel";
type Props = { items: ProviderPayload[]; loading: boolean; kind: CategoryMapKind };

function number(value: unknown): number | null {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export default function CategoryMapWeb({ items, loading, kind }: Props) {
  const router = useRouter();
  const [location, setLocation] = useState<GeoCoordinates | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const mapped = useMemo(() => items.map((item) => ({
    id: String(item.id ?? item._id ?? ""),
    title: String(item.title ?? item.name ?? (kind === "spa" ? "Spa" : "Hotel")),
    latitude: number(item.latitude), longitude: number(item.longitude),
    location: String(item.location ?? item.address ?? item.city ?? "Location unavailable"),
  })).filter((item) => item.id && item.latitude != null && item.longitude != null), [items, kind]);
  const selected = mapped.find((item) => item.id === selectedId) ?? null;
  const loadLocation = useCallback(async () => {
    try {
      const coords = await getCurrentCoords();
      if (!coords) { setError("Turn on location access to see nearby places."); return; }
      setLocation({ latitude: coords.latitude, longitude: coords.longitude });
    } catch (value: unknown) {
      setError("Your current location could not be loaded.");
      if (!isExpectedLocationError(value)) console.error("Category map location failed:", value);
    }
  }, []);
  useEffect(() => { void loadLocation(); }, [loadLocation]);
  if (!location) return <View style={styles.state}>{error ? <><Ionicons name="location-outline" size={38} color={theme.COLORS.primary} /><Text style={styles.title}>Location needed</Text><Text style={styles.text}>{error}</Text><TouchableOpacity onPress={() => void loadLocation()}><Text style={styles.retry}>Try again</Text></TouchableOpacity></> : <><ActivityIndicator size="large" color={theme.COLORS.primary} /><Text style={styles.text}>Finding your current location…</Text></>}</View>;
  return <View style={styles.container}>
    <GoogleWebMap center={selected ? { latitude: selected.latitude!, longitude: selected.longitude! } : location} markers={mapped.map((item) => ({ id: item.id, title: item.title, latitude: item.latitude!, longitude: item.longitude!, kind }))} selectedId={selectedId} onMarkerPress={(marker) => setSelectedId(marker.id)} height={560} zoomLevel={selected ? 15 : 13} showCenterMarker={!selected} />
    {loading ? <View style={styles.badge}><ActivityIndicator size="small" color={theme.COLORS.primary} /><Text style={styles.badgeText}>Updating {kind}s</Text></View> : !mapped.length ? <View style={styles.emptyBadge}><Text style={styles.emptyText}>No {kind}s with map locations found.</Text></View> : null}
    {selected ? <View style={styles.preview}><Text style={styles.previewTitle}>{selected.title}</Text><Text style={styles.text}>{selected.location}</Text><TouchableOpacity style={styles.button} onPress={() => router.push(`/home/${kind === "spa" ? "spa" : "hotels"}/${selected.id}`)}><Text style={styles.buttonText}>View {kind}</Text></TouchableOpacity></View> : null}
  </View>;
}

const styles = StyleSheet.create({ container: { flex: 1, minHeight: 560 }, state: { flex: 1, minHeight: 420, alignItems: "center", justifyContent: "center", padding: 24, gap: 8 }, title: { color: theme.COLORS.textPrimary, fontWeight: "700" }, text: { color: theme.COLORS.textSecondary, textAlign: "center" }, retry: { color: theme.COLORS.primary, fontWeight: "700", marginTop: 8 }, badge: { position: "absolute", top: 14, alignSelf: "center", flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 9, backgroundColor: "rgba(255,255,255,0.97)", ...theme.SHADOWS.card }, badgeText: { color: theme.COLORS.textSecondary, fontSize: 12, fontWeight: "700" }, emptyBadge: { position: "absolute", top: 14, left: 20, right: 20, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "rgba(255,255,255,0.97)", ...theme.SHADOWS.card }, emptyText: { color: theme.COLORS.textSecondary, fontSize: 13, fontWeight: "700", textAlign: "center" }, preview: { position: "absolute", left: 16, right: 16, bottom: 16, padding: 16, borderRadius: 16, backgroundColor: "#ffffff", shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 12 }, previewTitle: { color: theme.COLORS.textPrimary, fontSize: 16, fontWeight: "800" }, button: { marginTop: 10, padding: 10, borderRadius: 10, backgroundColor: theme.COLORS.primary, alignItems: "center" }, buttonText: { color: "#fff", fontWeight: "700" }, });
