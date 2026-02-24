import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../../constants/theme";

// Import Components
import ProfileMenuItem from "../../components/tabs/profile/ProfileMenuItem";
import ProfileHeader from "../../components/tabs/profile/ProfileHeader";
import BonusPointsCard from "../../components/tabs/profile/BonusPointsCard";

// Helper Components
const ProfileHeaderSection = ({ title }) => (
  <Text style={styles.sectionHeader}>{title}</Text>
);

const ProfileLinkItem = ({ title, onPress }) => (
  <TouchableOpacity
    style={styles.linkItem}
    activeOpacity={0.6}
    onPress={onPress}
  >
    <Text style={styles.linkText}>{title}</Text>
    <Ionicons
      name="chevron-forward"
      size={16}
      color={theme.COLORS.textSecondary}
    />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const [nearbyEvents, setNearbyEvents] = useState(false);
  const [bookingReminders, setBookingReminders] = useState(true);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header section */}
        <ProfileHeader
          name="Sarah Mitchell"
          email="sarah.mitchell@email.com"
          imageUrl="https://i.pravatar.cc/300?img=32"
          onEditPress={() => {}}
        />

        {/* Bonus Points Card section */}
        <BonusPointsCard points="1,250" />

        {/* Menu Sections */}
        <View style={styles.menuContainer}>
          {/* My Bookings */}
          <ProfileHeaderSection title="My Bookings" />
          <ProfileMenuItem
            icon="calendar-outline"
            title="View all my bookings"
            onPress={() => {}}
          />

          {/* Your activity */}
          <ProfileHeaderSection title="Your activity" />
          <ProfileMenuItem
            icon="star-outline"
            title="Reviews"
            onPress={() => {}}
          />

          {/* About me */}
          <ProfileHeaderSection title="About me" />
          <ProfileMenuItem
            icon="person-outline"
            title="Personal details"
            onPress={() => {}}
          />
          <ProfileMenuItem
            icon="settings-outline"
            title="Settings"
            onPress={() => {}}
          />

          {/* Help Center */}
          <ProfileHeaderSection title="Help Center" />
          <ProfileMenuItem
            icon="headset-outline"
            title="Get support"
            onPress={() => {}}
          />

          {/* Notifications */}
          <ProfileHeaderSection title="Notifications" />
          <ProfileMenuItem
            icon="location-outline"
            title="Nearby events"
            switchValue={nearbyEvents}
            onSwitchChange={setNearbyEvents}
          />
          <ProfileMenuItem
            icon="notifications-outline"
            title="Booking reminders"
            switchValue={bookingReminders}
            onSwitchChange={setBookingReminders}
          />

          {/* Links */}
          <View style={styles.linksContainer}>
            <ProfileLinkItem title="Terms & Conditions" onPress={() => {}} />
            <ProfileLinkItem title="Privacy Policy" onPress={() => {}} />
          </View>

          {/* Logout */}
          <TouchableOpacity
            style={styles.logoutBtn}
            activeOpacity={0.7}
            onPress={() => {}}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
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
  menuContainer: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
    marginTop: 24,
    marginBottom: 8,
  },
  linksContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: theme.COLORS.border,
    paddingTop: 10,
  },
  linkItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  linkText: {
    fontSize: 15,
    color: theme.COLORS.textSecondary,
    fontWeight: "500",
  },
  logoutBtn: {
    marginTop: 40,
    alignItems: "center",
    paddingVertical: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.COLORS.error,
  },
});
