import { supabase } from '@/supabase'

class HomeService {
  getFeeds (userId: string, fromStep: number, toStep: number) {
    return supabase
      .from('feed')
      .select('*')
      .eq('user_id', userId)
      .range(fromStep, fromStep + toStep)
  }

  getWorkoutsDuration (userId: string, timestamp: number) {
    return supabase
      .from('feed')
      .select('created_at, duration')
      .gt('created_at', timestamp)
      .eq('user_id', userId)
  }
}

export const homeService = new HomeService()
