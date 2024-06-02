import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { createContext, useEffect } from 'react';
import 'react-native-reanimated';
import { GlobalContext } from './context/GlobalContext';
import { Question } from './types/types';

SplashScreen.preventAutoHideAsync();


export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  const questions = require('../assets/all-questions.json');

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
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </GlobalContext.Provider>
    </ThemeProvider>
  );
}
