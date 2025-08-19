import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import TabBarBackground from "../../components/ui/TabBarBackground";
import { Colors } from "../../constants/Colors";
import { useColorScheme } from "../../hooks/useColorScheme";

// 👉 importa só a função, sem expor unions de tipo
import { initFirestore } from "@/firebase";

const screenWidth = Dimensions.get("window").width;
const dynamicFontSize = screenWidth < 768 ? 10 : 12;

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    initFirestore().catch(console.error);
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarBackground: TabBarBackground,
        tabBarLabelStyle: {
          fontSize: dynamicFontSize,
          textAlign: "center",
        },
        tabBarStyle: {
          height: 70 + insets.bottom,
          paddingBottom: insets.bottom,
          backgroundColor: "#1e1e2f",
          borderTopWidth: 1,
        },
      }}
    >
      {/* suas telas */}
    </Tabs>
  );
}
