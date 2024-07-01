
import React, { useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePagination } from '../hooks/usePagination';
import { Ionicons } from '@expo/vector-icons';
import { GlobalContext } from '../context/GlobalContext';
import { Question } from '../types/types';
import { CardContainer } from '../components/CardContainer';
import { QuestionCard } from '../components/QuestionCard';

const QUESTIONS_PER_EXAM = 38;

const generateExamQuestions = (questionPool: Question[], amountToGenerate: number): Question[]  => {
  if(questionPool.length < amountToGenerate) {
    alert(`Pool of ${questionPool.length} question can't geenrate ${amountToGenerate} unique questions`)
    return []
  }
  const generatedQuestions: Question[] = []
  while(generatedQuestions.length != amountToGenerate) {
    const randId = Math.floor(Math.random() * (questionPool.length - 1) + 1)
    const alreadyGenerated = generatedQuestions.some(el => el.id == randId)
    if(!alreadyGenerated) {
      generatedQuestions.push({...questionPool[randId]})
    }
  }
  return generatedQuestions
}

export default function ExamSimulationScreen() {
  const { allQuestions } = useContext(GlobalContext);
  const [examQuestions, setExamQuestions] = useState(generateExamQuestions(allQuestions, QUESTIONS_PER_EXAM))
  const { Component: PaginationComponent, firstItemIndexOnPage, lastItemIndexOnPage, setCurrentPage, setItemCount, currentPage } 
  = usePagination({ _currentPage: 1, _itemsCount: QUESTIONS_PER_EXAM, _pageSize: 1});

  const onQuestionsGridOpen = () => alert("open grid stuff")

  const displayedQuestion = examQuestions[currentPage - 1]

  return (
    <SafeAreaView style={{ backgroundColor: colors.base, marginBottom: 48 }} className='flex flex-col'>
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: 10, padding: 6}}>
        <PaginationComponent></PaginationComponent>
        <TouchableOpacity onPress={onQuestionsGridOpen}>
          <Ionicons size={36} color='white' name='menu' />
        </TouchableOpacity>
      </View>
      <ScrollView style={{ backgroundColor: colors.rootBackground, padding: 4 }}>
        <View key={`question-card-${displayedQuestion.id}`}>
          <CardContainer color='base'>
            <QuestionCard question={displayedQuestion} canBeAnswered={true}/>
            </CardContainer>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}