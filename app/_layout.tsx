import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { createContext, useEffect, useState } from 'react';
import 'react-native-reanimated';
import { FirstAidQuestion, ImagesMetadata, Question } from './types/types';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from 'react';
import { storage } from './storage/storage';
import useStore from './store/store';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native';

SplashScreen.preventAutoHideAsync();

// Reseting storage and async storage when needed
// storage.reset()
// AsyncStorage.clear();

const loadQuestions = async (): Promise<Question[] | undefined> => {
  const questionsExist = await storage.fileExist('questions')
  if(questionsExist) {
    return storage.loadQuestions()
  }
  const questionsFromAssets: Question[] = require('../assets/questions.json');
  const saved = await storage.saveQuestions(questionsFromAssets)
  return saved ? (await storage.loadQuestions()) : undefined
}

// First aid will not be ever updated so moving to storage might make no sense - its like this due to consistency
const loadFirstAidQuestions = async (): Promise<FirstAidQuestion[] | undefined> => {
  const questionsExist = await storage.fileExist('first-aid-questions')
  if(questionsExist) {
    return storage.loadFirstAidQuestions()
  }
  const questionsFromAssets: FirstAidQuestion[] = require('../assets/first-aid-questions.json');
  const saved = await storage.saveFirstAidQuestions(questionsFromAssets)
  return saved ? (await storage.loadFirstAidQuestions()) : undefined
}


const loadImagesMetadata = async (): Promise<ImagesMetadata> => {
  const objFromAssets = require('../assets/image-metadata.json');
  return new Map(Object.entries(objFromAssets)) as ImagesMetadata
}


export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const { 
    allQuestions, setAllQuestions,
    firstAidQuestions, setFirstAidQuestions,
    imagesMetadata, setImagesMetadata
  } = useStore()

  // On initial app load move questions from assets to storage or just load them if it was done before
  useEffect(() => {
    (async() => {
      // Questions loading
      const [loadedQuestions, loadedFirstAidQuestions, loadedImagesMetadata] = await Promise.all([
        loadQuestions(),
        loadFirstAidQuestions(),
        loadImagesMetadata()
      ]);
      setAllQuestions(loadedQuestions || [])
      setFirstAidQuestions(loadedFirstAidQuestions || [])
      setImagesMetadata(loadedImagesMetadata)
    })()
  }, [])
  
  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);
  
  const assetsLoaded = fontsLoaded && imagesMetadata && allQuestions.length > 0 && firstAidQuestions.length > 0
  
  if(assetsLoaded)
    SplashScreen.hideAsync();
  
  return assetsLoaded ? <RootLayoutNav /> : null;
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
