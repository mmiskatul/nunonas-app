import { Ionicons } from "@expo/vector-icons";
import React, { type ComponentProps } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import theme from "../../../constants/theme";

type CategoryCardProps = {
  title: string;
  count: string;
  iconName: ComponentProps<typeof Ionicons>["name"];
  iconColor: string;
  iconBgColor: string;
  onPress?: () => void;
};

export default function CategoryCard({
  title,
  count,
  iconName,
  iconColor,
  iconBgColor,
  onPress,
}: CategoryCardProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${count}`}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
        <Ionicons name={iconName} size={24} color={iconColor} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.count}>{count}</Text>
    </TouchableOpacity>
  );
}

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
