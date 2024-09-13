import React, { useEffect, useMemo, useRef, useState } from "react"
import { TouchableOpacity, View, Text, FlatList } from "react-native"
import { Question } from "../types/types"
import colors from "../colors"
import { CardContainer } from "./CardContainer"
import { QuestionCard } from "./QuestionCard"
import { isQuestionAnsweredCorrectly } from "../utils/utils"
import * as Animatable from 'react-native-animatable'

type FinishedExamQuestionsTabKey = 'correctly-answered' | 'incorrectly-answered'

type FinishedExamQuestionsProps = {
    questions: Question[]
}

export const FinishedExamQuestions = (p: FinishedExamQuestionsProps) => {
    const [selectedTabKey, setSelectedTabKey] = useState<FinishedExamQuestionsTabKey>('incorrectly-answered')
    

    const questionsGroupedByCorrectness: Map<FinishedExamQuestionsTabKey, Question[]> = useMemo(() => {
      return new Map([
        ['incorrectly-answered', p.questions.filter(q => !isQuestionAnsweredCorrectly(q))],
        ['correctly-answered', p.questions.filter(q => isQuestionAnsweredCorrectly(q))]
      ]);
    }, [p.questions])

    const tabItemColor = (tabKey: FinishedExamQuestionsTabKey) => {
        return selectedTabKey == tabKey ? colors.disabled : colors['base-bg']
    }

    return(
        <>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', padding: 4 }}>
            <TouchableOpacity style={{ padding: 2, alignItems: 'center' }} onPress={() => setSelectedTabKey("incorrectly-answered")}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: tabItemColor('incorrectly-answered') }}>NETOČNI</Text>
              <View style={{ backgroundColor: tabItemColor('incorrectly-answered'), width: 6, height: 6, borderRadius: 9999 }}></View>
            </TouchableOpacity>
            <TouchableOpacity style={{ padding: 2, alignItems: 'center' }} onPress={() => setSelectedTabKey("correctly-answered")}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: tabItemColor('correctly-answered') }}>TOČNI</Text>
              <View style={{ backgroundColor: tabItemColor('correctly-answered'), width: 6, height: 6, borderRadius: 9999 }}></View>
            </TouchableOpacity>
          </View>
          <FlatList<Question>             
            initialScrollIndex={0}
            initialNumToRender={3}
            style={{ backgroundColor: colors.rootBackground }}
            contentContainerStyle={{ padding: 4, rowGap: 3 }}
            data={questionsGroupedByCorrectness.get(selectedTabKey)} 
            renderItem={el =>
                <Animatable.View key={`exam-question-card-${el.item.id}`} animation={'fadeInDown'} delay={100 * (el.index + 1)}>
                  <CardContainer color={isQuestionAnsweredCorrectly(el.item) ? 'success' : 'failure'}>
                    <QuestionCard question={el.item} answerInteractivityType={'CORRECT_ANSWERED_SHOWN'} incorrectlyAnsweredShown/>
                  </CardContainer>
              </Animatable.View >
            }
            keyExtractor={el => `exam-question-card-${el.id}`} 

          />
        </>
    )
}