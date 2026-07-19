import { StyleSheet, Text, View } from "react-native";

/**
 * Expo Router requires a platform-neutral sibling for routes that have
 * `.native`/`.web` implementations. Native and web use their specialized map
 * screens; this lightweight fallback keeps route discovery safe on any other
 * platform.
 */
export default function MapFallbackScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Map unavailable</Text>
      <Text style={styles.message}>This map is not supported on the current platform.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f8fafc",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
  },
  message: {
    marginTop: 8,
    textAlign: "center",
    color: "#475569",
  },
});
