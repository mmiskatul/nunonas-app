// @ts-nocheck
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import theme from "../../../../constants/theme";
import BookingCard from "../../../../components/tabs/profile/bookings/BookingCard";
import { listMyBookings } from "../../../../lib/customer-api";


const bookingsData = [
  {
    id: "1",
    title: "Grand Palace Hotel",
    category: "Hotel",
    status: "Confirmed",
    date: "Dec 20-22, 2024",
    location: "Downtown Manhattan, New York",
    imageUrl:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
    rating: "4-Star Hotel",
    checkIn: "Feb 15, 2026",
    checkOut: "Feb 18, 2026",
    nights: "3 Nights",
    roomType: "Deluxe King Suite",
    guests: "2 Adults",
    pricePerNight: "$299.00",
    totalPrice: "$897.00",
    taxes: "$127.05",
    totalPaid: "$974.05",
  },
  {
    id: "2",
    title: "The Grand Restaurant",
    category: "Restaurant",
    status: "Confirmed",
    date: "March 15, 2024",
    time: "7:30 PM",
    guests: "4 People",
    location: "123 Gourmet Street, Downtown District, New York, NY 10001",
    phone: "+1 (555) 123-4567",
    notes: "Window seating preferred, celebrating anniversary",
    bookingId: "#BK2024001",
    imageUrl:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Serenity Spa",
    category: "Spa",
    status: "Confirmed",
    date: "Tomorrow, 2:00 PM",
    location: "Wellness Center, Central Park",
    imageUrl:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=300&auto=format&fit=crop",
  },
];

export default function BookingsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = useCallback(async (tab) => {
    try {
      const data = await listMyBookings({ status: tab.toLowerCase(), limit: 50 });
      const items = data?.items ?? data ?? [];
      setBookings(items);
    } catch (err) {
      console.warn("Failed to load bookings:", err.message);
      setBookings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchBookings(activeTab);
  }, [fetchBookings, activeTab]);

  const handleViewDetails = (item) => {
    router.push({
      pathname: "/profile/bookings/details",
      params: {
        id: item.id ?? item._id,
        category: item.provider_type ?? item.category ?? "Restaurant",
        title: item.provider_name ?? item.title ?? "Booking",
        status: item.status,
        date: item.date,
        time: item.time,
        location: item.provider_area ?? item.location ?? "",
        imageUrl: item.provider_image ?? item.imageUrl ?? "",
        guests: item.guests,
        notes: item.special_notes ?? item.notes ?? "",
        bookingId: `#${(item.id ?? item._id ?? "").slice(0, 8).toUpperCase()}`,
      },
    });
  };


  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.COLORS.textPrimary}
          />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>My Bookings</Text>
          <Text style={styles.headerSubtitle}>
            All your upcoming and past plans
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {["Upcoming", "Past"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bookings List */}
      {loading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={theme.COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id ?? item._id ?? String(Math.random())}
          renderItem={({ item }) => (
            <BookingCard
              item={item}
              onViewDetails={() => handleViewDetails(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); fetchBookings(activeTab); }}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No {activeTab.toLowerCase()} bookings</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.COLORS.card,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
    marginRight: 40,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.COLORS.textSecondary,
    marginTop: 2,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: theme.COLORS.card,
    marginHorizontal: 20,
    padding: 6,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: theme.COLORS.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.COLORS.textSecondary,
  },
  activeTabText: {
    color: theme.COLORS.white,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: theme.COLORS.textSecondary,
    fontWeight: "500",
  },
});


