import { ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CardContainer } from '../components/CardContainer';
import { View } from 'react-native-animatable';
import React from 'react';
import { QuestionCard } from '../components/QuestionCard';
import { Question } from '../types/types';
import { usePagination } from '../hooks/usePagination';
import colors from '../colors';



let questions: Question[] = [
  { 
    id: 1,
    title: 'Prema položaju automobila ispred vas na prometnoj traci kako bi trebao postupiti vozač tog automobila u situaciji kao na slici', 
    img: '../../assets/images/questions/yolo.png',
    answers: [
      { id: 0, text: 'aa aa a automobila ispred vas na prometa a automobila ispred vas na promet a a a a a a a a automobila ispred vas na prometnoj traci automobila ispred vas na prometnoj traci aaaaaaaaaaaaaaaaaaaa', correct: true, checked: true },
      { id: 1, text: 'ba a a a a a a a a a automobila ispred vas na a a automobila ispred vas na prometprometnoj traci automobila ispred vas na prometnoj traci aaaaaaaaaaaaaaaaaaaa', correct: true, checked: false },
      { id: 2, text: 'ca a a a a a automobila ispred vas na prometa a a a a a automobila ispred vas na prometnoj traci automobila ispred vas na prometnoj traci aaaaaaaaaaaaaaaaaaaa', correct: false, checked: true },
      { id: 3, text: 'da a a a a a a a a a automobila ispred vas na prometnoj traci automobila ispred vas na prometnoj traci aaaaaaaaaaaaaaaaaaaa', correct: false, checked: false },
    ]
  }/*,
  { 
    id: 2,
    title: 'prometnoj traci kako bi trebao postupiti vozač tog automobila us Prema položaju automobila ispred vas na situaciji kao na slici', 
    img: 'yoloooooo.png',
    answers: [
      { id: 4, text: 'aa aa a automobila ispred vas na prometa a automobila ispred vas na promet a a a a a a a a automobila ispred vas na prometnoj traci automobila ispred vas na prometnoj traci aaaaaaaaaaaaaaaaaaaa', correct: true },
      { id: 6, text: 'aa a a a a a automobila ispred vas na prometa a a a a a automobila ispred vas na prometnoj traci automobila ispred vas na prometnoj traci aaaaaaaaaaaaaaaaaaaa', correct: false },
      { id: 7, text: 'aa a a a a a a a a a automobila ispred vas na prometnoj traci automobila ispred vas na prometnoj traci aaaaaaaaaaaaaaaaaaaa', correct: true },
    ]
  }*/
]

Array.from([2,3,4,5,6,7,8,9,10,11]).forEach(index => {
  questions.push({...questions[0], id: index})
})



export default function Questions() {

  const { Component: PaginationComponent, firstItemIndexOnPage, lastItemIndexOnPage } = usePagination({ _currentPage: 1, _itemsCount: questions.length, _pageSize: 10});

  const questionsForPage = questions.slice(firstItemIndexOnPage, lastItemIndexOnPage + 1);

  return (
    <SafeAreaView style={{ backgroundColor: colors.base }} className='flex flex-col'>
        <View style={{ padding: 6 }}>
          <PaginationComponent></PaginationComponent>
        </View>
          <ScrollView style={{ backgroundColor: colors.rootBackground, padding: 4 }}>
            {
              questionsForPage.map((question, i) => (
                <View key={`question-card-${i}`}>
                  <CardContainer color='failure'>
                    <QuestionCard question={question} canBeAnswered={false}/>
                  </CardContainer>
                  { i != questions.length - 1 && <View className='mt-2' /> }
                </View>
              ))
            }
          </ScrollView>
    </SafeAreaView>
  );
}