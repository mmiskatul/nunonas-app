import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import theme from "../../../../../constants/theme";

const EventAbout = ({ description, artists }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>About This Event</Text>
      <Text style={styles.description}>
        {description ||
          "Experience the ultimate electronic music festival featuring world-class DJs and immersive light shows. This year's lineup includes top artists from around the globe."}
      </Text>

      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
        Featured Artists
      </Text>
      <View style={styles.artistRow}>
        {(artists || ["Calvin Harris", "Armin van Buuren", "Deadmau5"]).map(
          (artist, index) => (
            <Text key={index} style={styles.artistName}>
              {artist}
              {index < 2 ? "   " : ""}
            </Text>
          ),
        )}
      </View>

      <TouchableOpacity>
        <Text style={styles.readMore}>Read more</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: theme.COLORS.textSecondary,
    lineHeight: 22,
    fontWeight: "500",
  },
  artistRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  artistName: {
    fontSize: 14,
    color: theme.COLORS.textSecondary,
    fontWeight: "500",
  },
  readMore: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.COLORS.primary,
    marginTop: 5,
  },
});

export default EventAbout;
