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

export const storageToFinishedExams = (examsStorage: FinishedExamStorage[], allQuestions: Question[]): FinishedExam[] => {
    const exams: FinishedExam[] = examsStorage.map(exam => {
        let questionsMap = new Map<number, Question>()
        exam.questions.forEach((storedQ => {
            if(!questionsMap.has(storedQ.id))
                questionsMap.set(storedQ.id, allQuestions.find(q => q.id == storedQ.id)!)
        }))
        return {
            date: new Date(exam.date),
            questions: storageToFinishedExamQuestions(exam.questions, questionsMap)
        } as FinishedExam
    })
    return exams;
}