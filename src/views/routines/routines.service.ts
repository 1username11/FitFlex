import { supabase } from '@/supabase'

class RoutinesService {
  getRoutines() {
    return supabase.from('routines').select('*')
  }

  getRoutine(id: string) {
    return supabase.from('routines').select('*').match({ id })
  }

  insertRoutine(routine) {
    return supabase.from('routines').insert([routine])
  }
  
}

export const routinesService = new RoutinesService()
