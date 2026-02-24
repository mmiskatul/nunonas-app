import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../../../../constants/theme";

// Import Events Components
import EventSearchBar from "../../../../components/tabs/home/events/EventSearchBar";
import EventFilterToggle from "../../../../components/tabs/home/events/EventFilterToggle";
import CategoryFilters from "../../../../components/tabs/home/events/CategoryFilters";
import EventCard from "../../../../components/tabs/home/events/EventCard";

const EVENTS_DATA = [
  {
    id: 1,
    title: "Electric Dreams Festival",
    date: "Sat, Feb 28",
    time: "8:00 PM",
    location: "Doha Convention Center",
    distance: "2.3 km",
    tag: "Trending",
    tagColor: "#ef4444",
    image: require("../../../../assets/images/events.webp"),
  },
  {
    id: 2,
    title: "Comedy Night Live",
    date: "Today",
    time: "9:30 PM",
    location: "The Laugh Factory",
    distance: "2.3 km",
    tag: "Tonight",
    tagColor: "#f97316",
    image: require("../../../../assets/images/events.webp"),
  },
  {
    id: 3,
    title: "Modern Art Showcase",
    date: "Sun, Dec 29",
    time: "10:00 AM",
    location: "National Art Gallery",
    distance: "2.3 km",
    tag: "Free",
    tagColor: "#10b981",
    image: require("../../../../assets/images/events.webp"),
  },
  {
    id: 4,
    title: "Family Fun Carnival",
    date: "Sat, Feb 28",
    time: "2:00 PM",
    location: "City Park Arena",
    distance: "3.3 km",
    image: require("../../../../assets/images/events.webp"),
  },
  {
    id: 5,
    title: "Jazz Under The Stars",
    date: "Fri, Feb 27",
    time: "7:00 PM",
    location: "Rooftop Lounge",
    distance: "0.3 km",
    image: require("../../../../assets/images/events.webp"),
  },
];

export default function EventsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <EventSearchBar />
        <EventFilterToggle />
        <CategoryFilters />
        <View style={styles.list}>
          {EVENTS_DATA.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  list: {
    paddingTop: 5,
    paddingBottom: 20,
  },
});
