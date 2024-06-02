import { ScrollView, Text, TextInput, TextInputFocusEventData } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CardContainer } from '../components/CardContainer';
import { View } from 'react-native-animatable';
import React, { useContext, useEffect, useState } from 'react';
import { QuestionCard } from '../components/QuestionCard';
import { Question } from '../types/types';
import { usePagination } from '../hooks/usePagination';
import colors from '../colors';
import { GlobalContext } from '../context/GlobalContext';


// klindic.autoskola-testovi.com//ckeditor/kcfinder/upload_img/images/10/5.jpg

export default function Questions() {

  const { allQuestions } = useContext(GlobalContext);
  const { Component: PaginationComponent, firstItemIndexOnPage, lastItemIndexOnPage, setCurrentPage, setItemCount } = usePagination({ _currentPage: 1, _itemsCount: allQuestions.length, _pageSize: 10});

  const [filteredQuestions, setFilteredQuestions] = useState(allQuestions)
  
  const [displayedQuestions, setDisplayedQuestions] = useState(filteredQuestions.slice(firstItemIndexOnPage, lastItemIndexOnPage + 1));
  const [searchValue, setSearchValue] = useState('');

  const search = () => {
    const newFilteredQuestions = searchValue.length > 0 ? filteredQuestions.filter(q => q.question.toLowerCase().indexOf(searchValue.toLowerCase()) > -1) : allQuestions
    if(newFilteredQuestions.length == 0) {
      alert(`0 rezultata za '${searchValue}'`)
      return
    }
    setFilteredQuestions(newFilteredQuestions)
    setCurrentPage(1)
    setItemCount(newFilteredQuestions.length)
  }

  // Keep only needed questions and mark them as checked if they are correct so filled checkbox is redered
  useEffect(() => {
    const questionsForPage = filteredQuestions.slice(firstItemIndexOnPage, lastItemIndexOnPage + 1);
    questionsForPage.forEach(q => 
      q.answers.forEach(a => { 
        if(a.correct) 
          a.checked = true
        }
      ))
      setDisplayedQuestions(questionsForPage);
  }, [firstItemIndexOnPage])

  return (
    <SafeAreaView style={{ backgroundColor: colors.base, marginBottom: 48 }} className='flex flex-col'>
        <View style={{ display: 'flex', flexDirection: 'row', padding: 6, gap: 8, paddingHorizontal: 4 }}>
          <TextInput 
            onBlur={(e) => search()} onChangeText={(text) => setSearchValue(text)} value={searchValue} placeholder='Pretraga pitanja' placeholderTextColor={colors.base} 
            style={{ flex: 1, backgroundColor: colors['base-bg'], borderRadius: 6, paddingHorizontal: 8, fontWeight: '500', color: colors.disabled }}></TextInput>
          <PaginationComponent></PaginationComponent>
        </View>
          <ScrollView style={{ backgroundColor: colors.rootBackground, padding: 4 }}>
            {
              displayedQuestions.map((question, i) => (
                <View key={`question-card-${question.id}`}>
                  <CardContainer color='base'>
                  <Text>{question.id}</Text>
                    <QuestionCard question={question} canBeAnswered={false}/>
                  </CardContainer>
                  { i != filteredQuestions.length - 1 && <View className='mt-2' /> }
                </View>
              ))
            }
          </ScrollView>
    </SafeAreaView>
  );
}