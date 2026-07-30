import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { buildStaticMapUrl } from "../../../../../lib/google-maps";
import type { GeoCoordinates } from "../../../../../lib/event-map-types";

type Props = { center: GeoCoordinates | null };

export default function HotelOverviewMap({ center }: Props) {
  const mapUrl = buildStaticMapUrl({ center, markerLabel: "H" });
  if (!mapUrl) return null;
  return <View style={styles.container}><Image source={{ uri: mapUrl }} style={styles.image} /></View>;
}

const styles = StyleSheet.create({
  container: { height: 180, borderRadius: 16, overflow: "hidden", marginBottom: 12 },
  image: { width: "100%", height: "100%", resizeMode: "cover" },
});
