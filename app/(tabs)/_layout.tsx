import React, { useCallback, useEffect, useRef, useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';

import * as Animatable from 'react-native-animatable'
import { useTabNavigation } from '../hooks/useTabNavigation';
import { NavigationRoutes, NavigationRoutesKeys } from '../types/types';

const colors = require('../colors');

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}


export default function TabLayout() {
  const { navItemRefs, setActiveTab } = useTabNavigation();

  return (
    <Tabs
      sceneContainerStyle= {{ backgroundColor: 'auto' }}
      screenOptions={{
        headerShown: false,
        tabBarInactiveTintColor: '#ccc',
        tabBarStyle: {
          height: 58,
          borderTopStartRadius: 18,
          borderTopEndRadius: 18,
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
            <Animatable.View ref={(el) => navItemRefs.current[NavigationRoutes['index']] = el } animation={'zoomIn'}>
              <TabBarIcon name="book" color={color} />
            </Animatable.View>
        }}
        listeners={{ tabPress: (e) => setActiveTab('index') }}
      />
      <Tabs.Screen
        name="exam-simulation"
        options={{          
          tabBarActiveTintColor: colors.base,
          title: 'Simulacija ispita',
          tabBarIcon: ({ color }) => 
            <Animatable.View ref={(el) => navItemRefs.current[NavigationRoutes['exam-simulation']] = el } animation={'zoomIn'}>
              <TabBarIcon name="clipboard" color={color} />
            </Animatable.View>
        }}
        listeners={{ tabPress: (e) => setActiveTab('exam-simulation') }}
      />
      <Tabs.Screen
        name="finished-exam"
        options={{
          tabBarActiveTintColor: colors.base,
          title: 'Riješeni ispiti',
          tabBarIcon: ({ color }) => 
            <Animatable.View ref={(el) => navItemRefs.current[NavigationRoutes['finished-exam']] = el } animation={'zoomIn'}>
              <TabBarIcon name="check-square" color={color} />
            </Animatable.View>
        }}
        listeners={{ tabPress: (e) => setActiveTab('finished-exam') }}
      />
      <Tabs.Screen
        name="first-aid"
        options={{
          tabBarActiveTintColor: colors.base,
          title: 'Prva pomoć',
          tabBarIcon: ({ color }) => 
            <Animatable.View ref={(el) => navItemRefs.current[NavigationRoutes['first-aid']] = el } animation={'zoomIn'}>
              <TabBarIcon name="ambulance" color={color} />
            </Animatable.View>
        }}
        listeners={{ tabPress: (e) => setActiveTab('first-aid') }}
      />
    </Tabs>    
  );
}
