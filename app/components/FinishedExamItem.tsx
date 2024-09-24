import React from "react"
import { Text, View } from "react-native"
import colors from "../colors"
import { Question } from "../types/types"
import { allIntersectionsCorrect, formatDate, isExamPassed } from "../utils/utils"
import { CardContainer } from "./CardContainer"
import FailedIcon from "./svg/FailedIcon"
import GreenCheckboxIcon from "./svg/SuccessCheckboxIcon"


type FinishedExamItemProps = {
    date: Date,
    questions: Question[]
}

export const FinishedExamItem = (p: FinishedExamItemProps) => {

    const correctlyAnsweredCount = p.questions.filter(q => q.answers.every(a => a.correct === a.checked)).length ?? 10

    const examOutcomeColor = isExamPassed(p.questions) ? colors.success : colors.failure
    const outcomeIcon = isExamPassed(p.questions) ? <GreenCheckboxIcon size={45}/> : <FailedIcon size={45}/>

    const wrongAnsweredCountText = `${correctlyAnsweredCount}/${38} ${allIntersectionsCorrect(p.questions) ? '' : '(križanje)'}`

    return (
        <CardContainer color={'base'}>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: 2 }}>
                <View style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text style={{ color: examOutcomeColor, fontSize: 18, fontWeight: 'bold' }}>{wrongAnsweredCountText}</Text>
                    <Text style={{ fontSize: 12, color: colors["base-text"], fontStyle: 'italic' }}>{formatDate(p.date, 'eu')}</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    { outcomeIcon }
                </View>
            </View>
        </CardContainer>
    ) 
}