import { supabase } from '@/supabase'

class ExercisesService {
  getExercises () {
    return supabase
      .from('exercises')
      .select('*')
  }

  getMuscleGroups () {
    return supabase
      .from('muscle_groups')
      .select('*')
  }

  getExerciseTypes () {
    return supabase
      .from('exercise_type')
      .select('*')
  }

  getEquipment () {
    return supabase
      .from('equipment_category')
      .select('*')
  }
}

export const exercisesService = new ExercisesService()
