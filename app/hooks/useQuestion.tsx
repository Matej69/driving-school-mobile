import { useEffect, useRef, useState } from "react";
import { Question } from "../types/types";


// const questionsInit: Question = 
//     { 
//       id: 1,
//       title: 'Prema položaju automobila ispred vas na prometnoj traci kako bi trebao postupiti vozač tog automobila u situaciji kao na slici', 
//       answers: [
//         { id: 0, text: 'aa aa a automobila ispred vas na prometa a automobila ispred vas na promet a a a a a a a a automobila ispred vas na prometnoj traci automobila ispred vas na prometnoj traci aaaaaaaaaaaaaaaaaaaa', correct: true, checked: false },
//         { id: 1, text: 'ba a a a a a a a a a automobila ispred vas na a a automobila ispred vas na prometprometnoj traci automobila ispred vas na prometnoj traci aaaaaaaaaaaaaaaaaaaa', correct: false, checked: true },
//         { id: 2, text: 'ca a a a a a automobila ispred vas na prometa a a a a a automobila ispred vas na prometnoj traci automobila ispred vas na prometnoj traci aaaaaaaaaaaaaaaaaaaa', correct: true, checked: false },
//         { id: 3, text: 'da a a a a a a a a a automobila ispred vas na prometnoj traci automobila ispred vas na prometnoj traci aaaaaaaaaaaaaaaaaaaa', correct: false, checked: false },
//       ]
//     }
  

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