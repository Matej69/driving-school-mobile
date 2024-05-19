import React, { useCallback, useEffect, useRef, useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { ColorSchemeName, Pressable, TouchableOpacity } from 'react-native';

import Colors from '@/app/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import * as Animatable from 'react-native-animatable'
import { ZoomIn, ZoomInLeft } from 'react-native-reanimated';
import { Text } from '@/components/Themed';
import { useTabNavigation } from '../hooks/useTabNavigation';

const colors = require('../../colors');

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}


export default function TabLayout() {
  const { navItemRefs, setActiveTab } = useTabNavigation({initActiveTab: 0});

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
          tabBarActiveTintColor: colors.base,
          title: 'Popis pitanja',
          tabBarIcon: ({ color }) => 
            <Animatable.View ref={(el) => navItemRefs.current[0] = el } animation={'zoomIn'}>
              <TabBarIcon name="book" color={color} />
            </Animatable.View>
        }}
        listeners={{ tabPress: (e) => setActiveTab(0) }}
      />
      <Tabs.Screen
        name="exam-simulation"
        options={{
          tabBarActiveTintColor: colors.base,
          title: 'Simulacija ispita',
          tabBarIcon: ({ color }) => 
            <Animatable.View ref={(el) => navItemRefs.current[1] = el } animation={'zoomIn'}>
              <TabBarIcon name="clipboard" color={color} />
            </Animatable.View>
        }}
        listeners={{ tabPress: (e) => setActiveTab(1) }}
      />
      <Tabs.Screen
        name="finished-exam"
        options={{
          tabBarActiveTintColor: colors.base,
          title: 'Riješeni ispiti',
          tabBarIcon: ({ color }) => 
            <Animatable.View ref={(el) => navItemRefs.current[2] = el } animation={'zoomIn'}>
              <TabBarIcon name="check-square" color={color} />
            </Animatable.View>
        }}
        listeners={{ tabPress: (e) => setActiveTab(2) }}
      />
      <Tabs.Screen
        name="first-aid"
        options={{
          tabBarActiveTintColor: colors.base,
          title: 'Prva pomoć',
          tabBarIcon: ({ color }) => 
            <Animatable.View ref={(el) => navItemRefs.current[3] = el } animation={'zoomIn'}>
              <TabBarIcon name="ambulance" color={color} />
            </Animatable.View>
        }}
        listeners={{ tabPress: (e) => setActiveTab(3) }}
      />
    </Tabs>    
  );
}
