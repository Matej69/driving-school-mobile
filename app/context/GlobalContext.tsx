import { createContext, useContext } from 'react';
import { Question } from '../types/types';

export type GlobalContextProps = {
    allQuestions: Question[]
}

export const GlobalContext = createContext<GlobalContextProps>({
    allQuestions: []
});