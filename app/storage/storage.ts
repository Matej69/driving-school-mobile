import { FinishedExamStorage, Question } from "../types/types"
import * as FileSystem from 'expo-file-system';

// Equivalent to stored file name
export type StorageKey = 'questions'


  const load = async<ReturnType> (fileName: StorageKey): Promise<ReturnType | undefined> => {
    const filePath = `${FileSystem.documentDirectory}${fileName}.json`;
    try {
      const fileExists = await fileExist(fileName);
      if (fileExists) {
        const content = await FileSystem.readAsStringAsync(filePath, {
          encoding: FileSystem.EncodingType.UTF8,
        });
        return JSON.parse(content) as ReturnType;
      } else {
        console.log(`File '${filePath}' not found`);
      }
    } catch (error) {
      console.error('Error loading file:', error);
    }
  };

  const save = async <ObjToSaveType> (fileName: StorageKey, objectToSave: ObjToSaveType): Promise<boolean> => {
    const filePath = `${FileSystem.documentDirectory}${fileName}.json`;    
    try {
      await FileSystem.writeAsStringAsync(filePath, JSON.stringify(objectToSave), {
        encoding: FileSystem.EncodingType.UTF8,
      });
      return true
    } catch (error) {
      console.error('Error saving file:', error);
      return false
    }
  };

  const fileExist = async (fileName: StorageKey) => {
    const filePath = `${FileSystem.documentDirectory}${fileName}.json`;
    const info = await FileSystem.getInfoAsync(filePath);
    return info.exists;
  };



/**
 * Questions
 */

const loadQuestions = async(): Promise<Question[] | undefined> => {
    return load('questions')
}
// Save requires all questions to be loaded and then saved as completely new file - merge should maybe be implemented
const saveQuestions = async(objectToSave: Question[]): Promise<boolean> => {
    return save('questions', objectToSave)
}

export const storage = {
    fileExist,
    loadQuestions,
    saveQuestions
}