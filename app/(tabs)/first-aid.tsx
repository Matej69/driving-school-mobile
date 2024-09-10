
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useStore from '../store/store';
import React from 'react';

export default function FirstAid() {

  const { firstAidQuestions } = useStore()

  return (
    <SafeAreaView>
      <Text>{ JSON.stringify(firstAidQuestions) }</Text>
    </SafeAreaView>
  );
}