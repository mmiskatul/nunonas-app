import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../../../constants/theme";
import Button from "../../ui/Button";

const FEATURED_DATA = [
  {
    id: 1,
    title: "Grand Plaza Hotel",
    distance: "0.8 km",
    rating: "4.6",
    image: require("../../../assets/images/book-easily.png"),
    btnText: "Book Stay",
  },
  {
    id: 2,
    title: "Adventure Park",
    distance: "5.2 km",
    rating: "4.9",
    image: require("../../../assets/images/discover-experience.png"),
    btnText: "Get Tickets",
  },
];

const FeaturedExperiences = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Featured Experiences</Text>

      <View style={styles.list}>
        {FEATURED_DATA.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.cardContent}>
              <Text style={styles.title}>{item.title}</Text>
              <View style={styles.detailsRow}>
                <TouchableOpacity
                  style={styles.ratingBox}
                  onPress={() => {
                    router.push({
                      pathname: `/home/reviews/${item.id}`,
                      params: { title: `${item.title} Reviews` },
                    });
                  }}
                >
                  <Ionicons name="star" size={14} color="#f59e0b" />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </TouchableOpacity>
                <Text style={styles.separator}>•</Text>
                <Text style={styles.distance}>{item.distance}</Text>
              </View>
              <Button
                title={item.btnText}
                onPress={() => {}}
                style={styles.actionBtn}
                textStyle={styles.actionBtnText}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 30,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
    marginBottom: 16,
  },
  list: {
    gap: 16,
  },
  card: {
    flexDirection: "row",
    backgroundColor: theme.COLORS.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.COLORS.border,
    padding: 12,
    alignItems: "center",
    ...theme.SHADOWS.card,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 16,
  },
  cardContent: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: theme.COLORS.textPrimary,
    marginBottom: 6,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
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
  separator: {
    color: theme.COLORS.textSecondary,
  },
  distance: {
    fontSize: 13,
    color: theme.COLORS.textSecondary,
  },
  actionBtn: {
    height: 36,
    borderRadius: 8,
    width: 110,
    paddingHorizontal: 12,
  },
  actionBtnText: {
    fontSize: 14,
  },
});

export default FeaturedExperiences;
