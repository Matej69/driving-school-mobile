import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Stack, Tabs } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';

const TabIcon = ({icon, name, focused}: {icon: string, name: string, focused: boolean}) => {
  return(
    <View className='bg-slate-600'>
      <View className='w-3 h-3 self-center bg-slate-200'></View>
      <Text className='text-cyan-200'>{name}</Text>
    </View>
  )
}

export default function RootLayout() {
  return (
      <Tabs initialRouteName='finished-exams' screenOptions={{ tabBarActiveTintColor: '#333333', tabBarInactiveTintColor: '#888888', tabBarShowLabel: false, title: 'yoooooo' }}>
        <Tabs.Screen name='exam-simulation' options={{ headerShown: false, tabBarIcon: () => (<TabIcon icon='' name='Simulacija ispita' focused={true}/>)}}/>
        <Tabs.Screen name='finished-exams' options={{headerShown: false, tabBarIcon: () => (<TabIcon icon='' name='Riješeni ispiti' focused={true}/>)}}/>
        <Tabs.Screen name='questions' options={{headerShown: false, tabBarIcon: () => (<TabIcon icon='' name='Pitanja' focused={true}/>)}}/>
        <Tabs.Screen name='first-aid' options={{headerShown: false, tabBarIcon: () => (<TabIcon icon='' name='Prva pomoć' focused={true}/>)}}/>
      </Tabs>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});