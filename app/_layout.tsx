// app/_layout.tsx

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
// Ajuste para o caminho real do seu services
import { analytics, auth, db } from "../public/data/services";

// Se você estiver usando o SDK Web, pode importar estes tipos:
// import type { QuerySnapshot, DocumentData } from "firebase/firestore";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Ringbearer: require("../assets/fonts/Ringbearer.ttf"),
  });

  useEffect(() => {
    auth
      .signInAnonymously()
      .catch((err: any) => {
        console.error("Firebase auth error:", err);
      });

    db.collection("matches")
      .get()
      .then(
        // Se quiser usar tipos do SDK Web:
        // (snap: QuerySnapshot<DocumentData>) => console.log("matches:", snap.size)
        (snap: any) => {
          console.log("matches count:", snap.size);
        }
      )
      .catch((err: any) => {
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
