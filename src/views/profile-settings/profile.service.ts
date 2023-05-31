import { supabase } from '@/supabase'

class ProfileService {
  getProfile(id: string) {
    return supabase.from('profiles').select('*').eq('id', id).single()
  }

  getCurrentUser() {
    return supabase.auth.getUser()
  }

  updateProfile(id: string, updates: any) {
    return supabase.from('profiles').update({
      ...updates
    }).eq('id', id)
  }
}

export const profileService = new ProfileService()
