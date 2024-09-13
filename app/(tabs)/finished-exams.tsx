
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../colors';
import { asyncStorage } from '../async-storage/async-storage';
import { FinishedExam, FinishedExamStorage, Question } from '../types/types';
import { FinishedExamItem } from '../components/FinishedExamItem';
import { storageToFinishedExams } from '../mapper/mapper';
import { CardContainer } from '../components/CardContainer';
import { QuestionCard } from '../components/QuestionCard';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useLocalSearchParams } from "expo-router";
import { useTabNavigation } from '../hooks/useTabNavigation';
import useStore from '../store/store';
import { SkeletonList } from '../components/SkeletonList';
import { isQuestionAnsweredCorrectly } from '../utils/utils';
import { useBackHandler } from '../hooks/useBackHandler';

type ScreenType = 'finished-exam-list' | 'finished-exam-single'

export default function FinishedExams() {
  const params = useLocalSearchParams<{examDate: string}>();
  const { resetParams } = useTabNavigation()
  const [screenType, setScreenType] = useState<ScreenType | null>(null)
  const [exams, setExams] = useState<FinishedExam[]>()
  const [selectedExam, setSelectedExam] = useState<FinishedExam>()
  const { allQuestions } = useStore()
  // Override back button for when we are viewing single exam so it returns to list of exams
  useBackHandler(() => {
    if(screenType == 'finished-exam-single') {
      setScreenType('finished-exam-list')
      return true
    }
    return false
  })

  useEffect(() => {
    (async() => {
      // Load all exams
      const storageExams = await asyncStorage.loadFinishedExams()
      const exams = storageExams ? storageToFinishedExams(storageExams, allQuestions) : []
      setExams(exams)
      // Load specific exam that should be displayed - param is received by finishing exam
      if(params.examDate) {
        const examDateAsDate = new Date(params.examDate)
        const targetExam = exams.find(e => e.date.getTime() === examDateAsDate.getTime())
        setSelectedExam(targetExam)
        setScreenType('finished-exam-single')
      }
      else {
        setScreenType('finished-exam-list')
      }
      // Reset params required so exam list is always loaded whenever we move from another tab to finished exams(date in params doesn't reset automaticaly)
      resetParams()
    })()
  }, [])

  const onSelectExam = useCallback((key: Date) => {
    const exam = exams?.find(e => e.date === key)
    if(exam) {
      setSelectedExam(exam)
      setScreenType('finished-exam-single')
    }
  }, [exams])


  return (
    <SafeAreaView style={{ backgroundColor: colors.base, flex:1 }} className='flex flex-col'>
      {
        !screenType &&
        <SkeletonList itemsNumber={10}/>
      }
      {
        screenType === 'finished-exam-list' &&
        <FlatList<FinishedExam> 
          initialNumToRender={10}
          style={{ backgroundColor: colors.rootBackground }}
          contentContainerStyle={{ padding: 4, rowGap: 3 }}
          data={exams} 
          renderItem={el =>
            <TouchableOpacity onPress={() => onSelectExam(el.item.date)}>
              <FinishedExamItem date={el.item.date} questions={el.item.questions}></FinishedExamItem>
            </TouchableOpacity>
          }
          keyExtractor={el => el.date.toString()} 
        />
      }
      {
        screenType === 'finished-exam-single' &&
        <FlatList<Question> 
          initialNumToRender={3}
          style={{ backgroundColor: colors.rootBackground }}
          contentContainerStyle={{ padding: 4, rowGap: 3 }}
          data={selectedExam?.questions} 
          renderItem={el =>
            <View key={`exam-question-card-${el.item.id}`}>
              <CardContainer color={isQuestionAnsweredCorrectly(el.item) ? 'success' : 'failure'}>
                <QuestionCard question={el.item} answerInteractivityType={'CORRECT_ANSWERED_SHOWN'} incorrectlyAnsweredShown/>
              </CardContainer>
            </View>
          }
          keyExtractor={el => `exam-question-card-${el.id}`} 
        />
      }
    </SafeAreaView>
  );
}