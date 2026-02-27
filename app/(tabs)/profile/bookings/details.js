import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import theme from "../../../../constants/theme";
import ReviewModal from "../../../../components/ui/ReviewModal";

const InfoRow = ({ label, value, valueStyle }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={[styles.infoValue, valueStyle]}>{value}</Text>
  </View>
);

const DetailCard = ({ title, children, containerStyle }) => (
  <View style={[styles.detailCard, containerStyle]}>
    <Text style={styles.detailCardTitle}>{title}</Text>
    {children}
  </View>
);

const ActionButton = ({ icon, label, onPress, variant = "secondary" }) => (
  <TouchableOpacity
    style={[
      styles.actionButton,
      variant === "danger" && styles.actionButtonDanger,
      variant === "primary" && styles.actionButtonPrimary,
    ]}
    onPress={onPress}
  >
    <Ionicons
      name={icon}
      size={20}
      color={
        variant === "secondary" ? theme.COLORS.textPrimary : theme.COLORS.white
      }
    />
    <Text
      style={[
        styles.actionButtonText,
        variant === "secondary"
          ? styles.actionButtonTextSecondary
          : styles.actionButtonTextPrimary,
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

export default function BookingDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const isHotel = params.category === "Hotel";
  const [showReviewModal, setShowReviewModal] = React.useState(false);

  const handleCall = () => {
    const phoneNumber = params.phone || "+15551234567";
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const renderHotelLayout = () => (
    <>
      <View style={styles.imageContainer}>
        <Image source={{ uri: params.imageUrl }} style={styles.headerImage} />
        <TouchableOpacity
          style={styles.backButtonOverlay}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.COLORS.textPrimary}
          />
        </TouchableOpacity>
        <View style={styles.statusBadgeOverlay}>
          <Text style={styles.statusBadgeText}>{params.status}</Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{params.title}</Text>
          <View style={styles.ratingRow}>
            <View style={styles.stars}>
              {[1, 2, 3, 4].map((i) => (
                <Ionicons key={i} name="star" size={16} color="#FFD700" />
              ))}
              <Ionicons name="star-outline" size={16} color="#FFD700" />
            </View>
            <Text style={styles.ratingText}>{params.rating}</Text>
          </View>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={16} color={theme.COLORS.primary} />
            <Text style={styles.locationText}>{params.location}</Text>
          </View>
        </View>

        <DetailCard
          title="Stay Information"
          containerStyle={styles.stayInfoCard}
        >
          <InfoRow label="Check-in" value={params.checkIn || "Feb 15, 2026"} />
          <InfoRow
            label="Check-out"
            value={params.checkOut || "Feb 18, 2026"}
          />
          <InfoRow
            label="Number of Nights"
            value={params.nights || "3 Nights"}
          />
          <InfoRow
            label="Room Type"
            value={params.roomType || "Deluxe King Suite"}
          />
          <InfoRow label="Guests" value={params.guests || "2 Adults"} />
        </DetailCard>

        <DetailCard title="Payment Summary">
          <InfoRow
            label="Room Price (per night)"
            value={params.pricePerNight || "$299.00"}
          />
          <InfoRow
            label={`${params.nights || "3"} Nights`}
            value={params.totalPrice || "$897.00"}
          />
          <InfoRow label="Taxes & Fees" value={params.taxes || "$127.05"} />
          <View style={styles.divider} />
          <InfoRow
            label="Total Paid"
            value={params.totalPaid || "$974.05"}
            valueStyle={styles.totalPaidValue}
          />
        </DetailCard>
      </View>
    </>
  );

  const renderRestaurantLayout = () => (
    <View style={styles.restaurantContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.COLORS.textPrimary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.restaurantCard}>
          <Text style={styles.entityTitle}>{params.title}</Text>
          <Text style={styles.entityCategory}>
            {params.category} / Fine Dining
          </Text>

          <View style={styles.entityInfoRow}>
            <Ionicons
              name="location-outline"
              size={20}
              color={theme.COLORS.textSecondary}
            />
            <Text style={styles.entityInfoText}>{params.location}</Text>
          </View>

          <View style={styles.entityInfoRow}>
            <Ionicons
              name="call-outline"
              size={20}
              color={theme.COLORS.textSecondary}
            />
            <Text
              style={[styles.entityInfoText, { color: theme.COLORS.primary }]}
            >
              {params.phone || "+1 (555) 123-4567"}
            </Text>
          </View>
        </View>

        <DetailCard title="Booking Information">
          <InfoRow
            label="Booking ID"
            value={params.bookingId || "#BK2024001"}
          />
          <View style={styles.cardDivider} />
          <InfoRow label="Date" value={params.date} />
          <View style={styles.cardDivider} />
          <InfoRow label="Time" value={params.time || "7:30 PM"} />
          <View style={styles.cardDivider} />
          <InfoRow label="Guests" value={params.guests || "4 People"} />
          <View style={styles.cardDivider} />
          <View style={styles.notesRow}>
            <Text style={styles.infoLabel}>Special Notes</Text>
            <Text style={styles.notesValue}>
              {params.notes || "No special requests"}
            </Text>
          </View>
        </DetailCard>

        <View style={styles.actionsContainer}>
          <ActionButton
            icon="call"
            label="Contact Entity"
            variant="primary"
            onPress={handleCall}
          />
          <ActionButton icon="close" label="Cancel Booking" variant="danger" />
          <ActionButton
            icon="headset"
            label="Contact Support"
            onPress={() => router.push("/profile/support")}
          />
          <ActionButton
            icon="star"
            label="Leave Review"
            onPress={() => setShowReviewModal(true)}
          />
        </View>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.mainContainer} edges={isHotel ? [] : ["top"]}>
      <StatusBar barStyle="dark-content" />
      {isHotel ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderHotelLayout()}
          <View
            style={[
              styles.actionsContainer,
              { paddingHorizontal: 20, paddingBottom: 40 },
            ]}
          >
            <ActionButton
              icon="call"
              label="Contact Hotel"
              variant="primary"
              onPress={handleCall}
            />
            <ActionButton
              icon="close"
              label="Cancel Booking"
              variant="danger"
            />
            <ActionButton
              icon="headset"
              label="Contact Support"
              onPress={() => router.push("/profile/support")}
            />
            <ActionButton
              icon="star"
              label="Leave Review"
              onPress={() => setShowReviewModal(true)}
            />
          </View>
        </ScrollView>
      ) : (
        renderRestaurantLayout()
      )}

      <ReviewModal
        visible={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={(data) => {
          console.log("Review submitted:", data);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  restaurantContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.COLORS.card,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  // Hotel Layout Styles
  imageContainer: {
    width: "100%",
    height: 300,
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  backButtonOverlay: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  statusBadgeOverlay: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "rgba(30, 58, 138, 0.9)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusBadgeText: {
    color: theme.COLORS.white,
    fontWeight: "700",
    fontSize: 14,
  },
  contentContainer: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  stars: {
    flexDirection: "row",
    marginRight: 10,
  },
  ratingText: {
    fontSize: 16,
    color: theme.COLORS.textSecondary,
    fontWeight: "600",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 14,
    color: theme.COLORS.textSecondary,
    marginLeft: 4,
    fontWeight: "500",
  },
  // Common Detail Card
  detailCard: {
    backgroundColor: "#EFF6FF", // Light blue from mockup
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  stayInfoCard: {
    backgroundColor: "#EFF6FF",
  },
  detailCardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 15,
    color: theme.COLORS.textSecondary,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 15,
    color: theme.COLORS.textPrimary,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: theme.COLORS.border,
    marginVertical: 15,
  },
  totalPaidValue: {
    fontSize: 18,
    color: theme.COLORS.primary,
    fontWeight: "800",
  },
  // Restaurant Layout Styles
  restaurantCard: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.COLORS.border,
    ...theme.SHADOWS.card,
  },
  entityTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
    marginBottom: 4,
  },
  entityCategory: {
    fontSize: 16,
    color: theme.COLORS.textSecondary,
    marginBottom: 15,
  },
  entityInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  entityInfoText: {
    fontSize: 15,
    color: theme.COLORS.textSecondary,
    marginLeft: 10,
    flex: 1,
  },
  cardDivider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginVertical: 12,
  },
  notesRow: {
    marginTop: 5,
  },
  notesValue: {
    fontSize: 15,
    color: theme.COLORS.textPrimary,
    fontWeight: "600",
    marginTop: 8,
    lineHeight: 22,
    textAlign: "right",
    flex: 1,
  },
  // Actions
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#F1F5F9",
  },
  actionButtonPrimary: {
    backgroundColor: theme.COLORS.primary,
  },
  actionButtonDanger: {
    backgroundColor: theme.COLORS.error,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  actionButtonTextPrimary: {
    color: theme.COLORS.white,
  },
  actionButtonTextSecondary: {
    color: theme.COLORS.textPrimary,
  },
});
