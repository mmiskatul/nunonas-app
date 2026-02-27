import { Tabs, useSegments } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import theme from "../../constants/theme";

export default function TabLayout() {
  const segments = useSegments();

  // Hide tab bar on nested screens or specific sub-pages
  const isTabHidden =
    segments.length > 2 ||
    segments.includes("dining") ||
    segments.includes("edit") ||
    segments.includes("bookings");

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
