import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import theme from "../../../constants/theme";
import { DiningIcon, EventsIcon, SpaIcon, HotelIcon } from "../../ui/SVGIcons";

const CATEGORIES = [
  {
    id: 1,
    name: "Dining",
    Icon: DiningIcon,
    color: "#fff7ed",
    route: "/home/dining",
  },
  {
    id: 2,
    name: "Events",
    Icon: EventsIcon,
    color: "#f5f3ff",
    route: "/home/events",
  },
  { id: 3, name: "Spa", Icon: SpaIcon, color: "#fff1f2", route: "/home/spa" },
  {
    id: 4,
    name: "Hotels",
    Icon: HotelIcon,
    color: "#f0f9ff",
    route: "/home/hotels",
  },
];

const QuickAccess = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Quick Access</Text>
      <View style={styles.list}>
        {CATEGORIES.map((cat) => {
          const IconComponent = cat.Icon;
          return (
            <TouchableOpacity
              key={cat.id}
              style={styles.item}
              activeOpacity={0.7}
              onPress={() => cat.route && router.push(cat.route)}
            >
              <View style={[styles.iconBox, { backgroundColor: cat.color }]}>
                <IconComponent width={24} height={24} />
              </View>
              <Text style={styles.name}>{cat.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
    marginBottom: 16,
  },
  list: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  item: {
    alignItems: "center",
    gap: 8,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.COLORS.textSecondary,
  },
});

export default QuickAccess;
