import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';

import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarLabelStyle: {
          fontSize: 14,
          textAlign: 'center',
          marginBottom: 0,
        },
        tabBarStyle: {
          height: 50,
          paddingBottom: Platform.OS === 'android' ? 4 : 6,
          backgroundColor: '#1e1e2f',
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="draft"
        options={{
          title: 'Draft',
        }}
      />
      <Tabs.Screen
        name="heroes"
        options={{
          title: 'Heróis',
        }}
      />
      <Tabs.Screen
        name="meta"
        options={{
          title: 'Meta',
        }}
      />
      <Tabs.Screen
        name="players"
        options={{
          title: 'Jogadores',
        }}
      />
      <Tabs.Screen
        name="config"
        options={{
          title: 'Configurações',
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null, // ❌ remove da tab bar
        }}
      />
    </Tabs>
  );
}