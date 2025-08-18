import { Tabs } from "expo-router";
import React from "react";
import { Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context"; // ✅ Importa os insets

import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

const screenWidth = Dimensions.get("window").width;
const dynamicFontSize = screenWidth < 768 ? 10 : 12;

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets(); // ✅ Usa os insets aqui

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
      <Tabs.Screen
        name="draft"
        options={{
          title: "Draft",
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="heroes"
        options={{
          title: "Heróis",
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="meta"
        options={{
          title: "Meta",
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="players"
        options={{
          title: "Jogadores",
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="config"
        options={{
          title: "Configurações",
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null,
          tabBarIcon: () => null,
        }}
      />
    </Tabs>
  );
}
