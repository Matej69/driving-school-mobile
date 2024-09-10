import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { createContext, useEffect, useState } from 'react';
import 'react-native-reanimated';
import { FirstAidQuestion, Question } from './types/types';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from 'react';
import { storage } from './storage/storage';
import useStore from './store/store';

SplashScreen.preventAutoHideAsync();

const loadQuestions = async (): Promise<Question[] | undefined> => {
  const questionsExist = await storage.fileExist('questions')
  if(questionsExist) {
    return storage.loadQuestions()
  }
  const questionsFromAssets: Question[] = require('../assets/questions.json');
  const saved = await storage.saveQuestions(questionsFromAssets)
  return saved ? (await storage.loadQuestions()) : undefined
}

const loadFirstAidQuestions = async (): Promise<FirstAidQuestion[] | undefined> => {
  const questionsExist = await storage.fileExist('first-aid-questions')
  if(questionsExist) {
    return storage.loadFirstAidQuestions()
  }
  const questionsFromAssets: FirstAidQuestion[] = require('../assets/first-aid-questions.json');
  const saved = await storage.saveFirstAidQuestions(questionsFromAssets)
  return saved ? (await storage.loadFirstAidQuestions()) : undefined
}


export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const { 
    allQuestions, setAllQuestions,
    firstAidQuestions, setFirstAidQuestions
  } = useStore()

  // On initial app load move questions from assets to storage or just load them if it was done before
  useEffect(() => {
    (async() => {
      const [loadedQuestions, loadedFirstAidQuestions] = await Promise.all([
        loadQuestions(),
        loadFirstAidQuestions()
      ]);
      setAllQuestions(loadedQuestions || [])
      setFirstAidQuestions(loadedFirstAidQuestions || [])
    })()
  }, [])

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (fontsLoaded && allQuestions) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  return (fontsLoaded && allQuestions && firstAidQuestions) ? <RootLayoutNav /> : null;
}


function RootLayoutNav() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <GestureHandlerRootView style={{flex:1}}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
        </Stack>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
