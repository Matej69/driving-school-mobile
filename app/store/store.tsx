import { create } from 'zustand'
import { FirstAidQuestion, ImagesMetadata, NavigationRoutesKeys, Question } from '../types/types';

interface StoreState {
    activeTab: NavigationRoutesKeys;
    setActiveTab: (activeTab: NavigationRoutesKeys) => void;
    prevActiveTab: NavigationRoutesKeys;
    allQuestions: Question[];
    setAllQuestions: (questions: Question[]) => void;
    firstAidQuestions: FirstAidQuestion[];
    setFirstAidQuestions: (questions: FirstAidQuestion[]) => void;
    imagesMetadata: ImagesMetadata;
    setImagesMetadata: (imagesMetadata: ImagesMetadata) => void;
}

const useStore = create<StoreState>((set) => ({
    activeTab: 'index',
    prevActiveTab: 'index',
    setActiveTab: (activeTab: NavigationRoutesKeys) =>
      set((state) => {
          state.prevActiveTab = state.activeTab
          state.activeTab = activeTab
          return {...state}
        }
      ),
    allQuestions: [],
    setAllQuestions: (questions: Question[]) =>
      set((state) => {
          state.allQuestions = questions
          return {...state}
        }
      ),
      firstAidQuestions: [],
      setFirstAidQuestions: (questions: FirstAidQuestion[]) =>
        set((state) => {
            state.firstAidQuestions = questions
            return {...state}
          }
        ),
        imagesMetadata: {} as ImagesMetadata,
        setImagesMetadata: (imagesMetadata: ImagesMetadata) =>
          set((state) => {
              state.imagesMetadata = imagesMetadata
              return {...state}
            }
          ),
  }))

export default useStore;
