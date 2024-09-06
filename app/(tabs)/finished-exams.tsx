
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../colors';
import { storage } from '../async-storage/async-storage';
import { FinishedExam, FinishedExamStorage, Question } from '../types/types';
import { FinishedExamItem } from '../components/FinishedExamItem';
import { storageToFinishedExams } from '../mapper/mapper';
import { GlobalContext } from '../context/GlobalContext';
import { CardContainer } from '../components/CardContainer';
import { QuestionCard } from '../components/QuestionCard';
import { TouchableOpacity } from 'react-native-gesture-handler';


export default function FinishedExams() {
  const [exams, setExams] = useState<FinishedExam[]>([])
  const [selectedExam, setSelectedExam] = useState<FinishedExam>()
  const { allQuestions } = useContext(GlobalContext);


  useEffect(() => {
    (async() => {
      const storageExams = await storage.loadFinishedExams()
      const exams = storageExams ? storageToFinishedExams(storageExams, allQuestions) : []
      setExams(exams)
    })()
  }, [])

  const onSelectExam = useCallback((key: Date) => {
    const exam = exams.find(e => e.date === key)
    if(exam)
      setSelectedExam(exam)
  }, [exams])

  return (
    <SafeAreaView style={{ backgroundColor: colors.base, flex:1 }} className='flex flex-col'>
        <ScrollView style={{ backgroundColor: colors.rootBackground, padding: 4, gap: 4 }}>
          {
            selectedExam
            ?
            selectedExam.questions.map((question: Question) => 
              <View key={`exam-question-card-${question.id}`} style={{ paddingVertical: 4 }}>
                <CardContainer color='base'>
                  <QuestionCard question={question} answerInteractivityType={'CORRECT_ANSWERED_SHOWN'}/>
                </CardContainer>
              </View>
            )
            :
            exams.map((el) =>
              <TouchableOpacity key={el.date.toString()} onPress={() => onSelectExam(el.date)} style={{ paddingVertical: 4 }}>
                <FinishedExamItem date={el.date} questions={el.questions}></FinishedExamItem>
              </TouchableOpacity>
            )
          }
        </ScrollView>
    </SafeAreaView>
  );
}