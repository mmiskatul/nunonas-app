import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, StyleSheet } from "react-native";
import theme from "../../../../constants/theme";

const CATEGORIES = ["All", "Music", "Nightlife", "Comedy", "Family", "Art"];

const CategoryFilters = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {CATEGORIES.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.filterItem,
            activeCategory === category && styles.activeFilterItem,
          ]}
          onPress={() => setActiveCategory(category)}
        >
          <Text
            style={[
              styles.filterText,
              activeCategory === category && styles.activeFilterText,
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 8,
  },
  filterItem: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.COLORS.surface,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  activeFilterItem: {
    backgroundColor: theme.COLORS.primary,
    borderColor: theme.COLORS.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.COLORS.textSecondary,
  },
  activeFilterText: {
    color: theme.COLORS.white,
  },
});

export default CategoryFilters;
