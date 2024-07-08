import { useState } from "react"
import colors from "../colors"
import { Question } from "../types/types"

type Props = {
    questions: Question[],
    currentlySelectedQuestionId: number
}

const getItemsStyles = (questions: Question[], currentlySelectedQuestionId: number) => {
    const styles: {id: number, style: {backgroundColor: string}}[] = []
    questions.forEach(q => {
        const nonAnswered = !q.answers.some(q => q.checked)
        if(currentlySelectedQuestionId === q.id)
            styles.push({ id: q.id, style: {backgroundColor: colors.base} })
        else if(nonAnswered)
            styles.push({ id: q.id, style: {backgroundColor: colors.inactive} })
        else
            styles.push({ id: q.id, style: {backgroundColor: '#535156'} })
    });
    return styles
}

export const useExamSimulationQuestionSelection = ({questions, currentlySelectedQuestionId}: Props) => {
    const [questionGridSelectionItems, setQuestionGridSelectionItems] = useState<{id: number, style: {backgroundColor: string}}[]>(
        getItemsStyles(questions, currentlySelectedQuestionId)
    )

    const updateItemsStyles = (questions: Question[], currentlySelectedQuestionId: number) => {
        setQuestionGridSelectionItems(getItemsStyles(questions, currentlySelectedQuestionId));
    }

    return { questionGridSelectionItems, updateItemsStyles}
}