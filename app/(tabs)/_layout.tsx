import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
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
          fontSize: 12,
          textAlign: 'center',
          flexWrap: 'nowrap',
        },
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="draft"
        options={{
          title: 'Draft',
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol size={28} name="person.3.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="heroes"
        options={{
          title: 'Heróis',
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol size={28} name="person.3.fill" color={color} />
          ),
        }}
      />

            <Tabs.Screen
        name="meta"
        options={{
          title: 'Meta',
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol size={28} name="person.3.fill" color={color} />
          ),
        }}
      />
            <Tabs.Screen
        name="players"
        options={{
          title: 'Jogadores',
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol size={28} name="person.3.fill" color={color} />
          ),
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
