import { Image, Text, View } from "react-native"

import React from "react"
import { AnswerItem } from "./AnswerItem"
import { Answer, Question } from "../types/types"
import { useQuestion } from "../hooks/useQuestion"
import colors from "../colors"


type QuestionCardProps = {
    question: Question,
    canBeAnswered: boolean,
    canExpand?: boolean
}

export const QuestionCard = (p: QuestionCardProps) => {

    const { question, toogleQuestionCheck } = useQuestion({question: p.question});

    const styleProps = (correct: boolean, checked: boolean): {checkboxFillColor?: string, checkboxBorderColor?: string, itemBorderColor: string, icon?: 'checkmark' | 'close'} =>  {
        if(p.canBeAnswered) {
            if(checked) return { checkboxFillColor: colors['base'], checkboxBorderColor: colors['base'], itemBorderColor: colors['base'], icon: 'checkmark' }
            else return { checkboxFillColor: undefined, checkboxBorderColor: colors['inactive'], itemBorderColor: colors['inactive'], icon: undefined }
        }
        else {
            if(correct && checked) return { checkboxFillColor: colors['success'], checkboxBorderColor: colors['success'], itemBorderColor: colors['success'], icon: 'checkmark' }
            if(correct && !checked) return { checkboxFillColor: undefined, checkboxBorderColor: colors['inactive'], itemBorderColor: colors['success'], icon: undefined }
            if(!correct && checked) return { checkboxFillColor: colors['failure'], checkboxBorderColor: colors['failure'], itemBorderColor: colors['failure'], icon: 'close' }
            if(!correct && !checked) return { checkboxFillColor: undefined, checkboxBorderColor: colors['inactive'], itemBorderColor: colors['inactive'], icon: undefined }
        }
        return { checkboxFillColor: colors['inactive'], checkboxBorderColor: colors['inactive'], itemBorderColor: colors['inactive'], icon: undefined }
    }

	return (
        <View>
            <Text className="text-gray-600 font-bold">{question.title}</Text>
            <View className="mt-1"/>
            { question.img && <Image style={{ resizeMode: 'contain', width: '70%', height: undefined, aspectRatio: 1 }} source={require('../../assets/images/questions/yolo.png')}/> }
            <View className="mt-1"/>
            {
                question.answers.map((answer, i) => (
                    <View key={`question-answer-${i}`}>
                        <AnswerItem text={answer.text} checked={answer.checked} onClick={() => {p.canBeAnswered && toogleQuestionCheck(answer.id)}} {...styleProps(answer.correct, answer.checked)} />
                        { i !== question.answers.length - 1 && <View className="mt-1"/>}                        
                    </View>
                ))
            }	
        </View>
    )
} 