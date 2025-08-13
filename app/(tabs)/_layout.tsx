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
      tabBarButton: HapticTab,
    }}
  />
  <Tabs.Screen
    name="heroes"
    options={{
      title: 'Heróis',
      tabBarButton: HapticTab,
    }}
  />
  <Tabs.Screen
    name="meta"
    options={{
      title: 'Meta',
      tabBarButton: HapticTab,
    }}
  />
  <Tabs.Screen
    name="players"
    options={{
      title: 'Jogadores',
      tabBarButton: HapticTab,
    }}
  />
  <Tabs.Screen
    name="config"
    options={{
      title: 'Configurações',
      tabBarButton: HapticTab,
    }}
  />
  <Tabs.Screen
    name="index"
    options={{
      href: null,
    }}
  />
</Tabs>

  );
}