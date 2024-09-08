import { Question } from "../types/types";

export const deepCopy = <T>(obj: T) => {
    return JSON.parse(JSON.stringify(obj)) as T
}


const dateOptions = {
    'eu': {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }
} satisfies Record<string, Intl.DateTimeFormatOptions>

type DateFormat = keyof typeof dateOptions


export const formatDate = (date: Date, format: DateFormat = 'eu') => {
    const time = date?.getTime()
    if (!time || isNaN(time))
        return null
  
    const formatter = new Intl.DateTimeFormat('en-GB', dateOptions[format]);
    return formatter.format(date).replace(',', '').replaceAll('/', '.');
  };

export const updateQuestionsWrongAnswers = (allQuestions: Question[], answeredQuestions: Question[]) : Question[] => {
    const answersCorrectnessMap = new Map<number, boolean>() 
    answeredQuestions.forEach(q => {
        const correctlyAnswered = q.answers.every(a => {
            return a.checked === a.correct
        })
        answersCorrectnessMap.set(q.id, correctlyAnswered)
    })
    allQuestions.forEach(q => {
        if(answersCorrectnessMap.has(q.id)) {
            const amountToAdd = !answersCorrectnessMap.get(q.id) ? 1 : 0
            q.incorrectlyAnswered = (q.incorrectlyAnswered ?? 0) + amountToAdd
        }
    })
    return allQuestions
}

export const isQuestionAnsweredCorrectly = (question: Question) => question.answers.every(a => a.checked === a.correct)
export const isQuestionAnswered = (question: Question) => question.answers.some(a => a.checked)