import { FinishedExamStorage } from "../types/types"
import AsyncStorage from '@react-native-async-storage/async-storage';

export type StorageKey = 'questions' | 'finished-exams'

export const load = async <ReturnType> (key: StorageKey): Promise<ReturnType | null> => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value ? JSON.parse(value) as ReturnType : null;
      } catch (error) {
        console.error('Error loading item:', error);
        return null
      }
  };

export const save = async <ObjToSaveType> (key: StorageKey, objectToSave: ObjToSaveType): Promise<boolean> => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(objectToSave))
        return true
      } catch (error) {
        console.error('Error saving item:', error);
        return false
      }
  };

  
  export type MergePositionType = 'start' | 'end'
  
  /**
   * Works only on lists by adding element in existing list
   * If existing loaded list is null it will save object as list where object is only element
   */
export const merge = async <ObjToAddType, LoadType extends ObjToAddType[]> (
    key: StorageKey, 
    objectToSave: ObjToAddType,
    mergePositionType: MergePositionType): Promise<boolean> => 
    {
        try {
            const value = await load<LoadType>(key);
            if(!value) {
                await AsyncStorage.setItem(key, JSON.stringify([objectToSave]))
            }
            else {
                switch(mergePositionType) {
                    case "start": value.unshift(objectToSave); break;
                    case "end": value.push(objectToSave); break;
                }     
                await AsyncStorage.setItem(key, JSON.stringify(value))
            }
            return true
        } catch (error) {
          console.error('Error merging item:', error);
          return false
        }
    };

/**
 * Questions
 */



/*
 * Finished exams
*/

const loadFinishedExams = (): FinishedExamStorage[]  => {
    // load from storage
    return examStorageMockedData
}



const examStorageMockedData: FinishedExamStorage[] = [
    {
        date: new Date(),
        questions: [
            { 
                id: 1, 
                answers: [
                    { id: 1, checked: true },
                    { id: 2, checked: false },
                    { id: 3, checked: true },
                    { id: 4, checked: true }                            
                ]},
            {
                id: 2, 
                answers: [
                    { id: 1, checked: true },
                    { id: 2, checked: false },
                    { id: 3, checked: true },
                    { id: 4, checked: true }                            
                ]}
        ]
    },
    {
        date: new Date(),
        questions: [
            { 
                id: 2, 
                answers: [
                    { id: 1, checked: true },
                    { id: 2, checked: false },
                    { id: 3, checked: true },
                    { id: 4, checked: true }                            
                ]},
            {
                id: 2, 
                answers: [
                    { id: 1, checked: true },
                    { id: 2, checked: false },
                    { id: 3, checked: true },
                    { id: 4, checked: true }                            
                ]}
        ]
    },
]