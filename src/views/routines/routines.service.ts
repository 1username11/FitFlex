import { supabase } from '@/supabase'

class RoutinesService {
  getRoutine (id: string) {
    return supabase.from('routines').select('*').match({ id })
  }

  insertRoutine (routine: IRoutine) {
    return supabase.from('routines').insert([routine])
  }

  insertSets (sets: ISetRoutine[]) {
    return supabase.from('exercise_sets').insert(sets)
  }

  getRoutines (userId: string) {
    return supabase.from('routines').select('*').eq('user', userId)
  }

  deleteRoutine (id: string) {
    return supabase.from('routines').delete().eq('id', id)
  }

  getSetsByRoutineId (id: string) {
    return supabase.from('exercise_sets').select('*').eq('routine_id', id)
  }

  getExerciseById (id: string) {
    return supabase.from('exercises').select('*').eq('id', id)
  }

  deleteRoutineSets (id: string) {
    return supabase.from('exercise_sets').delete().eq('routine_id', id)
  }

  insertExerciseStatistics (statistics: IExerciseStatistics) {
    return supabase
      .from('statistics')
      .insert([statistics])
  }

  saveWorkout (workout: IFeed) {
    return supabase
      .from('feed')
      .insert([workout])
  }
}

export const routinesService = new RoutinesService()
