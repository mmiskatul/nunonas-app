import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import theme from "../../../constants/theme";

const ticketsData = [
  {
    id: "#SP-2024-001",
    title: "Payment not processed",
    date: "Jan 15, 2026",
    status: "Resolved",
    statusColor: theme.COLORS.success,
  },
  {
    id: "#SP-2024-002",
    title: "App crashes on booking",
    date: "Jan 18, 2026",
    status: "In Progress",
    statusColor: "#B45309", // Amber-700
  },
  {
    id: "#SP-2024-003",
    title: "Promo code not working",
    date: "Jan 20, 2026",
    status: "Open",
    statusColor: theme.COLORS.primary,
  },
];

const SupportTicketItem = ({ ticket }) => (
  <View style={styles.ticketCard}>
    <View style={styles.ticketHeader}>
      <Text style={styles.ticketId}>{ticket.id}</Text>
      <Text style={[styles.ticketStatus, { color: ticket.statusColor }]}>
        {ticket.status}
      </Text>
    </View>
    <Text style={styles.ticketTitle}>{ticket.title}</Text>
    <Text style={styles.ticketDate}>{ticket.date}</Text>
  </View>
);

export default function SupportScreen() {
  const router = useRouter();
  const [issueType, setIssueType] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme.COLORS.textPrimary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.introText}>How can we help you today?</Text>

        {/* Issue Selection */}
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>
            {issueType || "Select an issue type"}
          </Text>
          <Ionicons
            name="chevron-down"
            size={20}
            color={theme.COLORS.textPrimary}
          />
        </TouchableOpacity>

        {/* Support Request Form */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Submit Support Request</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Subject</Text>
            <TextInput
              style={styles.input}
              placeholder="Brief description of your issue"
              placeholderTextColor={theme.COLORS.textSecondary}
              value={subject}
              onChangeText={setSubject}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Please provide detailed information about your issue..."
              placeholderTextColor={theme.COLORS.textSecondary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
          </View>
        </View>

        {/* Support Tickets Section */}
        <View style={styles.ticketsSection}>
          <Text style={styles.sectionTitle}>My Support Tickets</Text>
          {ticketsData.map((ticket, index) => (
            <SupportTicketItem key={index} ticket={ticket} />
          ))}
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit Support Request</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  introText: {
    fontSize: 16,
    color: theme.COLORS.textSecondary,
    marginBottom: 15,
    fontWeight: "500",
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.COLORS.border,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: theme.COLORS.white,
    marginBottom: 25,
    ...theme.SHADOWS.card,
  },
  dropdownText: {
    fontSize: 16,
    color: theme.COLORS.textPrimary,
    fontWeight: "500",
  },
  formCard: {
    backgroundColor: theme.COLORS.white,
    borderWidth: 1,
    borderColor: theme.COLORS.border,
    borderRadius: 20,
    padding: 24,
    marginBottom: 30,
    ...theme.SHADOWS.card,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.COLORS.textSecondary,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: theme.COLORS.textPrimary,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  textArea: {
    minHeight: 120,
    paddingTop: 12,
  },
  ticketsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
    marginBottom: 15,
  },
  ticketCard: {
    backgroundColor: theme.COLORS.white,
    borderWidth: 1,
    borderColor: theme.COLORS.border,
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    ...theme.SHADOWS.card,
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  ticketId: {
    fontSize: 15,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
  },
  ticketStatus: {
    fontSize: 13,
    fontWeight: "700",
  },
  ticketTitle: {
    fontSize: 15,
    color: theme.COLORS.textSecondary,
    marginBottom: 4,
  },
  ticketDate: {
    fontSize: 13,
    color: theme.COLORS.textSecondary,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: theme.COLORS.white,
  },
  submitButton: {
    backgroundColor: theme.COLORS.primary,
    height: 60,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    ...theme.SHADOWS.primary,
  },
  submitButtonText: {
    color: theme.COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
