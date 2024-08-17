
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePagination } from '../hooks/usePagination';
import { Ionicons } from '@expo/vector-icons';
import { GlobalContext } from '../context/GlobalContext';
import { AnswerInteractivityType, Question } from '../types/types';
import { CardContainer } from '../components/CardContainer';
import { QuestionCard } from '../components/QuestionCard';
import BottomSheet from '@gorhom/bottom-sheet';
import { BottomDrawer } from '../components/BottomDrawer';
import { QuestionsGridSelection } from '../components/QuestionsGridSelection';
import { useExamSimulationQuestionSelection } from '../hooks/useExamSimulationQuestionSelection';
import { util } from 'prettier';
import { deepCopy } from '../utils/utils';

const QUESTIONS_PER_EXAM = 38;

const generateExamQuestions = (questionPool: Question[], amountToGenerate: number): Question[]  => {
  if(questionPool.length < amountToGenerate) {
    alert(`Pool of ${questionPool.length} question can't geenrate ${amountToGenerate} unique questions`)
    return []
  }
  const generatedQuestions: Question[] = []
  while(generatedQuestions.length != amountToGenerate) {
    const randIndex = Math.floor(Math.random() * (questionPool.length - 1) + 1)
    const alreadyGenerated = generatedQuestions.some(el => el.id == questionPool[randIndex].id)
    if(!alreadyGenerated) {
      generatedQuestions.push({...questionPool[randIndex]})
    }
  }
  return generatedQuestions
}

export default function ExamSimulationScreen() {
  const { allQuestions } = useContext(GlobalContext);
  const [examQuestions, setExamQuestions] = useState(generateExamQuestions(allQuestions, QUESTIONS_PER_EXAM))
  const { Component: PaginationComponent, firstItemIndexOnPage, lastItemIndexOnPage, setCurrentPage, setItemCount, currentPage } 
  = usePagination({ _currentPage: 1, _itemsCount: QUESTIONS_PER_EXAM, _pageSize: 1});
  
  const { questionGridSelectionItems, updateItemsStyles } = useExamSimulationQuestionSelection({questions: examQuestions, currentlySelectedQuestionId: 1});
  
  // Keeps track of changes and is displayed but not saved until we go to another question
  const [displayedNonSavedQuestion, setDisplayedNonSavedQuestion] = useState(deepCopy(examQuestions[currentPage - 1]))
  
  const answerInteractivityType: AnswerInteractivityType = examQuestions[currentPage - 1].answers.some(a => a.checked) ? 'ANSWERED_AND_DISABLED' : 'CAN_BE_ANSWERED'

  const saveQuestionAnswers = (): Question[]  => {
    const questionToChange = examQuestions.find(q => q.id === displayedNonSavedQuestion.id)
    let newExamQuestions: Question[] = []
    if(questionToChange) {
      questionToChange.answers = [...displayedNonSavedQuestion.answers]
      newExamQuestions = [...examQuestions] 
      setExamQuestions(newExamQuestions)
    }
    return newExamQuestions
  }

  const ref = useRef<BottomSheet>(null);
  const openBottomDrawer = () => ref.current?.expand()
  const onGridItemClick = (id: number, index: number) => {
    setCurrentPage(index + 1);
    ref.current?.close()
  }


  const onAnswerChange = (newQuestionState: Question) => {
    setDisplayedNonSavedQuestion(deepCopy({...newQuestionState}))
  }



  useEffect(() => {
    const newExamQuestions = saveQuestionAnswers()
    setDisplayedNonSavedQuestion(deepCopy(newExamQuestions[currentPage - 1]))
    const selectedQId = newExamQuestions[currentPage - 1].id
    updateItemsStyles(newExamQuestions, selectedQId)
  }, [currentPage])




  return (
    <SafeAreaView style={{ backgroundColor: colors.base, flex:1 }} className='flex flex-col'>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: 10, padding: 6}}>
          <PaginationComponent></PaginationComponent>
          <TouchableOpacity onPress={openBottomDrawer}>
            <Ionicons size={36} color='white' name='menu' />
          </TouchableOpacity>
        </View>
      <ScrollView style={{ backgroundColor: colors.rootBackground, padding: 4 }}>
        <View key={`question-card-${displayedNonSavedQuestion.id}`}>
          <CardContainer color='base'>
            <QuestionCard onAnswerChange={onAnswerChange} question={displayedNonSavedQuestion} answerInteractivityType={answerInteractivityType}/>
          </CardContainer>
        </View>
      </ScrollView>
      <BottomDrawer ref={ref}>
        <QuestionsGridSelection 
          onItemClick={onGridItemClick}
          items={questionGridSelectionItems}/>
      </BottomDrawer>
    </SafeAreaView>
  );
}