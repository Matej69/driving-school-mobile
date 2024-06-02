import { ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CardContainer } from '../components/CardContainer';
import { View } from 'react-native-animatable';
import React, { useContext, useEffect } from 'react';
import { QuestionCard } from '../components/QuestionCard';
import { Question } from '../types/types';
import { usePagination } from '../hooks/usePagination';
import colors from '../colors';
import { GlobalContext } from '../context/GlobalContext';


// klindic.autoskola-testovi.com//ckeditor/kcfinder/upload_img/images/10/5.jpg

export default function Questions() {

  const { allQuestions } = useContext(GlobalContext);
  const { Component: PaginationComponent, firstItemIndexOnPage, lastItemIndexOnPage } = usePagination({ _currentPage: 1, _itemsCount: allQuestions.length, _pageSize: 10});
  
  // Keep only needed questions and mark them as checked if they are correct so filled checkbox is redered
  const questionsForPage = allQuestions.slice(firstItemIndexOnPage, lastItemIndexOnPage + 1);
  questionsForPage.forEach(q => 
    q.answers.forEach(a => { 
      if(a.correct) 
        a.checked = true
      }
    ))

  return (
    <SafeAreaView style={{ backgroundColor: colors.base, marginBottom: 48 }} className='flex flex-col'>
        <View style={{ padding: 6 }}>
          <PaginationComponent></PaginationComponent>
        </View>
          <ScrollView style={{ backgroundColor: colors.rootBackground, padding: 4 }}>
            {
              questionsForPage.map((question, i) => (
                <View key={`question-card-${question.id}`}>
                  <CardContainer color='failure'>
                    <QuestionCard question={question} canBeAnswered={false}/>
                  </CardContainer>
                  { i != allQuestions.length - 1 && <View className='mt-2' /> }
                </View>
              ))
            }
          </ScrollView>
    </SafeAreaView>
  );
}