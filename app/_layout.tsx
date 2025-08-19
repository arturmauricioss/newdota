import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Text } from "react-native";
import "react-native-reanimated";

import { SafeAreaProvider } from "react-native-safe-area-context";

import { useColorScheme } from "@/hooks/useColorScheme";
import { collection, getDocs } from "firebase/firestore";
import { analytics, auth, db } from "../public/data/services/firebase";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Ringbearer: require("../assets/fonts/Ringbearer.ttf"),
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      console.log("SSR detected — skipping Firebase init");
      return;
    }

    if (!auth || !db) {
      console.log("Firebase not ready");
      return;
    }

    console.log("Starting Firebase auth...");
    auth.signInAnonymously().catch((err: any) => {
      console.error("Firebase auth error:", err);
    });

    console.log("Fetching Firestore matches...");
    getDocs(collection(db, "matches"))
      .then((snap) => {
        console.log("matches count:", snap.size);
      })
      .catch((err) => {
        console.error("Firestore error:", err);
      });

    console.log("Logging analytics...");
    analytics?.logEvent("app_open");
  }, []);

  if (!fontsLoaded) {
    console.log("Fonts not loaded yet");
    return <Text>Carregando fontes...</Text>;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
