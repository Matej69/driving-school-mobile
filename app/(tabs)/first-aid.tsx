
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
    <SafeAreaView>
        <FlatList<FirstAidQuestion> 
          initialNumToRender={10}
          style={{ backgroundColor: colors.rootBackground, padding: 4, gap: 4 }}
          data={firstAidQuestions} 
          renderItem={el =>
            <View style={{ paddingVertical: 2 }}>
              <FirstAidQuestionItem key={`first-aid-q-${el.item.question}`} q={el.item}/>
            </View>
          }
          keyExtractor={q => q.question} 
        />
    </SafeAreaView>
  );
}