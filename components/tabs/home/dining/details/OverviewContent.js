import { View, Text, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
import { Ionicons } from "@expo/vector-icons";
import theme from "../../../../../constants/theme";

const AMENITIES = [
  { id: 1, name: "Free WiFi", icon: "wifi", color: "#3b82f6" },
  { id: 2, name: "Parking", icon: "square", color: "#3b82f6" }, // Simplified icon name
  { id: 3, name: "Outdoor", icon: "leaf", color: "#3b82f6" },
  { id: 4, name: "Cards", icon: "card", color: "#3b82f6" },
  { id: 5, name: "Accessible", icon: "body", color: "#3b82f6" },
  { id: 6, name: "Bar", icon: "wine", color: "#3b82f6" },
];

const OverviewContent = () => {
  return (
    <View style={styles.container}>
      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>
          Experience authentic French cuisine in an elegant setting. Our chef
          brings decades of culinary expertise to create memorable dining
          experiences with seasonal ingredients and traditional techniques.
        </Text>
      </View>

      {/* Opening Hours Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Opening Hours</Text>
        <View style={styles.hoursRow}>
          <Text style={styles.dayText}>Monday - Friday</Text>
          <Text style={styles.timeText}>12:00 PM - 11:00 PM</Text>
        </View>
        <View style={styles.hoursRow}>
          <Text style={styles.dayText}>Saturday - Sunday</Text>
          <Text style={styles.timeText}>11:00 AM - 12:00 AM</Text>
        </View>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Open Now</Text>
        </View>
      </View>

      {/* Amenities Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Amenities</Text>
        <View style={styles.amenityGrid}>
          {AMENITIES.map((item) => (
            <View key={item.id} style={styles.amenityItem}>
              <View style={styles.amenityIconBox}>
                <Ionicons name={item.icon} size={24} color={item.color} />
              </View>
              <Text style={styles.amenityName}>{item.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 16,
    color: theme.COLORS.textSecondary,
    lineHeight: 24,
  },
  hoursRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  dayText: {
    fontSize: 16,
    color: theme.COLORS.textSecondary,
  },
  timeText: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.COLORS.textPrimary,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22c55e",
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#166534",
  },
  amenityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  amenityItem: {
    width: (width - 70) / 3, // 3 column grid with padding
    backgroundColor: theme.COLORS.surface,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    gap: 8,
  },
  amenityIconBox: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  amenityName: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.COLORS.textSecondary,
    textAlign: "center",
  },
});

export default OverviewContent;
