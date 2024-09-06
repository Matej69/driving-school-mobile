import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { createContext, useEffect, useState } from 'react';
import 'react-native-reanimated';
import { GlobalContext } from './context/GlobalContext';
import { Question } from './types/types';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from 'react';
import { storage } from './storage/storage';

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


export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const [questions, setQuestions] = useState<Question[]>([])

  // On initial app load move questions from assets to storage or just load them if it was done before
  useEffect(() => {
    (async() => {
      const loadedQuestions = await loadQuestions() || []
      setQuestions(loadedQuestions)
    })()
  }, [])

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (fontsLoaded && questions) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  return (fontsLoaded && questions) ? <RootLayoutNav questions={questions} /> : null;
}


function RootLayoutNav(p: {questions: Question[]}) {
  return (
    <ThemeProvider value={DefaultTheme}>
      <GlobalContext.Provider value={{ allQuestions: p.questions }}>
        <GestureHandlerRootView style={{flex:1}}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </GestureHandlerRootView>
      </GlobalContext.Provider>
    </ThemeProvider>
  );
}
