import { ImgRequiresUrisKeys } from "../storage/image-require-uris"

export type Answer = {
    id: number, 
    text: string, 
    correct: boolean, 
    checked: boolean
}

export type Question =  { 
    id: number, 
    question: string, 
    images?: ImgRequiresUrisKeys[],
    answers: Answer[],
    incorrectlyAnsweredCount: number
}

export type FinishedExam = {
    date: Date,
    questions: Question[]
}

export type AnswerInteractivityType = 'CAN_BE_ANSWERED' | 'ANSWERED_AND_DISABLED' | 'CORRECT_ANSWERED_SHOWN'

export type FinishedExamAnswerStorage = Pick<Answer, 'id' | 'checked'>
export type FinishedExamQuestionStorage = Pick<Question, 'id'> & { answers: Array<FinishedExamAnswerStorage> }
export type FinishedExamStorage = {
    date: string,
    questions: FinishedExamQuestionStorage[]
}

export const NavigationRoutes = {
    'index': 0,
    'exam-simulation': 1,
    'finished-exams': 2,
    'first-aid': 3
}
export type NavigationRoutesKeys = keyof typeof NavigationRoutes

export type ParamType = 'examDate'

// First aid

export type FirstAidAnswerParagraphType = { type: "paragraph", text: string }
export type FirstAidAnswerListType = { type: "list", title: string, items: string[] }
export type FirstAidAnswerProcedureType = { type: "procedure", title: string, items: string[] }

export type FirstAidAnswer = FirstAidAnswerParagraphType | FirstAidAnswerListType | FirstAidAnswerProcedureType
export type FirstAidAnswerType = FirstAidAnswer['type']

export type FirstAidQuestion = {
    question: string,
    answers: FirstAidAnswer[]
}