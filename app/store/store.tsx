import { create } from 'zustand'
import { FirstAidQuestion, NavigationRoutesKeys, Question } from '../types/types';

interface StoreState {
    activeTab: NavigationRoutesKeys;
    setActiveTab: (activeTab: NavigationRoutesKeys) => void;
    prevActiveTab: NavigationRoutesKeys;
    setAllQuestions: (questions: Question[]) => void;
    allQuestions: Question[];
    setFirstAidQuestions: (questions: FirstAidQuestion[]) => void;
    firstAidQuestions: FirstAidQuestion[];
}

const useStore = create<StoreState>((set) => ({
    activeTab: 'index',
    setActiveTab: (activeTab: NavigationRoutesKeys) =>
      set((state) => {
          state.prevActiveTab = state.activeTab
          state.activeTab = activeTab
          return {...state}
        }
      ),
    prevActiveTab: 'index',
    setAllQuestions: (questions: Question[]) =>
      set((state) => {
          state.allQuestions = questions
          return {...state}
        }
      ),
      allQuestions: [],
      setFirstAidQuestions: (questions: FirstAidQuestion[]) =>
        set((state) => {
            state.firstAidQuestions = questions
            return {...state}
          }
        ),
        firstAidQuestions: [],
  }))

export default useStore;
