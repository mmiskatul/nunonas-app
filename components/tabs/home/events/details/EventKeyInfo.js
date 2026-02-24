import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import theme from "../../../../../constants/theme";

const InfoItem = ({ icon, title, subtitle, IconComponent = Ionicons }) => (
  <View style={styles.itemContainer}>
    <View style={styles.iconBox}>
      <IconComponent name={icon} size={22} color={theme.COLORS.primary} />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.itemTitle}>{title}</Text>
      <Text style={styles.itemSubtitle}>{subtitle}</Text>
    </View>
  </View>
);

const EventKeyInfo = ({ event }) => {
  return (
    <View style={styles.container}>
      <InfoItem
        icon="calendar"
        title={event?.date || "Saturday, March 23"}
        subtitle={event?.time || "8:00 PM - 2:00 AM"}
      />

      <InfoItem
        icon="location-outline"
        title={event?.location || "Doha Convention Center"}
        subtitle="Downtown • 2.3 km away"
      />

      <InfoItem
        icon="account-group-outline"
        IconComponent={MaterialCommunityIcons}
        title="1,247 attending"
        subtitle="Join the crowd"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    gap: 20,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.COLORS.textPrimary,
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 14,
    color: theme.COLORS.textSecondary,
    fontWeight: "500",
  },
});

export default EventKeyInfo;
