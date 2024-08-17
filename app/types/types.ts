export type Answer = {
    id: number, 
    text: string, 
    correct: boolean, 
    checked: boolean
}

export type Question =  { 
    id: number, 
    question: string, 
    imagesUrls?: string[],
    answers: Answer[],
    incorrectlyAnswered: number
}

export type AnswerInteractivityType = 'CAN_BE_ANSWERED' | 'ANSWERED_AND_DISABLED' | 'CORRECT_ANSWERED_SHOWN'