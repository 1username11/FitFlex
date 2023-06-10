import { supabase } from '@/supabase'

class HomeService {
  getFeeds(userId: string) {
    return supabase.from('feed').select('*').eq('user_id', userId)
  }
}

export const homeService = new HomeService()
