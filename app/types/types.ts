export type Answer = {
    id: number, 
    text: string, 
    correct: boolean, 
    checked: boolean
}

export type Question =  { 
    id: number, 
    title: string, 
    img?: string,
    answers: Answer[] 
}