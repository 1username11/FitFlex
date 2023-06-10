import { supabase } from '@/supabase'

class RoutinesService {
  getRoutine(id: string) {
    return supabase.from('routines').select('*').match({ id })
  }

  insertRoutine(routine) {
    return supabase.from('routines').insert([routine])
  }

  insertSets(sets) {
    return supabase.from('exercise_sets').insert(sets)
  }

  getRotines(userId: string) {
    return supabase.from('routines').select('*').eq('user', userId)
  }

  deleteRoutine(id: string) {
    return supabase.from('routines').delete().eq('id', id)
  }

  insertRoutines(routines) {
    return supabase.from('routines').insert(routines)
  }

  deleteRoutines(userId: string) {
    return supabase.from('routines').delete().eq('user', userId)
  }

  getRoutineExercises(id: string) {
    return supabase.from('routine_exercises').select('*').eq('routine', id)
  }

  getSetsByRoutineId(id: string) {
    return supabase.from('exercise_sets').select('*').eq('routine_id', id)
  }

  getExerciseById(id: string) {
    return supabase.from('exercises').select('*').eq('id', id)
  }

  deleteRoutineSets(id: string) {
    return supabase.from('exercise_sets').delete().eq('routine_id', id)
  }

  updateRoutine(routine) {
    return supabase.from('routines').update(routine).eq('id', routine.id)
  }

  updateSets(sets) {
    return supabase.from('exercise_sets').insert(sets, { upsert: true })
  }

  insertExerciseStatistcs(statistics) {
    return supabase
      .from('statistics')
      .insert([
        statistics
      ])
  }

  saveWorkout(workout) {
    return supabase
      .from('feed')
      .insert([
        workout
      ])
  }
}

export const routinesService = new RoutinesService()
