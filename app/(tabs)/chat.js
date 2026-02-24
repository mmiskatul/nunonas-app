import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../../constants/theme";

// Import Components
import ChatHeader from "../../components/tabs/chat/ChatHeader";
import ChatMessage from "../../components/tabs/chat/ChatMessage";
import ChatInput from "../../components/tabs/chat/ChatInput";

const MOCK_MESSAGES = [
  {
    id: "1",
    sender: "ai",
    text: "Hello! I'm your personal concierge. Tell me what you'd like to do, and I'll help create the perfect plan for you.",
    time: "Just now",
  },
  {
    id: "2",
    sender: "user",
    text: "I want to plan a romantic weekend getaway for my anniversary next month",
    time: "2:34 PM",
  },
  {
    id: "3",
    sender: "ai",
    text: "That sounds wonderful! To create the perfect romantic getaway, I'd love to know:\n• What's your ideal setting? (beach, mountains, city, countryside)\n• Any specific budget range?\n• How far are you willing to travel?",
    time: "2:35 PM",
  },
  {
    id: "4",
    sender: "user",
    text: "Maybe somewhere cozy with a fireplace? We love wine and good food. Budget around $2000",
    time: "2:37 PM",
  },
];

export default function ChatScreen() {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState(MOCK_MESSAGES);

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        sender: "user",
        text: inputText,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMessage]);
      setInputText("");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ChatHeader />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          style={styles.messagesList}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              text={msg.text}
              sender={msg.sender}
              time={msg.time}
            />
          ))}

          {/* Typing Indicator */}
          <ChatMessage sender="ai" isTyping={true} />
        </ScrollView>

        <ChatInput
          value={inputText}
          onChangeText={setInputText}
          onSend={handleSend}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  keyboardView: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 20,
  },
});
