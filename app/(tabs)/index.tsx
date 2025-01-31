import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, TextInput } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { View } from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../colors';
import { CardContainer } from '../components/CardContainer';
import { NoResultItem } from '../components/NoResultItem';
import { QuestionCard } from '../components/QuestionCard';
import { usePagination } from '../hooks/usePagination';
import useStore from '../store/store';
import { Question } from '../types/types';


// klindic.autoskola-testovi.com//ckeditor/kcfinder/upload_img/images/10/5.jpg

export default function Questions() {

  const { allQuestions } = useStore()
  const { Component: PaginationComponent, firstItemIndexOnPage, lastItemIndexOnPage, setCurrentPage, setItemCount, currentPage } = usePagination({ _currentPage: 1, _itemsCount: allQuestions.length, _pageSize: 10});

  const [filteredQuestions, setFilteredQuestions] = useState(allQuestions)
  const [displayedQuestions, setDisplayedQuestions] = useState(filteredQuestions.slice(firstItemIndexOnPage, lastItemIndexOnPage + 1));
  
  const [unappliedSearchValue, setUnappliedSearchValue] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const qListRef = useRef<FlatList<Question>>(null); 
  
  const search = () => {
    const newFilteredQuestions = searchValue.length > 0 ? allQuestions.filter(q => q.question.toLowerCase().indexOf(searchValue.toLowerCase()) > -1) : allQuestions
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
  
  const onSearchClear = () => {
    setUnappliedSearchValue('')
    setSearchValue('')
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

  useEffect(() => {
    search()
  }, [searchValue])

  useEffect(() => {
    qListRef?.current?.scrollToOffset({ offset: 0, animated: false }); // scrolls back to start of list when items change
  }, [searchValue, currentPage]) 
  


  return (
    <SafeAreaView style={{ backgroundColor: colors.base, flex:1 }} className='flex flex-col'>
        { /* Header */}
        <View style={{ display: 'flex', flexDirection: 'row', padding: 6, height: 50}}>
          <View style={{ flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <TextInput
              onBlur={(e) => setSearchValue(unappliedSearchValue)} onChangeText={(text) => setUnappliedSearchValue(text)} value={unappliedSearchValue} placeholder='Pretraga pitanja...' placeholderTextColor={colors.base} 
              style={{ flex: 1, backgroundColor: colors['base-bg'], borderRadius: 6, padding: 6, fontWeight: '500', color: colors.disabled }}>
            </TextInput>
            { unappliedSearchValue && <Ionicons onPress={onSearchClear} style={{ position: 'absolute', right: 0, marginEnd: 2 }} size={32} color={colors.inactive} name={'close-circle'} /> }
          </View>
          <PaginationComponent></PaginationComponent>
        </View>
        { /* No results */}
        {
          !displayedQuestions?.length &&
          <NoResultItem/>
        }
        { /* Questions */}
        <FlatList<Question> 
          ref={qListRef}
          initialNumToRender={3}
          style={{ backgroundColor: colors.rootBackground }}
          contentContainerStyle={{ padding: 4, rowGap: 3 }}
          data={displayedQuestions} 
          renderItem={el =>
            <Animatable.View key={`question-card-${el.item.id}`} animation={'fadeInDown'} duration={200} delay={100 * (el.index + 1)}>
              <CardContainer color='base'>
                <QuestionCard question={el.item} answerInteractivityType={'CORRECT_ANSWERED_SHOWN'} incorrectlyAnsweredShown/>
              </CardContainer>
            </Animatable.View>
          }
          keyExtractor={el => `question-card-${el.id}`} 
        />
    </SafeAreaView>
  );
}