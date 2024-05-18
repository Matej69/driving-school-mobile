import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { ColorSchemeName, Pressable } from 'react-native';

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

const backIcon = (colorScheme: ColorSchemeName): any => {
  return(
    <Link href="/modal" asChild>
      <Pressable>
        {({ pressed }) => (
          <FontAwesome
          name="arrow-left"
          size={25}
          color={Colors[colorScheme ?? 'light'].text}
          style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
          />
        )}
      </Pressable>
    </Link>
  )
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      sceneContainerStyle= {{ backgroundColor: 'auto' }}
      screenOptions={{
        headerShown: false,
        tabBarInactiveTintColor: '#ccc',
        tabBarStyle: {
          height: 58,
          borderTopStartRadius: 18,
          borderTopEndRadius: 18
        },
        tabBarIconStyle: {
          marginTop: 6          
        },
        tabBarLabelStyle: {
          fontWeight: 'bold',
          marginBottom: 6
        },
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
