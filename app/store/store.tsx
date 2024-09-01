import { create } from 'zustand'
import { NavigationRoutesKeys } from '../types/types';

interface StoreState {
    activeTab: NavigationRoutesKeys;
    setActiveTab: (activeTab: NavigationRoutesKeys) => void;
    prevActiveTab: NavigationRoutesKeys;
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
  }))

export default useStore;
