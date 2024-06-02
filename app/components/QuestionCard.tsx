import { Image, Text, TouchableOpacity, View } from "react-native"

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
            <Text className="text-gray-600 font-bold">{question.question}</Text>
            <View className="mt-1"/>
            { /* question.imagesUrls && <Image style={{ resizeMode: 'contain', width: '70%', height: undefined, aspectRatio: 1 }} source={require('../../assets/images/questions/yolo.png')}/> */}
            {
                !!p.question.imagesUrls?.length &&
                p.question.imagesUrls.map(imgUrl => 
                    <Image key={imgUrl} style={{ resizeMode: 'contain', width: '70%', height: undefined, aspectRatio: 1 }} source={{uri: `https://${imgUrl}`}}></Image>
                )
            }
            <View className="mt-1"/>
            {
                question.answers.map((answer, i) => (
                    <TouchableOpacity key={`question-answer-${i}`} disabled={!p.canBeAnswered} onPress={() => {p.canBeAnswered && toogleQuestionCheck(answer.id)}}>
                        <AnswerItem text={answer.text} checked={answer.checked} {...styleProps(answer.correct, answer.checked)} />
                        { i !== question.answers.length - 1 && <View className="mt-1"/>}
                    </TouchableOpacity>
                ))
            }	
        </View>
    )
} 