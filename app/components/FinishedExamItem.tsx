import React, { useCallback } from "react"
import { View, Text } from "react-native"
import { Question } from "../types/types"
import colors, { background } from "../colors"
import { CardContainer, Colors } from "./CardContainer"
import { Ionicons } from "@expo/vector-icons"
import GreenCheckboxIcon from "./svg/SuccessCheckboxIcon"
import FailedIcon from "./svg/FailedIcon"
import { formatDate } from "../utils/utils"

const isExamPassed = (questions: Question[]) => {
    return false
}

type FinishedExamItemProps = {
    date: Date,
    questions: Question[]
}

export const FinishedExamItem = (p: FinishedExamItemProps) => {

    const correctlyAnswered = p.questions.filter(q => q.answers.every(a => a.correct === a.checked)).length ?? 10
    const examOutcomeColor = isExamPassed(p.questions) ? colors.success : colors.failure
    const containerLeftBorderColor: Colors = isExamPassed(p.questions) ? 'success' : 'failure'
    const outcomeIcon = isExamPassed(p.questions) ? <GreenCheckboxIcon size={45}/> : <FailedIcon size={45}/>

    return (
        <CardContainer color={containerLeftBorderColor}>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: 2 }}>
                <View style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text style={{ color: examOutcomeColor, fontSize: 18, fontWeight: 'bold' }}>{`${correctlyAnswered}/${38}`}</Text>
                    <Text style={{ fontSize: 14, color: colors["base-text"] }}>{formatDate(p.date, 'eu')}</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    { outcomeIcon }
                </View>
            </View>
        </CardContainer>
    ) 
}