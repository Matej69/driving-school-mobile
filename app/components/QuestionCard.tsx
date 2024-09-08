import { Image, Text, TouchableOpacity, View } from "react-native"

import React, { useEffect } from "react"
import { AnswerItem } from "./AnswerItem"
import { Answer, AnswerInteractivityType, Question } from "../types/types"
import { useQuestion } from "../hooks/useQuestion"
import colors from "../colors"


type QuestionCardProps = {
    question: Question,
    answerInteractivityType: AnswerInteractivityType,
    canExpand?: boolean,
    incorrectlyAnswered?: number,
    incorrectlyAnsweredShown?: boolean,
    onAnswerChange?: (q: Question) => void
}

export const QuestionCard = (p: QuestionCardProps) => {

    const { question, toogleQuestionCheck } = useQuestion({question: p.question});

    const answerItemDisabled = () => p.answerInteractivityType == 'CORRECT_ANSWERED_SHOWN'
    const canAnswer = () => p.answerInteractivityType == 'CAN_BE_ANSWERED'

    const styleProps = (correct: boolean, checked: boolean): {checkboxFillColor?: string, checkboxBorderColor?: string, itemBorderColor: string, icon?: 'checkmark' | 'close'} =>  {
        if(p.answerInteractivityType == 'CAN_BE_ANSWERED') {
            if(checked) return { checkboxFillColor: colors['base'], checkboxBorderColor: colors['base'], itemBorderColor: colors['base'], icon: 'checkmark' }
            else return { checkboxFillColor: undefined, checkboxBorderColor: colors['inactive'], itemBorderColor: colors['inactive'], icon: undefined }
        }
        else if(p.answerInteractivityType == 'ANSWERED_AND_DISABLED') {
            if(checked) return { checkboxFillColor: colors['base'], checkboxBorderColor: colors['base'], itemBorderColor: colors['base'], icon: 'checkmark' }
            else return { checkboxFillColor: undefined, checkboxBorderColor: colors['inactive'], itemBorderColor: colors['inactive'], icon: undefined }
        }
        else if(p.answerInteractivityType == 'CORRECT_ANSWERED_SHOWN') {
            if(correct && checked) return { checkboxFillColor: colors['success'], checkboxBorderColor: colors['success'], itemBorderColor: colors['success'], icon: 'checkmark' }
            if(correct && !checked) return { checkboxFillColor: undefined, checkboxBorderColor: colors['inactive'], itemBorderColor: colors['success'], icon: undefined }
            if(!correct && checked) return { checkboxFillColor: colors['failure'], checkboxBorderColor: colors['failure'], itemBorderColor: colors['failure'], icon: 'close' }
            if(!correct && !checked) return { checkboxFillColor: undefined, checkboxBorderColor: colors['inactive'], itemBorderColor: colors['inactive'], icon: undefined }
        }
        return { checkboxFillColor: colors['inactive'], checkboxBorderColor: colors['inactive'], itemBorderColor: colors['inactive'], icon: undefined }
    }
    const onAnswerPress = (answer: Answer) => {
        if(p.answerInteractivityType == 'ANSWERED_AND_DISABLED') {
            alert('U simulaciji, kao i na pravom ispitu, ne možete mijenjati odgovor nakon što ste ga ponudili i prešli na sljedeće pitanje')
        }
        canAnswer() && toogleQuestionCheck(answer.id)
    }

    useEffect(() => {
        p.onAnswerChange?.(question)
    }, [question])

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
                    <TouchableOpacity key={`question-answer-${i}`} disabled={answerItemDisabled()} onPress={() => {onAnswerPress(answer)}}>
                        <AnswerItem text={answer.text} checked={answer.checked} {...styleProps(answer.correct, answer.checked)} />
                        { i !== question.answers.length - 1 && <View className="mt-1"/>}
                    </TouchableOpacity>
                ))
            }
            {
                p.incorrectlyAnsweredShown && !!question.incorrectlyAnswered && 
                <Text className="text-xs mt-3" style={{ color: colors.failure }}>{question.incorrectlyAnswered} puta pogrešno odgovoreno</Text>
            }
        </View>
    )
} 