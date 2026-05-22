import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import theme from "../../constants/theme";
import Button from "../../components/ui/Button";
import InputField from "../../components/ui/InputField";
import { apiPost } from "../../lib/api";
import { setSession } from "../../lib/auth-session";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Missing credentials", "Enter your email or phone and password.");
      return;
    }

    try {
      setLoading(true);
      const data = await apiPost("/api/v1/auth/login", {
        email_or_phone: email.trim(),
        password,
      });
      await setSession({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      });
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Login failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Image */}
          <View style={styles.imageContainer}>
            <Image
              source={require("../../assets/images/welcome-back.png")}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          {/* Title Area */}
          <View style={styles.headerArea}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Login to continue discovering experiences near you.
            </Text>
          </View>

          {/* Form Area */}
          <View style={styles.formArea}>
            <InputField
              label="Email or Phone Number"
              placeholder="Enter your email or phone"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <InputField
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              rightElement={
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color={theme.COLORS.textSecondary}
                  />
                </TouchableOpacity>
              }
            />

            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button
              title={loading ? "Logging In..." : "Login"}
              onPress={handleLogin}
              loading={loading}
              style={styles.loginBtn}
            />

            <View style={styles.dividerArea}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.socialArea}>
              <TouchableOpacity style={styles.socialBtn}>
                <Ionicons
                  name="logo-google"
                  size={24}
                  color={theme.COLORS.textPrimary}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn}>
                <Ionicons
                  name="logo-apple"
                  size={24}
                  color={theme.COLORS.textPrimary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/auth/signup")}>
                <Text style={styles.signUpText}>Sign Up</Text>
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
    height: 220,
    backgroundColor: theme.COLORS.card,
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
    marginTop: 30,
    alignItems: "center",
  },
  title: {
    fontSize: theme.TYPOGRAPHY.h2.fontSize,
    fontWeight: theme.TYPOGRAPHY.h2.fontWeight,
    color: theme.COLORS.textPrimary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: theme.TYPOGRAPHY.subtitle.fontSize,
    color: theme.COLORS.textSecondary,
    textAlign: "center",
    lineHeight: theme.TYPOGRAPHY.subtitle.lineHeight,
  },
  formArea: {
    paddingHorizontal: theme.SPACING.containerPadding,
    marginTop: 15,
  },
  forgotBtn: {
    alignSelf: "flex-end",
    marginTop: 12,
  },
  forgotText: {
    color: theme.COLORS.secondary,
    fontSize: 14,
    fontWeight: "600",
  },
  loginBtn: {
    marginTop: 30,
  },
  dividerArea: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: theme.COLORS.divider,
  },
  dividerText: {
    marginHorizontal: 15,
    color: theme.COLORS.textSecondary,
    fontSize: 14,
  },
  socialArea: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
    gap: 20,
  },
  socialBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: theme.COLORS.border,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.COLORS.white,
  },
  footer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  footerText: {
    color: theme.COLORS.textSecondary,
    fontSize: 15,
  },
  signUpText: {
    color: theme.COLORS.textLink,
    fontSize: 15,
    fontWeight: "700",
  },
});
