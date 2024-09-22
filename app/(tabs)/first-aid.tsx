
import { Button, FlatList, Linking, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useStore from '../store/store';
import React, { useEffect, useMemo, useState } from 'react';
import { FirstAidQuestion } from '../types/types';
import { FirstAidQuestionItem } from '../components/FirstAidQuestionItem';
import colors from '../colors';
import * as Animatable from 'react-native-animatable'
import { Ionicons } from '@expo/vector-icons';

export default function FirstAid() {

  const { firstAidQuestions } = useStore()
  const [filteredFirstAidQuestions, setFilteredFirstAidQuestions] = useState(firstAidQuestions);

  const [searchValue, setSearchValue] = useState('');

  const search = () => {
    const newFilteredQuestions = searchValue.length > 0 ? firstAidQuestions.filter(q => q.question.toLowerCase().indexOf(searchValue.toLowerCase()) > -1) : firstAidQuestions
    if(newFilteredQuestions.length == 0) {
      alert(`0 rezultata za '${searchValue}'`)
      return
    }
    setFilteredFirstAidQuestions(newFilteredQuestions)   
  }

  const onSearchClear = () => {
    setSearchValue('')
    search()
  }

  useEffect(() => {
    search()
  }, [searchValue])

  return (
    <SafeAreaView style={{ backgroundColor: colors.base, flex:1 }} className='flex flex-col'>
      { /* Top Header */}
      <View style={{ display: 'flex', flexDirection: 'row', padding: 6}}>
          <View style={{ flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <TextInput
              onChangeText={(text) => setSearchValue(text)} value={searchValue} placeholder='Pretraga pitanja' placeholderTextColor={colors.base} 
              style={{ flex: 1, backgroundColor: colors['base-bg'], borderRadius: 6, padding: 6, fontWeight: '500', color: colors.disabled }}>
            </TextInput>
            { searchValue && <Ionicons onPress={onSearchClear} style={{ position: 'absolute', right: 0, marginEnd: 2 }} size={32} color={colors.inactive} name={'close-circle'} /> }
          </View>          
        </View>
      { /* Questions list */ }
      <FlatList<FirstAidQuestion> 
        initialNumToRender={10}
        style={{ backgroundColor: colors.rootBackground }}
        contentContainerStyle={{ padding: 4, rowGap: 3}}
        data={filteredFirstAidQuestions}
        renderItem={(el) =>
          <Animatable.View key={`first-aid-q-${el.item.question}`} animation={'fadeInDown'} duration={100} delay={20 * (el.index + 1)}>
            <FirstAidQuestionItem q={el.item}/>
          </Animatable.View>
        }
        keyExtractor={q => q.question} 
      />
    </SafeAreaView>
  );
}