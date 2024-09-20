import { Dimensions, FlexAlignType, FlexStyle, Image, Text, TouchableOpacity, View } from "react-native"

import React, { useEffect, useState } from "react"
import { AnswerItem } from "./AnswerItem"
import { Answer, AnswerInteractivityType, Question } from "../types/types"
import { useQuestion } from "../hooks/useQuestion"
import colors from "../colors"
import * as FileSystem from 'expo-file-system';
import { imgNodeRequires, ImgRequiresUrisKeys } from "../storage/image-require-uris"
import { deepCopy } from "../utils/utils"
import { Ionicons } from "@expo/vector-icons"
import useStore from "../store/store"


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

    const { imagesMetadata, setImagesMetadata }= useStore()

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

    const renderScaledImage = (img: ImgRequiresUrisKeys): JSX.Element => {
        const imgMetadata = imagesMetadata.get(img)
        const imgSizeRatio = imgMetadata?.width! / imgMetadata?.height!
        const screenW = Dimensions.get('screen').width
        const imgSize: { w?: number, h?: number} = imgSizeRatio > 1 ? 
            { w: screenW * 0.7, h: undefined} :
            { w: undefined, h: screenW * 0.7}
        return <Image key={img} style={{ resizeMode: 'contain', width: imgSize.w, height: imgSize.h, aspectRatio: imgSizeRatio, borderRadius: 8 }} source={imgNodeRequires[img]}></Image>
    }

    const bottomInfoRowJustify: 'space-between' | 'flex-end' = p.incorrectlyAnsweredShown && !!question.incorrectlyAnsweredCount ? 'space-between' : 'flex-end'
    const hasBottomInfoRow = (p.incorrectlyAnsweredShown && !!question.incorrectlyAnsweredCount) || p.question.isIntersection

	return (
        <View>
            <Text className="text-gray-600 font-bold">{question.question}</Text>            
            <View className="mt-1"/>
            {
                // Render images
                p.question.images.map((img) => renderScaledImage(img))
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
            { hasBottomInfoRow && <View className="mt-2"/> }
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: bottomInfoRowJustify, alignItems: 'flex-end'}}>
                {
                    p.incorrectlyAnsweredShown && !!question.incorrectlyAnsweredCount && 
                    <Text className="text-xs" style={{ color: colors.failure, fontStyle: 'italic' }}>{question.incorrectlyAnsweredCount} puta netočno odgovoreno</Text>
                }
                {
                    p.question.isIntersection && 
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'orange', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 }}>
                        <Text style={{ color: 'orange', fontWeight: 'bold' }}>Raskrižje</Text>
                        <Ionicons name="warning"  style={{ marginLeft: 2 }} color={'orange'} size={24}></Ionicons>
                    </View>
                }
            </View>
        </View>
    )
} 
