import { FinishedExamStorage } from "../types/types"
import AsyncStorage from '@react-native-async-storage/async-storage';

export type StorageKey = 'questions' | 'finished-exams'

const load = async <ReturnType> (key: StorageKey): Promise<ReturnType | null> => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value ? JSON.parse(value) as ReturnType : null;
      } catch (error) {
        console.error('Error loading item:', error);
        return null
      }
  };

const save = async <ObjToSaveType> (key: StorageKey, objectToSave: ObjToSaveType): Promise<boolean> => {
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
const merge = async <ObjToAddType, LoadType extends ObjToAddType[]> (
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

const loadFinishedExams = async(): Promise<FinishedExamStorage[] | null> => {
    return load('finished-exams')
}
const saveFinishedExams = async(objectToSave: FinishedExamStorage): Promise<boolean> => {
    return save('finished-exams', objectToSave)
}
const mergeFinishedExams = async(objectToSave: FinishedExamStorage, mergePositionType: MergePositionType): Promise<boolean> => {
    return merge('finished-exams', objectToSave, mergePositionType)
}



export const asyncStorage = {
    loadFinishedExams,
    saveFinishedExams, 
    mergeFinishedExams
}