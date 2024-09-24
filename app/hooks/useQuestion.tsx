import { useState } from "react";
import { Question } from "../types/types";
  

export const useQuestion = (p: {question: Question}) => {
    const [question, setQuestion] = useState(p.question);

    const toogleQuestionCheck = (answerId: number) => {
        const answer = question.answers.find((a => a.id == answerId));
        if(answer) {
            answer.checked = !answer.checked
            setQuestion({...question});
        }
    }

    return { question, toogleQuestionCheck }
   
}