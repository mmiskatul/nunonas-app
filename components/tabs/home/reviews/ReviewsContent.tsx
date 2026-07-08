import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../../../../constants/theme";

const REVIEWS_DATA = [
  {
    id: "1",
    user: "Sarah Johnson",
    date: "2 days ago",
    rating: 5,
    comment:
      "Amazing experience! The service was exceptional and everything went smoothly. Highly recommend to anyone looking for quality service.",
    avatar: "https://i.pravatar.cc/100?img=1",
  },
  {
    id: "2",
    user: "Michael Chen",
    date: "1 week ago",
    rating: 4,
    comment:
      "Great overall experience. The team was professional and the process was straightforward. Would definitely use again.",
    avatar: "https://i.pravatar.cc/100?img=2",
  },
  {
    id: "3",
    user: "Emma Wilson",
    date: "2 weeks ago",
    rating: 5,
    comment:
      "Outstanding service from start to finish. The attention to detail and customer care was impressive. Exceeded my expectations!",
    avatar: "https://i.pravatar.cc/100?img=3",
  },
  {
    id: "4",
    user: "David Rodriguez",
    date: "3 weeks ago",
    rating: 4,
    comment:
      "Very satisfied with the service. Everything was handled professionally and efficiently. Minor room for improvement but overall excellent.",
    avatar: "https://i.pravatar.cc/100?img=4",
  },
];

type RatingBarProps = {
  label: string;
  percentage: number;
  count: number;
};

type Review = {
  id: string;
  user: string;
  date: string;
  rating: number;
  comment: string;
  avatar: string;
};

type ReviewsContentProps = {
  restaurantId?: string;
};

const RatingBar = ({ label, percentage, count }: RatingBarProps) => (
  <View style={styles.ratingBarRow}>
    <Text style={styles.ratingBarLabel}>{label}★</Text>
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${percentage}%` }]} />
    </View>
    <Text style={styles.ratingBarCount}>{count}</Text>
  </View>
);

const ReviewCard = ({ review }: { review: Review }) => (
  <View style={styles.reviewCard}>
    <View style={styles.reviewHeader}>
      <Image source={{ uri: review.avatar }} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{review.user}</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((s) => (
            <Ionicons
              key={s}
              name={s <= review.rating ? "star" : "star-outline"}
              size={14}
              color="#FACC15"
            />
          ))}
        </View>
      </View>
      <Text style={styles.reviewDate}>{review.date}</Text>
    </View>
    <Text style={styles.reviewComment}>{review.comment}</Text>
  </View>
);

export default function ReviewsContent(_: ReviewsContentProps) {
  return (
    <View style={styles.container}>
      {/* Summary Header */}
      <View style={styles.summaryCard}>
        <Text style={styles.overallRating}>4.5</Text>
        <View style={styles.starsRowMain}>
          {[1, 2, 3, 4, 5].map((s) => (
            <Ionicons
              key={s}
              name={s <= 4 ? "star" : "star-outline"} // Custom logic for demo
              size={24}
              color="#FACC15"
            />
          ))}
        </View>
        <Text style={styles.reviewsCount}>Based on 248 reviews</Text>

        <View style={styles.barsContainer}>
          <RatingBar label="5" percentage={75} count={186} />
          <RatingBar label="4" percentage={15} count={37} />
          <RatingBar label="3" percentage={6} count={15} />
          <RatingBar label="2" percentage={3} count={7} />
          <RatingBar label="1" percentage={1} count={3} />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Recent Reviews</Text>

      {REVIEWS_DATA.map((item) => (
        <ReviewCard key={item.id} review={item} />
      ))}

      <TouchableOpacity style={styles.loadMoreBtn}>
        <Text style={styles.loadMoreText}>Load More Reviews</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F8FAFC",
  },
  summaryCard: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    ...theme.SHADOWS.card,
  },
  overallRating: {
    fontSize: 48,
    fontWeight: "800",
    color: "#1E3A8A",
    marginBottom: 8,
  },
  starsRowMain: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 8,
  },
  reviewsCount: {
    fontSize: 14,
    color: theme.COLORS.textSecondary,
    marginBottom: 20,
  },
  barsContainer: {
    width: "100%",
    gap: 10,
  },
  ratingBarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  ratingBarLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.COLORS.textPrimary,
    width: 25,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FACC15",
    borderRadius: 4,
  },
  ratingBarCount: {
    fontSize: 12,
    color: theme.COLORS.textSecondary,
    width: 30,
    textAlign: "right",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
    marginBottom: 16,
  },
  reviewCard: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    ...theme.SHADOWS.card,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.COLORS.textPrimary,
    marginBottom: 2,
  },
  starsRow: {
    flexDirection: "row",
    gap: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: theme.COLORS.textSecondary,
    alignSelf: "flex-start",
    marginTop: 2,
  },
  reviewComment: {
    fontSize: 14,
    color: theme.COLORS.textSecondary,
    lineHeight: 20,
  },
  loadMoreBtn: {
    borderWidth: 1,
    borderColor: "#1E3A8A",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
  },
  loadMoreText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E3A8A",
  },
});


