import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import theme from "../../constants/theme";
import Button from "../../components/ui/Button";
import InputField from "../../components/ui/InputField";

export default function SignupScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [enableLocation, setEnableLocation] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Image */}
          <View style={styles.imageContainer}>
            <Image
              source={require("../../assets/images/create-account.png")}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          {/* Title Area */}
          <View style={styles.headerArea}>
            <Text style={styles.title}>Create Your Account</Text>
            <Text style={styles.subtitle}>
              Join us to book, save, and earn rewards.
            </Text>
          </View>

          {/* Form Area */}
          <View style={styles.formArea}>
            <InputField
              label="Full Name"
              placeholder="John Doe"
              iconName="person-outline"
              value={fullName}
              onChangeText={setFullName}
            />

            <InputField
              label="Email or Phone Number"
              placeholder="you@example.com"
              iconName="mail-outline"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <InputField
              label="Password"
              placeholder="••••••••"
              iconName="lock-closed-outline"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              rightElement={
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={theme.COLORS.textSecondary}
                  />
                </TouchableOpacity>
              }
            />

            <InputField
              label="Confirm Password"
              placeholder="••••••••"
              iconName="lock-closed-outline"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              rightElement={
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={theme.COLORS.textSecondary}
                  />
                </TouchableOpacity>
              }
            />

            {/* Location Toggle */}
            <View style={styles.locationArea}>
              <View style={styles.locationInfo}>
                <Ionicons
                  name="location"
                  size={24}
                  color={theme.COLORS.primary}
                />
                <View style={styles.locationTextContainer}>
                  <Text style={styles.locationTitle}>Enable location</Text>
                  <Text style={styles.locationSubtitle}>
                    Get better recommendations
                  </Text>
                </View>
              </View>
              <Switch
                value={enableLocation}
                onValueChange={setEnableLocation}
                trackColor={{
                  false: theme.COLORS.border,
                  true: theme.COLORS.primary,
                }}
                thumbColor={
                  Platform.OS === "ios"
                    ? theme.COLORS.white
                    : enableLocation
                      ? theme.COLORS.white
                      : "#f4f3f4"
                }
              />
            </View>

            <Button
              title="Create Account"
              onPress={() => router.push("/(tabs)")}
              style={styles.createBtn}
            />

            <View style={styles.dividerArea}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or sign up with</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.socialArea}>
              <TouchableOpacity style={styles.socialBtn}>
                <Ionicons
                  name="logo-google"
                  size={24}
                  color={theme.COLORS.primary}
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.socialBtnText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn}>
                <Ionicons
                  name="logo-apple"
                  size={24}
                  color={theme.COLORS.primary}
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.socialBtnText}>Apple</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/auth/login")}>
                <Text style={styles.loginText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageContainer: {
    height: 180,
    backgroundColor: "#fef2f2",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    borderRadius: 24,
    marginTop: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  headerArea: {
    paddingHorizontal: 25,
    marginTop: 25,
    alignItems: "center",
  },
  title: {
    fontSize: theme.TYPOGRAPHY.h2.fontSize,
    fontWeight: theme.TYPOGRAPHY.h2.fontWeight,
    color: theme.COLORS.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: theme.COLORS.textSecondary,
    textAlign: "center",
  },
  formArea: {
    paddingHorizontal: theme.SPACING.containerPadding,
    marginTop: 10,
  },
  locationArea: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.COLORS.surface,
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: theme.COLORS.border,
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationTextContainer: {
    marginLeft: 12,
  },
  locationTitle: {
    fontSize: theme.TYPOGRAPHY.label.fontSize,
    fontWeight: theme.TYPOGRAPHY.label.fontWeight,
    color: "#1e293b",
  },
  locationSubtitle: {
    fontSize: 13,
    color: theme.COLORS.textSecondary,
  },
  createBtn: {
    marginTop: 25,
  },
  dividerArea: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: theme.COLORS.divider,
  },
  dividerText: {
    marginHorizontal: 15,
    color: theme.COLORS.textSecondary,
    fontSize: 13,
  },
  socialArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 15,
  },
  socialBtn: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.COLORS.border,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.COLORS.white,
  },
  socialBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e293b",
  },
  footer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },
  footerText: {
    color: theme.COLORS.textSecondary,
    fontSize: 14,
  },
  loginText: {
    color: theme.COLORS.textLink,
    fontSize: 14,
    fontWeight: "700",
  },
});
