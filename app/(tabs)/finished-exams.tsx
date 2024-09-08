
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



export default function FinishedExams() {
  const params = useLocalSearchParams<{examDate: string}>();
  const [exams, setExams] = useState<FinishedExam[]>([])
  const [selectedExam, setSelectedExam] = useState<FinishedExam>()
  const { allQuestions } = useStore()
  const { resetParams } = useTabNavigation()

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
        resetParams()
      }
    })()
  }, [])

  const onSelectExam = useCallback((key: Date) => {
    const exam = exams.find(e => e.date === key)
    if(exam)
      setSelectedExam(exam)
  }, [exams])


  return (
    <SafeAreaView style={{ backgroundColor: colors.base, flex:1 }} className='flex flex-col'>
      {
        selectedExam &&
        <FlatList<Question> 
          initialNumToRender={3}
          style={{ backgroundColor: colors.rootBackground, padding: 4, gap: 4 }}
          data={selectedExam?.questions} 
          renderItem={el =>
            <View key={`exam-question-card-${el.item.id}`} style={{ paddingVertical: 4 }}>
              <CardContainer color='base'>
                <QuestionCard question={el.item} answerInteractivityType={'CORRECT_ANSWERED_SHOWN'} incorrectlyAnsweredShown/>
              </CardContainer>
            </View>
          }
          keyExtractor={el => `exam-question-card-${el.id}`} 
        />
      }
      {
        !selectedExam &&
        <FlatList<FinishedExam> 
          initialNumToRender={10}
          style={{ backgroundColor: colors.rootBackground, padding: 4, gap: 4 }}
          data={exams} 
          renderItem={el =>
            <TouchableOpacity onPress={() => onSelectExam(el.item.date)} style={{ paddingVertical: 4 }}>
              <FinishedExamItem date={el.item.date} questions={el.item.questions}></FinishedExamItem>
            </TouchableOpacity>
          }
          keyExtractor={el => el.date.toString()} 
        />
      }
    </SafeAreaView>
  );
}