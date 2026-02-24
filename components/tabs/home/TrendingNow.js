import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../../../constants/theme";
import Button from "../../ui/Button";

const TRENDING_DATA = [
  {
    id: 1,
    title: "Skyline Bistro",
    distance: "1.2 km away",
    rating: "4.8",
    image: require("../../../assets/images/discover-experience.png"), // Using existing assets as placeholders
  },
  {
    id: 2,
    title: "Serenity Spa",
    distance: "2.5 km away",
    rating: "4.9",
    image: require("../../../assets/images/plan-smarter-with-ai.png"),
  },
];

const TrendingNow = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Trending Now</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {TRENDING_DATA.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.cardContent}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>{item.title}</Text>
                <View style={styles.ratingBox}>
                  <Ionicons name="star" size={14} color="#f59e0b" />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
              </View>
              <View style={styles.locationRow}>
                <Ionicons
                  name="location"
                  size={14}
                  color={theme.COLORS.textSecondary}
                />
                <Text style={styles.distance}>{item.distance}</Text>
              </View>
              <Button
                title="Book Now"
                onPress={() => {}}
                style={styles.bookBtn}
                textStyle={styles.bookBtnText}
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.COLORS.textLink,
  },
  scrollContent: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  card: {
    width: 260,
    backgroundColor: theme.COLORS.white,
    borderRadius: 24,
    marginRight: 15,
    borderWidth: 1,
    borderColor: theme.COLORS.border,
    overflow: "hidden",
    ...theme.SHADOWS.card,
  },
  image: {
    width: "100%",
    height: 150,
  },
  cardContent: {
    padding: 16,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.COLORS.textPrimary,
  },
  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fffbeb",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#b45309",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 16,
  },
  distance: {
    fontSize: 13,
    color: theme.COLORS.textSecondary,
  },
  bookBtn: {
    height: 48,
    borderRadius: 12,
  },
  bookBtnText: {
    fontSize: 16,
  },
});

export default TrendingNow;
