import { View, StyleSheet, TouchableOpacity, Text, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import theme from "../../../../../constants/theme";
import Button from "../../../../ui/Button";

const DetailsActions = () => {
  const router = useRouter();

  const handleCall = () => {
    Linking.openURL("tel:+1234567890");
  };

  return (
    <View style={styles.container}>
      <Button
        title="Book a Table"
        onPress={() => router.push("/(tabs)/home/dining/booking")}
        style={styles.bookBtn}
        textStyle={styles.bookBtnText}
      />

      <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
        <Ionicons name="call" size={20} color={theme.COLORS.primary} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.uberBtn}>
        <Text style={styles.uberText}>Uber</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 25,
  },
  bookBtn: {
    flex: 2,
    height: 52,
    borderRadius: 16,
    ...theme.SHADOWS.primary,
  },
  bookBtnText: {
    fontSize: 18,
    fontWeight: "700",
  },
  callBtn: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },
  uberBtn: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: theme.COLORS.black,
    justifyContent: "center",
    alignItems: "center",
  },
  uberText: {
    color: theme.COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
});

export default DetailsActions;
