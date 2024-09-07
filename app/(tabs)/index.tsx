import { ScrollView, Text, TextInput, TextInputFocusEventData, Touchable, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CardContainer } from '../components/CardContainer';
import { View } from 'react-native-animatable';
import React, { useContext, useEffect, useState } from 'react';
import { QuestionCard } from '../components/QuestionCard';
import { Question } from '../types/types';
import { usePagination } from '../hooks/usePagination';
import colors from '../colors';
import { GlobalContext } from '../context/GlobalContext';
import { Ionicons } from '@expo/vector-icons';
import { asyncStorage } from '../async-storage/async-storage';


// klindic.autoskola-testovi.com//ckeditor/kcfinder/upload_img/images/10/5.jpg

export default function Questions() {

  const { allQuestions } = useContext(GlobalContext);
  const { Component: PaginationComponent, firstItemIndexOnPage, lastItemIndexOnPage, setCurrentPage, setItemCount } = usePagination({ _currentPage: 1, _itemsCount: allQuestions.length, _pageSize: 10});

  const [filteredQuestions, setFilteredQuestions] = useState(allQuestions)
  const [displayedQuestions, setDisplayedQuestions] = useState(filteredQuestions.slice(firstItemIndexOnPage, lastItemIndexOnPage + 1));
  
  const [unappliedSearchValue, setUnappliedSearchValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  
  const search = () => {
    const newFilteredQuestions = searchValue.length > 0 ? allQuestions.filter(q => q.question.toLowerCase().indexOf(searchValue.toLowerCase()) > -1) : allQuestions
    if(newFilteredQuestions.length == 0) {
      alert(`0 rezultata za '${searchValue}'`)
      return
    }
    setFilteredQuestions(newFilteredQuestions)
    setCurrentPage(1)
    setItemCount(newFilteredQuestions.length)
    
    const questionsForPage = newFilteredQuestions.slice(firstItemIndexOnPage, lastItemIndexOnPage + 1);
    questionsForPage.forEach(q => 
      q.answers.forEach(a => { 
        if(a.correct) 
          a.checked = true
      }
    ))
    setDisplayedQuestions(questionsForPage);
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

  const onSearchClear = () => {
    setUnappliedSearchValue('')
    setSearchValue('')
  }

  useEffect(() => {
    search()
  }, [searchValue])
 

  return (
    <SafeAreaView style={{ backgroundColor: colors.base, flex:1 }} className='flex flex-col'>
        <View style={{ display: 'flex', flexDirection: 'row', padding: 6}}>
          <View style={{ flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <TextInput
              onBlur={(e) => setSearchValue(unappliedSearchValue)} onChangeText={(text) => setUnappliedSearchValue(text)} value={unappliedSearchValue} placeholder='Pretraga pitanja' placeholderTextColor={colors.base} 
              style={{ flex: 1, backgroundColor: colors['base-bg'], borderRadius: 6, padding: 6, fontWeight: '500', color: colors.disabled }}>
            </TextInput>
            { unappliedSearchValue && <Ionicons onPress={onSearchClear} style={{ position: 'absolute', right: 0, marginEnd: 2 }} size={32} color={colors.inactive} name={'close-circle'} /> }
          </View>
          <PaginationComponent></PaginationComponent>
        </View>
          <ScrollView style={{ backgroundColor: colors.rootBackground, padding: 4 }}>
            {
              displayedQuestions.map((question, i) => (
                <View key={`question-card-${question.id}`}>
                  <CardContainer color='base'>
                  <Text>{question.id}</Text>
                    <QuestionCard question={question} answerInteractivityType={'CORRECT_ANSWERED_SHOWN'}/>
                  </CardContainer>
                  { i != filteredQuestions.length - 1 && <View className='mt-2' /> }
                </View>
              ))
            }
          </ScrollView>
    </SafeAreaView>
  );
}