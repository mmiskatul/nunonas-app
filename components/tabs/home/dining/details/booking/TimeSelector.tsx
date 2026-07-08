// @ts-nocheck
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import theme from "../../../../../../constants/theme";

const TIME_SLOTS = [
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
  "9:30 PM",
  "10:00 PM",
];

const TimeSelector = ({ selectedTime, onTimeSelect }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Select Time</Text>
      <View style={styles.timeGrid}>
        {TIME_SLOTS.map((time) => (
          <TouchableOpacity
            key={time}
            style={[
              styles.timeSlot,
              selectedTime === time && styles.selectedTimeSlot,
              (time === "6:00 PM" || time === "8:30 PM" || time === "10:00 PM") && styles.disabledTimeSlot,
            ]}
            onPress={() => onTimeSelect(time)}
          >
            <Text style={[
              styles.timeText,
              selectedTime === time && styles.selectedTimeText,
              (time === "6:00 PM" || time === "8:30 PM" || time === "10:00 PM") && styles.disabledTimeText,
            ]}>
              {time}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.COLORS.textPrimary,
    marginBottom: 15,
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  timeSlot: {
    width: "30.5%",
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.COLORS.white,
  },
  selectedTimeSlot: {
    backgroundColor: theme.COLORS.primary,
    borderColor: theme.COLORS.primary,
  },
  disabledTimeSlot: {
    backgroundColor: "#f1f5f9",
    borderColor: "#f1f5f9",
  },
  timeText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.COLORS.textPrimary,
  },
  selectedTimeText: {
    color: theme.COLORS.white,
  },
  disabledTimeText: {
    color: "#cbd5e1",
  },
});

export default TimeSelector;


