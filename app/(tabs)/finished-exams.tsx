
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { asyncStorage } from '../async-storage/async-storage';
import colors from '../colors';
import { FinishedExamItem } from '../components/FinishedExamItem';
import { FinishedExamQuestions } from '../components/FinishedExamQuestions';
import { NoResultItem } from '../components/NoResultItem';
import { useBackHandler } from '../hooks/useBackHandler';
import { useTabNavigation } from '../hooks/useTabNavigation';
import { storageToFinishedExams } from '../mapper/mapper';
import useStore from '../store/store';
import { FinishedExam } from '../types/types';

type ExamScreenType = 'finished-exams' | 'finished-exam-questions'

export default function FinishedExams() {
  const params = useLocalSearchParams<{examDate: string}>();
  const { resetParams } = useTabNavigation()
  const [screenType, setScreenType] = useState<ExamScreenType | null>(null)
  const [exams, setExams] = useState<FinishedExam[]>()
  const [selectedExam, setSelectedExam] = useState<FinishedExam>()
  const { allQuestions } = useStore()
  // Override back button for when we are viewing single exam so it returns to list of exams
  useBackHandler(() => {
    if(screenType == 'finished-exam-questions') {
      setScreenType('finished-exams')
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
        setScreenType('finished-exam-questions')
      }
      else {
        setScreenType('finished-exams')
      }
      // Reset params required so exam list is always loaded whenever we move from another tab to finished exams(date in params doesn't reset automaticaly)
      resetParams()
    })()
  }, [])

  const onSelectExam = useCallback((key: Date) => {
    const exam = exams?.find(e => e.date === key)
    if(exam) {
      setSelectedExam(exam)
      setScreenType('finished-exam-questions')
    }
  }, [exams])

  const insets = useSafeAreaInsets();

  return (
    <View style={{ backgroundColor: colors.base, flex: 1, paddingTop: insets.top }} className='flex flex-col'>
      { /* Exam list */
        screenType === 'finished-exams' &&
        <>
          { /* No results */
            !exams?.length &&
            <NoResultItem/>
          }    
          { /* Exam list */}    
          <FlatList<FinishedExam> 
            initialNumToRender={10}
            style={{ backgroundColor: colors.rootBackground }}
            contentContainerStyle={{ padding: 4, rowGap: 3 }}
            data={exams} 
            renderItem={el =>
              <Animatable.View key={`exam-questions-list-${el.item.date}`} animation={'fadeInDown'} duration={100} delay={50 * (el.index + 1)}>
                <TouchableOpacity onPress={() => onSelectExam(el.item.date)}>
                  <FinishedExamItem date={el.item.date} questions={el.item.questions}></FinishedExamItem>
                </TouchableOpacity>
              </Animatable.View>
            }
            keyExtractor={el => el.date.toString()} 
          />
        </>
      }
      { /* List of questions of a exams */
        screenType === 'finished-exam-questions' &&
        <FinishedExamQuestions questions={selectedExam?.questions ?? []}/>
      }
      { /* View with rootBackground so that header with flex does not flicker whole page with blue on init */ }
      <View style={{ backgroundColor: colors.rootBackground, flex: 1 }}></View>
    </View>
  );
}