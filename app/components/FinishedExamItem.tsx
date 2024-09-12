import React, { useCallback } from "react"
import { View, Text } from "react-native"
import { Question } from "../types/types"
import colors, { background } from "../colors"
import { CardContainer, Colors } from "./CardContainer"
import { Ionicons } from "@expo/vector-icons"
import GreenCheckboxIcon from "./svg/SuccessCheckboxIcon"
import FailedIcon from "./svg/FailedIcon"
import { formatDate } from "../utils/utils"
import { MIN_CORRECT_NON_INTERSECTION_ANSWERS_FOR_PASS } from "../constants/Global"

const allIntersectionsCorrect = (questions: Question[]) => {
    return questions
        .filter(q => q.isIntersection)
        .flatMap(q => q.answers)
        .every(a => a.correct === a.checked)
}

const isExamPassed = (questions: Question[]) => {
    const _allIntersectionsCorrect = allIntersectionsCorrect(questions)
    const correctNonIntersectionQCount = questions
        .filter(q => !q.isIntersection)
        .filter(q => q.answers.every((a) => a.correct === a.checked))
        .length
    return _allIntersectionsCorrect && correctNonIntersectionQCount >= MIN_CORRECT_NON_INTERSECTION_ANSWERS_FOR_PASS
}


type FinishedExamItemProps = {
    date: Date,
    questions: Question[]
}

export const FinishedExamItem = (p: FinishedExamItemProps) => {

    const correctlyAnsweredCount = p.questions.filter(q => q.answers.every(a => a.correct === a.checked)).length ?? 10

    const examOutcomeColor = isExamPassed(p.questions) ? colors.success : colors.failure
    const containerLeftBorderColor: Colors = isExamPassed(p.questions) ? 'success' : 'failure'
    const outcomeIcon = isExamPassed(p.questions) ? <GreenCheckboxIcon size={45}/> : <FailedIcon size={45}/>

    const wrongAnsweredCountText = `${correctlyAnsweredCount}/${38} ${allIntersectionsCorrect(p.questions) ? '' : '(krivo križanje)'}`

    return (
        <CardContainer color={containerLeftBorderColor}>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: 2 }}>
                <View style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text style={{ color: examOutcomeColor, fontSize: 18, fontWeight: 'bold' }}>{wrongAnsweredCountText}</Text>
                    <Text style={{ fontSize: 14, color: colors["base-text"] }}>{formatDate(p.date, 'eu')}</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    { outcomeIcon }
                </View>
            </View>
        </CardContainer>
    ) 
}