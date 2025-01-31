
import { Ionicons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';
import { asyncStorage } from '../async-storage/async-storage';
import colors from '../colors';
import { BottomDrawer } from '../components/BottomDrawer';
import { CardContainer } from '../components/CardContainer';
import { DsModal } from '../components/Modal';
import { QuestionCard } from '../components/QuestionCard';
import { QuestionsGridSelection } from '../components/QuestionsGridSelection';
import { INTERSECTION_QUESTIONS_PER_EXAM, NON_INTERSECTION_QUESTIONS_PER_EXAM, QUESTIONS_PER_EXAM } from '../constants/Global';
import { useExamSimulationQuestionSelection } from '../hooks/useExamSimulationQuestionSelection';
import { usePagination } from '../hooks/usePagination';
import { useTabNavigation } from '../hooks/useTabNavigation';
import { finishedExamToStorage } from '../mapper/mapper';
import { storage } from '../storage/storage';
import useStore from '../store/store';
import { AnswerInteractivityType, Question } from '../types/types';
import { deepCopy, isQuestionAnswered, updateQuestionsWrongAnswers } from '../utils/utils';

const generateExamQuestions = (questionPool: Question[]): Question[]  => {
  // Helper generator function
  const generateQuestions = (qAmountToGenerate: number, _questionPool: Question[]): Question[] => {
    const questions: Question[] = []
    if(_questionPool.length === qAmountToGenerate)
      return _questionPool
    else if(_questionPool.length < qAmountToGenerate) {
      console.warn(`Question pool does not have enough element to generate ${qAmountToGenerate} questions. Returning all ${_questionPool.length}`)
      return _questionPool
    }
    for(let i = 0; i < qAmountToGenerate; i++) {
      const randIndex = Math.floor(Math.random() * (_questionPool.length - 1) + 1)
      const generatedQuestion = deepCopy(_questionPool[randIndex])
      generatedQuestion.answers.forEach(a => a.checked = false);
      questions.push(generatedQuestion)
      _questionPool.splice(randIndex, 1)
    }
    return questions;
  }

  // Question generation
  const generatedQuestions: Question[] = []
  const nonIntersectionQuestionsPool = questionPool.filter(q => !q.isIntersection)
  generatedQuestions.push(...generateQuestions(NON_INTERSECTION_QUESTIONS_PER_EXAM, nonIntersectionQuestionsPool))
  const intersectionQuestionsPool = questionPool.filter(q => q.isIntersection)
  generatedQuestions.push(...generateQuestions(INTERSECTION_QUESTIONS_PER_EXAM, intersectionQuestionsPool))
  
  return generatedQuestions
}


export default function ExamSimulationScreen() {
  const { activeTab, navigate } = useTabNavigation()
  
  const { allQuestions, setAllQuestions } = useStore()
  const [examQuestions, setExamQuestions] = useState(generateExamQuestions(allQuestions))
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
  
  const finishExamButton = useMemo(() => {
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
  
  const isOnLastQuestion = displayedNonSavedQuestion.id === examQuestions[QUESTIONS_PER_EXAM - 1].id


  return (
    <SafeAreaView style={{ backgroundColor: colors.base, flex:1 }} className='flex flex-col'>
      { /* Header */}
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: 10, padding: 6, height: 50}}>
        <PaginationComponent></PaginationComponent>
        <TouchableOpacity onPress={openBottomDrawer}>
          <Ionicons size={36} color='white' name='menu' />
        </TouchableOpacity>
      </View>
      { /* Question */}
      <ScrollView style={{ backgroundColor: colors.rootBackground, padding: 4 }}>
        <Animatable.View key={`question-card-${displayedNonSavedQuestion.id}`} animation={'fadeInDown'} duration={500}>
          <CardContainer color='base'>
            <QuestionCard onAnswerChange={onAnswerChange} question={displayedNonSavedQuestion} answerInteractivityType={answerInteractivityType}/>
          </CardContainer>
          { isOnLastQuestion && finishExamButton }
        </Animatable.View>
      </ScrollView> 
      { /* Exam grid question selection */}
      <BottomDrawer ref={gridSelectionRef}>
        <QuestionsGridSelection 
          onItemClick={onGridItemClick}
          items={questionGridSelectionItems}
          bottomActions={finishExamButton}
        />
      </BottomDrawer>
      { /* Exam finish confirmation modal */ }
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