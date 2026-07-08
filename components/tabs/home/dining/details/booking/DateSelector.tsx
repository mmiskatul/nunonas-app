// @ts-nocheck
import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import theme from "../../../../../../constants/theme";

const DAYS = [
  { day: "Mon", date: "15", month: "Jan" },
  { day: "Tue", date: "16", month: "Jan" },
  { day: "Wed", date: "17", month: "Jan" },
  { day: "Thu", date: "18", month: "Jan" },
  { day: "Fri", date: "19", month: "Jan" },
];

const DateSelector = ({ selectedDate, onDateSelect }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Select Date</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateList}>
        {DAYS.map((item) => (
          <TouchableOpacity
            key={item.date}
            style={[
              styles.dateItem,
              selectedDate === item.date && styles.selectedDateItem,
            ]}
            onPress={() => onDateSelect(item.date)}
          >
            <Text style={[styles.dateDay, selectedDate === item.date && styles.selectedDateText]}>
              {item.day}
            </Text>
            <Text style={[styles.dateNumber, selectedDate === item.date && styles.selectedDateText]}>
              {item.date}
            </Text>
            <Text style={[styles.dateMonth, selectedDate === item.date && styles.selectedDateText]}>
              {item.month}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  dateList: {
    flexDirection: "row",
  },
  dateItem: {
    width: 70,
    height: 90,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.COLORS.border,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  selectedDateItem: {
    backgroundColor: theme.COLORS.primary,
    borderColor: theme.COLORS.primary,
  },
  dateDay: {
    fontSize: 12,
    color: theme.COLORS.textSecondary,
    marginBottom: 4,
  },
  dateNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
  },
  dateMonth: {
    fontSize: 12,
    color: theme.COLORS.textSecondary,
    marginTop: 4,
  },
  selectedDateText: {
    color: theme.COLORS.white,
  },
});

export default DateSelector;


