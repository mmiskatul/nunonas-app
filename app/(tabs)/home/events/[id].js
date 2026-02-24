import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import theme from "../../../../constants/theme";

// Import Details Components
import EventImageHeader from "../../../../components/tabs/home/events/details/EventImageHeader";
import EventKeyInfo from "../../../../components/tabs/home/events/details/EventKeyInfo";
import EventAbout from "../../../../components/tabs/home/events/details/EventAbout";
import EventLocationMap from "../../../../components/tabs/home/events/details/EventLocationMap";
import EventFooter from "../../../../components/tabs/home/events/details/EventFooter";

const MOCK_EVENTS = {
  1: {
    id: 1,
    title: "Electronic Music Festival 2026",
    date: "Saturday, March 23",
    time: "8:00 PM - 2:00 AM",
    location: "Doha Convention Center",
    tag: "Trending Tonight",
    image: require("../../../../assets/images/events.webp"),
  },
  2: {
    id: 2,
    title: "Comedy Night Live",
    date: "Today",
    time: "9:30 PM",
    location: "The Laugh Factory",
    tag: "Tonight",
    image: require("../../../../assets/images/events.webp"),
  },
};

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams();
  const event = MOCK_EVENTS[id] || MOCK_EVENTS["1"];

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <EventImageHeader event={event} />
        <EventKeyInfo event={event} />
        <EventAbout />
        <EventLocationMap />
      </ScrollView>
      <EventFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
