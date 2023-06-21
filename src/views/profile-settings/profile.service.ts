import { supabase } from '@/supabase'

class ProfileService {
  getProfile (id: string) {
    return supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()
  }

  updateProfile (id: string, updates: any) {
    return supabase.from('profiles').update({
      ...updates
    }).eq('id', id)
  }

  getPublicProfiles () {
    return supabase.from('profiles').select('*').eq('is_public', true).eq('is_banned', false)
  }
}

export const profileService = new ProfileService()
