import useStore from "../store/store";
import { Answer, FinishedExam, FinishedExamAnswerStorage, FinishedExamQuestionStorage, FinishedExamStorage, Question } from "../types/types";

const answersToStorage = (answers: Answer[]): FinishedExamAnswerStorage[] => {
    return answers.map(a => ({ 
        id: a.id,
        checked: a.checked ?? false
    }))
}

const questionToStorage = (question: Question): FinishedExamQuestionStorage => {
    return {
        id: question.id,
        answers: answersToStorage(question.answers)
    }
}

export const finishedExamToStorage = (questions: Question[]): FinishedExamStorage => {
    return {
        date: new Date().toString(),
        questions: questions.map(q => questionToStorage(q))
    }
}

/**
 * storageQuestions for specific stored finished exam combined with questionsMap(holds correct answers) will give questions filled with correct/incorrect answers
 */
const storageToFinishedExamQuestions = (examsQuestionStorage: FinishedExamQuestionStorage[], allQuestionsMap: Map<number, Question>): Question[] => {
    return examsQuestionStorage
        .filter(examQStorage => allQuestionsMap.has(examQStorage.id))
        .map(examQStorage => {
            const question = allQuestionsMap.get(examQStorage.id)!;
            examQStorage.answers.forEach((answer, i) => {
                question.answers[i].checked = answer.checked                
            });
            return question
        })
}

export const storageToFinishedExam = (examStorage: FinishedExamStorage[], allQuestions: Question[]): FinishedExam[] => {
    // Map that holds exam date as first level id and has Map<number, Question> as value
    // Questions will be duplicated in multiple exam date groups but will allow for faster access
    const storedExamMap = new Map<string, Map<number, Question>>()
    examStorage.forEach(exam => {
        let questions = new Map<number, Question>()
        exam.questions.forEach((storedQ => {
            if(!questions.has(storedQ.id))
                questions.set(storedQ.id, allQuestions.find(q => q.id == storedQ.id)!)
        }))
        storedExamMap.set(exam.date, questions)
    })
    // Pass proper question myp by date key
    const exams: FinishedExam[] = examStorage.map(s => ({
        date: new Date(s.date),
        questions: storageToFinishedExamQuestions(s.questions, storedExamMap.get(s.date)!)
    } as FinishedExam))
    return exams;
}