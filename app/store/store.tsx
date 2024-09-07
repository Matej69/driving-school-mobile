import { create } from 'zustand'
import { NavigationRoutesKeys, Question } from '../types/types';

interface StoreState {
    activeTab: NavigationRoutesKeys;
    setActiveTab: (activeTab: NavigationRoutesKeys) => void;
    prevActiveTab: NavigationRoutesKeys;
    setAllQuestions: (questions: Question[]) => void;
    allQuestions: Question[];
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
  }))

export default useStore;
