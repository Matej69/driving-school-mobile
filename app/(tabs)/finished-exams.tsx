
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../colors';
import { storage } from '../async-storage/async-storage';
import { FinishedExam, FinishedExamStorage } from '../types/types';
import { FinishedExamItem } from '../components/FinishedExamItem';
import { storageToFinishedExams } from '../mapper/mapper';
import { GlobalContext } from '../context/GlobalContext';


export default function FinishedExams() {
  const [exams, setExams] = useState<FinishedExam[]>([])
  const { allQuestions } = useContext(GlobalContext);


  useEffect(() => {
    (async() => {
      const storageExams = await storage.loadFinishedExams()
      const exams = storageExams ? storageToFinishedExams(storageExams, allQuestions) : []
      setExams(exams)
    })()
  }, [])

  return (
    <SafeAreaView style={{ backgroundColor: colors.base, flex:1 }} className='flex flex-col'>
        <ScrollView style={{ backgroundColor: colors.rootBackground, padding: 4, gap: 4 }}>
          {
            exams.map((el: FinishedExam) => 
              <View key={el.date.toString()} style={{ paddingVertical: 4 }}>
                <FinishedExamItem date={el.date} questions={el.questions}></FinishedExamItem>
              </View>
            )
          }
        </ScrollView>
    </SafeAreaView>
  );
}