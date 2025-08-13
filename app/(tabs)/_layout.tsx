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
// flexWrap: 'nowrap',
},
tabBarStyle: {
  height: 50,
  paddingBottom: Platform.OS === 'android' ? 4 : 6,
  paddingTop: Platform.OS === 'android' ? 4 : 6,
  backgroundColor: '#1e1e2f',
  borderTopWidth: 0,
  borderTopColor: '#1e1e2f',
},

}}
>
<Tabs.Screen
name="draft"
options={{
title: 'Draft',
tabBarIcon: () => null,
}}
/>

<Tabs.Screen
name="heroes"
options={{
title: 'Heróis',
tabBarIcon: () => null,
}}
/>

<Tabs.Screen
name="meta"
options={{
title: 'Meta',
tabBarIcon: () => null,
}}
/>
<Tabs.Screen
name="players"
options={{
title: 'Jogadores',
tabBarIcon: () => null,
}}
      />
                  <Tabs.Screen
        name="config"
        options={{
          title: 'Configurações',
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol size={0} name="person.3.fill" color={color} />
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