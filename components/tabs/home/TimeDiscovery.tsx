import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import theme from "../../../constants/theme";

const OPTIONS = [
  { key: "open", title: "Open now", subtitle: "Available nearby", icon: "time-outline", route: "/search" },
  { key: "tonight", title: "Tonight", subtitle: "Plans for later", icon: "moon-outline", route: "/home/events" },
  { key: "weekend", title: "This weekend", subtitle: "Make a plan", icon: "calendar-outline", route: "/home/events" },
  { key: "happy", title: "Happy Hours", subtitle: "Deals nearby", icon: "pricetag-outline", route: "/map" },
];

export default function TimeDiscovery() {
  const router = useRouter();
  return <View style={styles.container}>
    <View style={styles.header}><Text style={styles.title}>Find something for now</Text><Text style={styles.subtitle}>Quick ways to discover nearby</Text></View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {OPTIONS.map((option) => <TouchableOpacity key={option.key} style={styles.card} onPress={() => router.push(option.route as any)} activeOpacity={0.85}>
        <View style={styles.icon}><Ionicons name={option.icon as any} size={20} color={theme.COLORS.primary} /></View>
        <Text style={styles.cardTitle}>{option.title}</Text><Text style={styles.cardSubtitle}>{option.subtitle}</Text>
      </TouchableOpacity>)}
    </ScrollView>
  </View>;
}

const styles = StyleSheet.create({
  container: { marginTop: 26 }, header: { paddingHorizontal: 20, marginBottom: 12 }, title: { color: theme.COLORS.textPrimary, fontSize: 20, fontWeight: "800" }, subtitle: { color: theme.COLORS.textSecondary, marginTop: 4, fontSize: 13 }, row: { paddingHorizontal: 20, gap: 10 }, card: { width: 142, minHeight: 112, padding: 14, borderRadius: 18, borderWidth: 1, borderColor: theme.COLORS.border, backgroundColor: theme.COLORS.white }, icon: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#eef2ff", marginBottom: 10 }, cardTitle: { color: theme.COLORS.textPrimary, fontSize: 14, fontWeight: "800" }, cardSubtitle: { color: theme.COLORS.textSecondary, fontSize: 11, marginTop: 4 },
});
