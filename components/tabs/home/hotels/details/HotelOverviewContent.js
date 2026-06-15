import React from "react";
import { StyleSheet, View, Text, Image, Dimensions } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import theme from "../../../../../constants/theme";
import { buildStaticMapUrl } from "../../../../../lib/google-maps";

const { width } = Dimensions.get("window");

const AMENITIES = [
  { name: "Free Wi-Fi", icon: "wifi", library: "Ionicons" },
  { name: "Breakfast", icon: "restaurant-outline", library: "Ionicons" },
  { name: "Pool", icon: "pool", library: "MaterialCommunityIcons" },
  { name: "Gym", icon: "weight-lifter", library: "MaterialCommunityIcons" },
  { name: "Parking", icon: "parking", library: "MaterialCommunityIcons" },
  {
    name: "Room Service",
    icon: "room-service-outline",
    library: "MaterialCommunityIcons",
  },
];

const HotelOverviewContent = ({ hotel }) => {
  const address = hotel?.address || hotel?.location || "Manhattan, Doha, Qatar";
  const mapUrl = buildStaticMapUrl({
    center: address,
    markerLabel: "G",
  });

  return (
    <View style={styles.container}>
      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>
          {hotel?.about || "Experience luxury at our hotel, where comfort meets elegancy. Located in a prime area, we offer world-class services and custom amenities."}
        </Text>
      </View>

      {/* Amenities Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Amenities</Text>
        <View style={styles.amenitiesGrid}>
          {AMENITIES.map((item, index) => (
            <View key={index} style={styles.amenityBox}>
              <View style={styles.iconCircle}>
                {item.library === "Ionicons" ? (
                  <Ionicons
                    name={item.icon}
                    size={24}
                    color={theme.COLORS.primary}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={24}
                    color={theme.COLORS.primary}
                  />
                )}
              </View>
              <Text style={styles.amenityName}>{item.name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Special Offers */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Special Offers</Text>
        <View style={styles.offerCard}>
          <View style={styles.offerIcon}>
            <MaterialCommunityIcons name="percent" size={24} color="#1e3a8a" />
          </View>
          <View>
            <Text style={styles.offerTitle}>Early Bird Special</Text>
            <Text style={styles.offerDesc}>
              Save 20% on bookings made 30 days in advance
            </Text>
          </View>
        </View>
      </View>

      {/* Location Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.mapContainer}>
          <Image
            source={
              mapUrl
                ? { uri: mapUrl }
                : require("../../../../../assets/images/discover-experience.png")
            }
            style={styles.mapImage}
          />
        </View>
        <Text style={styles.address}>{address}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: theme.COLORS.white,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.COLORS.textPrimary,
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    color: theme.COLORS.textSecondary,
    lineHeight: 22,
  },
  readMore: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.COLORS.primary,
    marginTop: 4,
  },
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  amenityBox: {
    width: (width - 40) / 3,
    alignItems: "center",
    marginBottom: 20,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  amenityName: {
    fontSize: 12,
    color: theme.COLORS.textSecondary,
    textAlign: "center",
  },
  offerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f9ff",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  offerIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#dbeafe",
    justifyContent: "center",
    alignItems: "center",
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.COLORS.textPrimary,
  },
  offerDesc: {
    fontSize: 12,
    color: theme.COLORS.textSecondary,
    marginTop: 2,
  },
  mapContainer: {
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
  },
  mapImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  address: {
    fontSize: 14,
    color: theme.COLORS.textSecondary,
  },
});

export default HotelOverviewContent;
