import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useColorScheme } from "@/hooks/useColorScheme";
import { collection, getDocs } from "firebase/firestore"; // apenas para Web SDK
import { analytics, auth, db } from "../public/data/services/firebase";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Ringbearer: require("../assets/fonts/Ringbearer.ttf"),
  });

  useEffect(() => {
    if (!auth || !db) return;

    auth
      .signInAnonymously()
      .catch((err: any) => {
        console.error("Firebase auth error:", err);
      });

    getDocs(collection(db, "matches"))
      .then((snap) => {
        console.log("matches count:", snap.size);
      })
      .catch((err) => {
        console.error("Firestore error:", err);
      });

    analytics?.logEvent("app_open");
  }, []);

  if (!fontsLoaded) {
    return null;
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
