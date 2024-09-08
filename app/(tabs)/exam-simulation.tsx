
import React, { Fragment, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePagination } from '../hooks/usePagination';
import { Ionicons } from '@expo/vector-icons';
import { AnswerInteractivityType, Question } from '../types/types';
import { CardContainer } from '../components/CardContainer';
import { QuestionCard } from '../components/QuestionCard';
import BottomSheet from '@gorhom/bottom-sheet';
import { BottomDrawer } from '../components/BottomDrawer';
import { QuestionsGridSelection } from '../components/QuestionsGridSelection';
import { useExamSimulationQuestionSelection } from '../hooks/useExamSimulationQuestionSelection';
import { util } from 'prettier';
import { deepCopy, isQuestionAnswered, updateQuestionsWrongAnswers } from '../utils/utils';
import { DsModal } from '../components/Modal';
import { useTabNavigation } from '../hooks/useTabNavigation';
import useStore from '../store/store';
import { useNavigation } from '@react-navigation/native';
import { asyncStorage } from '../async-storage/async-storage';
import { finishedExamToStorage } from '../mapper/mapper';
import { storage } from '../storage/storage';

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
      const generatedQuestion = {...questionPool[randIndex]}
      generatedQuestion.answers.forEach(a => a.checked = false);
      generatedQuestions.push(generatedQuestion)
    }
  }
  return generatedQuestions
}

export default function ExamSimulationScreen() {
  const { activeTab, navigate } = useTabNavigation()
  
  const { allQuestions, setAllQuestions } = useStore()
  const [examQuestions, setExamQuestions] = useState(generateExamQuestions(allQuestions, QUESTIONS_PER_EXAM))
  const { Component: PaginationComponent, firstItemIndexOnPage, lastItemIndexOnPage, setCurrentPage, setItemCount, currentPage } 
  = usePagination({ _currentPage: 1, _itemsCount: QUESTIONS_PER_EXAM, _pageSize: 1});
  
  const { questionGridSelectionItems, updateItemsStyles } = useExamSimulationQuestionSelection({questions: examQuestions, currentlySelectedQuestionId: 1});
  
  // Keeps track of changes and is displayed but not saved until we go to another question
  const [displayedNonSavedQuestion, setDisplayedNonSavedQuestion] = useState(deepCopy(examQuestions[currentPage - 1]))

  const [finishExamModalActive, setFinishExamModalActive] = useState(false)
  
  const getAnswerInteractivityType = (): AnswerInteractivityType => {
    return isQuestionAnswered(examQuestions[currentPage - 1]) ? 'ANSWERED_AND_DISABLED' : 'CAN_BE_ANSWERED'
  }

  const [answerInteractivityType, setAnswerInteractivityType] = useState<AnswerInteractivityType>(getAnswerInteractivityType())


  const saveNonSavedDisplayedToQuestionAnswers = (): Question[]  => {
    const questionToChange = examQuestions.find(q => q.id === displayedNonSavedQuestion.id)
    let newExamQuestions: Question[] = []
    if(questionToChange) {
      questionToChange.answers = [...displayedNonSavedQuestion.answers]
      newExamQuestions = [...examQuestions]
      setExamQuestions(newExamQuestions)
    }
    return newExamQuestions
  }

  const gridSelectionRef = useRef<BottomSheet>(null);
  const openBottomDrawer = () => gridSelectionRef.current?.expand()
  const onGridItemClick = (id: number, index: number) => {
    setCurrentPage(index + 1);
    gridSelectionRef.current?.close()
  }


  const onAnswerChange = (newQuestionState: Question) => {
    setDisplayedNonSavedQuestion(deepCopy(newQuestionState))
  }


  useEffect(() => {
    const newExamQuestions = saveNonSavedDisplayedToQuestionAnswers()
    setDisplayedNonSavedQuestion(deepCopy(newExamQuestions[currentPage - 1]))
    const selectedQId = newExamQuestions[currentPage - 1].id
    updateItemsStyles(newExamQuestions, selectedQId)
    setAnswerInteractivityType(getAnswerInteractivityType())
  }, [currentPage])

  

  const onFinishExamClick = useCallback(() => {
    gridSelectionRef.current?.close()
    setFinishExamModalActive(true)
  }, [])
  
  const questionGridBottomActions = useMemo(() => {
    return(
      <TouchableOpacity onPress={onFinishExamClick} style={{ width: '100%', backgroundColor: colors.base, padding: 14, borderRadius: 6, marginTop: 8, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>ZAVRŠI ISPIT</Text>
      </TouchableOpacity>
    )
  }, [])



  const onFinishExamConfirmationClick = async() => {
    // Save exam to storage
    const examQuestions = saveNonSavedDisplayedToQuestionAnswers()
    const examQuestionsForStorage = finishedExamToStorage(examQuestions)
    await asyncStorage.mergeFinishedExams(examQuestionsForStorage, 'start')
    // Save questions with new amount of times wrong answer was give
    const updatedAllQuestions = updateQuestionsWrongAnswers(allQuestions, examQuestions)
    await storage.saveQuestions(updatedAllQuestions)
    setAllQuestions([...updatedAllQuestions])
    // Continue
    setFinishExamModalActive(false)
    navigate('finished-exams', { examDate: examQuestionsForStorage.date });
  }

  const onFinishExamCancelClick = useCallback(() => {
    setFinishExamModalActive(false)
  }, [])
  


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
      <BottomDrawer ref={gridSelectionRef}>
        <QuestionsGridSelection 
          onItemClick={onGridItemClick}
          items={questionGridSelectionItems}
          bottomActions={questionGridBottomActions}
        />
      </BottomDrawer>
      { /* Exam finish condirmation modal */ }
      <DsModal 
        visible={finishExamModalActive} 
        title='Završi ispit' 
        subtitle='Završi ispit i pogledaj rezultat'
        actions={[
          <TouchableOpacity onPress={onFinishExamCancelClick} style={{ borderWidth: 2, borderStyle: 'solid', borderColor: colors.base, borderRadius: 8, padding: 12 }}>
            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: colors.base }}>ODUSTANI</Text>
          </TouchableOpacity>,
          <TouchableOpacity onPress={onFinishExamConfirmationClick} style={{ borderWidth: 2, borderStyle: 'solid', borderColor: colors.base, borderRadius: 8, backgroundColor: colors.base, padding: 12 }}>
            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: colors['section-item'] }}>ZAVRŠI</Text>
          </TouchableOpacity>    
        ]          
        }
      >
        </DsModal>
    </SafeAreaView>
  );
}