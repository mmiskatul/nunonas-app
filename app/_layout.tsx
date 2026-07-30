// @ts-nocheck
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { focusManager, QueryClientProvider } from "@tanstack/react-query";
import { AppState } from "react-native";
import { useEffect } from "react";
import { store } from "../store/store";
import { queryClient } from "../lib/queryClient";

export default function RootLayout() {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      focusManager.setFocused(state === "active");
    });
    return () => subscription.remove();
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </SafeAreaProvider>
      </QueryClientProvider>
    </Provider>
  );
}


