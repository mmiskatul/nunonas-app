import { Tabs, useSegments, useRouter, useRootNavigationState } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import theme from "../../constants/theme";
import { restoreSession } from "../../lib/auth-session";

export default function TabLayout() {
  const segments = useSegments();
  const router = useRouter();
  const navState = useRootNavigationState();

  const [authStatus, setAuthStatus] = useState("loading"); // "loading" | "authorized" | "unauthorized"

  // Hide tab bar on nested screens or specific sub-pages
  const isTabHidden =
    segments.length > 2 ||
    segments.includes("dining") ||
    segments.includes("edit") ||
    segments.includes("bookings");

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const session = await restoreSession();
        if (!cancelled) {
          setAuthStatus(session?.accessToken ? "authorized" : "unauthorized");
        }
      } catch {
        if (!cancelled) setAuthStatus("unauthorized");
      }
    }

    check();
    return () => {
      cancelled = true;
    };
  }, []);

  // Wait for navigation to be ready before redirecting
  useEffect(() => {
    if (!navState?.key) return; // navigator not ready yet
    if (authStatus === "unauthorized") {
      router.replace("/auth/login");
    }
  }, [authStatus, navState?.key, router]);

  // Show full-screen spinner while checking auth
  if (authStatus === "loading") {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.COLORS.white,
        }}
      >
        <ActivityIndicator size="small" color={theme.COLORS.primary} />
      </View>
    );
  }

  // While redirect is in flight, render nothing
  if (authStatus === "unauthorized") {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.COLORS.primary,
        tabBarInactiveTintColor: theme.COLORS.textSecondary,
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          display: isTabHidden ? "none" : "flex",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="save"
        options={{
          title: "Save",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "bookmark" : "bookmark-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "chatbubble" : "chatbubble-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
