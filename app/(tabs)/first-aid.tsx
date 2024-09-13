
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useStore from '../store/store';
import React, { useMemo } from 'react';
import { FirstAidQuestion } from '../types/types';
import { FirstAidQuestionItem } from '../components/FirstAidQuestionItem';
import colors from '../colors';

export default function FirstAid() {

  const { firstAidQuestions } = useStore()

  return (
    <SafeAreaView style={{ backgroundColor: colors.base, flex:1 }} className='flex flex-col'>
      <FlatList<FirstAidQuestion> 
        initialNumToRender={10}
        style={{ backgroundColor: colors.rootBackground }}
        contentContainerStyle={{ padding: 4, rowGap: 3}}
        data={firstAidQuestions}
        renderItem={el =>
            <FirstAidQuestionItem key={`first-aid-q-${el.item.question}`} q={el.item}/>
        }
        keyExtractor={q => q.question} 
      />
    </SafeAreaView>
  );
}