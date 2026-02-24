import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../../../../../constants/theme";

const AVATARS = [
  "https://i.pravatar.cc/100?u=1",
  "https://i.pravatar.cc/100?u=2",
  "https://i.pravatar.cc/100?u=3",
];

const EventFooter = () => {
  return (
    <View style={styles.container}>
      <View style={styles.attendeesContainer}>
        <View style={styles.avatarStack}>
          {AVATARS.map((uri, index) => (
            <Image
              key={index}
              source={{ uri }}
              style={[styles.avatar, { marginLeft: index === 0 ? 0 : -10 }]}
            />
          ))}
        </View>
        <Text style={styles.attendeeText}>+1,244 others attending</Text>
      </View>

      <View style={styles.ratingBox}>
        <Ionicons name="star" size={18} color="#f59e0b" />
        <Text style={styles.ratingText}>4.8</Text>
        <Text style={styles.reviewCount}>(324)</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    backgroundColor: theme.COLORS.white,
  },
  attendeesContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatarStack: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: theme.COLORS.white,
  },
  attendeeText: {
    fontSize: 13,
    color: theme.COLORS.textSecondary,
    fontWeight: "500",
  },
  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.COLORS.textPrimary,
  },
  reviewCount: {
    fontSize: 13,
    color: theme.COLORS.textSecondary,
  },
});

export default EventFooter;
