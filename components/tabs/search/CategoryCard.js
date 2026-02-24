import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../../../constants/theme";

const CategoryCard = ({ title, count, iconName, iconColor, iconBgColor }) => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7}>
      <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
        <Ionicons name={iconName} size={24} color={iconColor} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.count}>{count}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 20,
    padding: 24,
    width: "48%",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.COLORS.border,
    ...theme.SHADOWS.card,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.COLORS.textPrimary,
    marginBottom: 4,
  },
  count: {
    fontSize: 14,
    color: theme.COLORS.textSecondary,
  },
});

export default CategoryCard;
