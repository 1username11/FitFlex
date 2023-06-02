import { supabase } from '@/supabase'

class ExercisesService {
  getExercises() {
    return supabase
      .from('exercises')
      .select('*')
  }

  getMuscleGroups() {
    return supabase
      .from('muscle_groups')
      .select('*')
  }

  getExerciseTypes() {
    return supabase
      .from('exercise_type')
      .select('*')
  }

  getEquipment() {
    return supabase
      .from('equipment_category')
      .select('*')
  }

  insertExercise(exercise: Omit<IExerciseExchange, 'id' | 'created_at' | 'secondary_muscles'>) {
    return supabase
      .from('exercises')
      .insert([exercise])
  }

  uploadExercisesMedia(fileName: string, file: File, directory: string) {
    return supabase.storage
      .from(directory)
      .upload(fileName, file)
  }

  getResizedImageForThumbnails(fileName: string) {
    return supabase.storage
      .from('thumbnails')
      .createSignedUrl(fileName, 365 * 24 * 3600, {
        transform: {
          width: 50,
          height: 50
        }
      })
  }

  getExerciseMedia(fileName: string) {
    return supabase.storage
      .from('exercises')
      .createSignedUrl(fileName, 365 * 24 * 3600)
  }

  deleteExercise(id: string) {
    return supabase
      .from('exercises')
      .delete()
      .match({ id })
  }

  updateExercise(id: string, exercise: Partial<IExerciseExchange>) {
    return supabase
      .from('exercises')
      .update(exercise)
      .eq('id', `${id}`)
  }
}

export const exercisesService = new ExercisesService()
