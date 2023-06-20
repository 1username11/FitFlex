import { supabase } from '@/supabase'

class ExercisesService {
  getExercises(userId: string) {
    return supabase
      .from('exercises')
      .select('*')
      .or(`user_id.eq.${userId},is_public.eq.true`)
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
    console.log(id)

    return supabase
      .from('exercises')
      .update(exercise)
      .eq('id', `${id}`)
  }

  getExerciseStatistics(id: string) {
    return supabase.from('statistics')
      .select('*')
      .eq('exercise_id', id)
  }

  getExerciseById(id: string) {
    return supabase.from('exercises')
      .select('*')
      .eq('id', id)
      .single()
  }
}

export const exercisesService = new ExercisesService()
