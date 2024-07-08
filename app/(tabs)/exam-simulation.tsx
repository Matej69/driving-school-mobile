
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePagination } from '../hooks/usePagination';
import { Ionicons } from '@expo/vector-icons';
import { GlobalContext } from '../context/GlobalContext';
import { Question } from '../types/types';
import { CardContainer } from '../components/CardContainer';
import { QuestionCard } from '../components/QuestionCard';
import BottomSheet from '@gorhom/bottom-sheet';
import { BottomDrawer } from '../components/BottomDrawer';
import { QuestionsGridSelection } from '../components/QuestionsGridSelection';
import { useExamSimulationQuestionSelection } from '../hooks/useExamSimulationQuestionSelection';

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
  
  const displayedQuestion = examQuestions[currentPage - 1]
  console.log(displayedQuestion.answers)
  
  const { questionGridSelectionItems, updateItemsStyles } = useExamSimulationQuestionSelection({questions: examQuestions, currentlySelectedQuestionId: 1});

  const ref = useRef<BottomSheet>(null);
  const openBottomDrawer = () => ref.current?.expand()
  const onItemClick = (id: number, index: number) => {
    setCurrentPage(index + 1); 
    updateItemsStyles(examQuestions, id)
    ref.current?.close() 
  }

  const onAnswerChange = (newQuestionState: Question) => {
    const questionToChange = examQuestions.find(q => q.id === newQuestionState.id)
    if(questionToChange) {
      questionToChange.answers = [...newQuestionState.answers]
      setExamQuestions([...examQuestions])
    }
  }

  useEffect(() => {
    updateItemsStyles(examQuestions, examQuestions[currentPage - 1].id)
  }, [examQuestions])


  return (
    <SafeAreaView style={{ backgroundColor: colors.base, flex:1 }} className='flex flex-col'>
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: 10, padding: 6}}>
        <PaginationComponent></PaginationComponent>
        <TouchableOpacity onPress={openBottomDrawer}>
          <Ionicons size={36} color='white' name='menu' />
        </TouchableOpacity>
      </View>
      <ScrollView style={{ backgroundColor: colors.rootBackground, padding: 4 }}>
        <View key={`question-card-${displayedQuestion.id}`}>
          <CardContainer color='base'>
            <QuestionCard onAnswerChange={onAnswerChange} question={displayedQuestion} canBeAnswered={true}/>
          </CardContainer>
        </View>
      </ScrollView>
      <BottomDrawer ref={ref}>
        <QuestionsGridSelection 
          onItemClick={onItemClick}
          items={questionGridSelectionItems}/>
      </BottomDrawer>
    </SafeAreaView>
  );
}