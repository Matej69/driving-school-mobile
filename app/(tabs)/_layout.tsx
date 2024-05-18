import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

const activeIconColor = '#0551C3';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarActiveTintColor: activeIconColor,
          title: 'Popis pitanja',
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
        }}
      />
      <Tabs.Screen
        name="exam-simulation"
        options={{
          tabBarActiveTintColor: activeIconColor,
          title: 'Simulacija ispita',
          tabBarIcon: ({ color }) => <TabBarIcon name="clipboard" color={color} />,
        }}
      />
      <Tabs.Screen
        name="finished-exam"
        options={{
          tabBarActiveTintColor: activeIconColor,
          title: 'Riješeni ispiti',
          tabBarIcon: ({ color }) => <TabBarIcon name="check-square" color={color} />,
        }}
      />
      <Tabs.Screen
        name="first-aid"
        options={{
          tabBarActiveTintColor: activeIconColor,
          title: 'Prva pomoć',
          tabBarIcon: ({ color }) => <TabBarIcon name="ambulance" color={color} />,
        }}
      />
    </Tabs>
    
  );
}
