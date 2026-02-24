import React from "react";
import { View, Text, StyleSheet } from "react-native";
import theme from "../../../../../../../constants/theme";

const ConfirmNotes = ({ notes }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Special Notes</Text>
      <View style={styles.notesBox}>
        <Text style={[
          styles.notesText,
          !notes && styles.placeholderText
        ]}>
          {notes || "Any seating or timing preference?"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.COLORS.textPrimary,
    marginBottom: 20,
  },
  notesBox: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.COLORS.border,
    minHeight: 120,
  },
  notesText: {
    fontSize: 16,
    color: theme.COLORS.textPrimary,
    lineHeight: 24,
  },
  placeholderText: {
    color: theme.COLORS.textSecondary,
  },
});

export default ConfirmNotes;
