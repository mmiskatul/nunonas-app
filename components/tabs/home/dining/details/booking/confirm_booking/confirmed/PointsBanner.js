import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../../../../../../../../constants/theme";

const PointsBanner = ({ points }) => {
  return (
    <View style={styles.banner}>
      <View style={styles.iconCircle}>
        <Ionicons name="gift" size={20} color={theme.COLORS.primary} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>You earned +{points} points 🎁</Text>
        <Text style={styles.subtitle}>Thanks for being a loyal customer!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#60a5fa",
    borderRadius: 16,
    padding: 16,
    marginBottom: 25,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.COLORS.white,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.9)",
  },
});

export default PointsBanner;
