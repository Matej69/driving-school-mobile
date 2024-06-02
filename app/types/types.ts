export type Answer = {
    id: number, 
    text: string, 
    correct: boolean, 
    checked: boolean
}

export type Question =  { 
    id: number, 
    question: string, 
    img?: string,
    answers: Answer[],
}