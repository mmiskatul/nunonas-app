import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import theme from "../../constants/theme";

const Button = ({ title, onPress, style, textStyle, icon }) => {
  return (
    <TouchableOpacity
      style={[styles.button, theme.SHADOWS.primary, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
      {icon && icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.COLORS.primary,
    flexDirection: "row",
    height: 60,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: theme.COLORS.white,
    fontSize: theme.TYPOGRAPHY.button.fontSize,
    fontWeight: theme.TYPOGRAPHY.button.fontWeight,
  },
});

export default Button;
