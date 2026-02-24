import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../../../../../constants/theme";

const EventLocationMap = ({ venueName, address }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Location & Directions</Text>

      {/* Map Placeholder */}
      <View style={styles.mapContainer}>
        {/* We use an image as a realistic placeholder for the map */}
        <Image
          source={{
            uri: "https://api.mapbox.com/styles/v1/mapbox/light-v10/static/44.4092,-34.5997,14,0/600x300?access_token=pk.eyJ1IjoiYmFyYmFyb3MiLCJhIjoiY2p4eGxxZzZqMGFzeDNubzlyam8xbzVqNiJ9.v_8rX3K6P_Yv_X_8rX3K6P_Yv_X_8rX3K6P_Yv_X_8rX3K6P",
          }}
          style={styles.map}
          resizeMode="cover"
        />
      </View>

      <View style={styles.venueInfo}>
        <Text style={styles.venueName}>{venueName || "Skyline Arena"}</Text>
        <Text style={styles.address}>
          {address || "123 Downtown Boulevard, City Center"}
        </Text>
      </View>

      <TouchableOpacity style={styles.directionsBtn} activeOpacity={0.8}>
        <Ionicons name="navigate" size={20} color={theme.COLORS.textPrimary} />
        <Text style={styles.directionsText}>Get Directions</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
    marginBottom: 15,
  },
  mapContainer: {
    height: 180,
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#f3f4f6",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  venueInfo: {
    marginTop: 15,
  },
  venueName: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.COLORS.textPrimary,
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: theme.COLORS.textSecondary,
    fontWeight: "500",
  },
  directionsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
  },
  directionsText: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.COLORS.textPrimary,
  },
});

export default EventLocationMap;
