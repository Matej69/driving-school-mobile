import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native"

import React, { useEffect, useState } from "react"
import { AnswerItem } from "./AnswerItem"
import { Answer, AnswerInteractivityType, Question } from "../types/types"
import { useQuestion } from "../hooks/useQuestion"
import colors from "../colors"
import * as FileSystem from 'expo-file-system';
import { imgRequiresUris, ImgRequiresUrisKeys } from "../storage/image-require-uris"
import { deepCopy } from "../utils/utils"


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
    const [ imageSizeMap, setImageSizeMap ] = useState<Map<ImgRequiresUrisKeys, { w: number; h: number}> | null>(null)
    const { width: screenWidth } = Dimensions.get('window');

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

    const loadImage = async (imgName: string) => {
    }

    
    useEffect(() => {
        // Build map of images with their original width and height
        (async() => {
            const promises: Promise<any>[] = p.question.images?.map(img => {
                return new Promise((res, rej) => {
                    const requiredImg = imgRequiresUris[img]
                    Image.getSize(Image.resolveAssetSource(requiredImg).uri, (w, h) => {
                        res({key: img, w, h})
                    });
                })
            }) ?? []
            const result = await Promise.all(promises);
            const newImageSizeMap: Map<ImgRequiresUrisKeys, { w: number; h: number}> = new Map()
            result.forEach(r => newImageSizeMap.set(r.key, {w: r.w, h: r.h}))
            //console.log(imageSizeMap)
            setImageSizeMap(newImageSizeMap)
          })()
    }, [])

    
    useEffect(() => {
        p.onAnswerChange?.(question)
    }, [question])

    const renderScaledImage = (img: ImgRequiresUrisKeys): JSX.Element => {
        if(!imageSizeMap || !imageSizeMap.has(img))
            return <></>
        const imgSizeRatio = imageSizeMap.get(img)!.w / imageSizeMap.get(img)!.h
        const imgSize = imgSizeRatio > 1 ? 
            { w: screenWidth * 0.6, h: undefined} :
            { w: undefined, h: screenWidth * 0.6}
        return <Image style={{ resizeMode: 'contain', width: imgSize.w, height: imgSize.h, aspectRatio: imgSizeRatio }} source={imgRequiresUris[img]}></Image>
    }

	return (
        <View>
            <Text className="text-gray-600 font-bold">{question.question}</Text>
            <View className="mt-1"/>
            {
                !!p.question.images?.length && imageSizeMap &&
                p.question.images.map((img) => 
                    renderScaledImage(img)
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
                p.incorrectlyAnsweredShown && !!question.incorrectlyAnsweredCount && 
                <Text className="text-xs mt-3" style={{ color: colors.failure }}>{question.incorrectlyAnsweredCount} puta pogrešno odgovoreno</Text>
            }
        </View>
    )
} 

const intersectionQIds = [30, 31, 36, 37,38,55,67,87,96,129,128,155,173,182,205,206,248,319,443,496,511]