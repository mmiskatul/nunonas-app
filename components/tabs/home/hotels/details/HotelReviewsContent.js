import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../../../../../constants/theme";

const REVIEWS = [
  {
    id: 1,
    user: "John Smith",
    date: "Feb 10, 2024",
    rating: 5,
    comment:
      "Absolutely loved the city views and the room service was top-notch! Highly recommended.",
  },
  {
    id: 2,
    user: "Sarah Wilson",
    date: "Jan 25, 2024",
    rating: 4,
    comment:
      "Great stay, breakfast was delicious. The gym could be a bit bigger but overall a 4.5/5 experience.",
  },
];

const HotelReviewsContent = () => {
  return (
    <View style={styles.container}>
      <View style={styles.summaryBox}>
        <Text style={styles.bigRating}>4.8</Text>
        <View style={styles.stars}>
          {[1, 2, 3, 4].map((i) => (
            <Ionicons key={i} name="star" size={20} color="#facc15" />
          ))}
          <Ionicons name="star-half" size={20} color="#facc15" />
        </View>
        <Text style={styles.totalReviews}>Based on 1,247 reviews</Text>
      </View>

      <View style={styles.list}>
        {REVIEWS.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{review.user[0]}</Text>
              </View>
              <View>
                <Text style={styles.userName}>{review.user}</Text>
                <Text style={styles.date}>{review.date}</Text>
              </View>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color="white" />
                <Text style={styles.ratingText}>{review.rating}</Text>
              </View>
            </View>
            <Text style={styles.comment}>{review.comment}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: theme.COLORS.white,
  },
  summaryBox: {
    alignItems: "center",
    marginBottom: 30,
    padding: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
  },
  bigRating: {
    fontSize: 48,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
  },
  stars: {
    flexDirection: "row",
    marginVertical: 8,
  },
  totalReviews: {
    fontSize: 14,
    color: theme.COLORS.textSecondary,
  },
  list: {
    gap: 20,
  },
  reviewCard: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 20,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.COLORS.textPrimary,
  },
  date: {
    fontSize: 12,
    color: theme.COLORS.textSecondary,
  },
  ratingBadge: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: theme.COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
  },
  comment: {
    fontSize: 14,
    color: theme.COLORS.textSecondary,
    lineHeight: 20,
  },
});

export default HotelReviewsContent;
