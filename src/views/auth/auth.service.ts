import { supabase } from '@/supabase'

class AuthService {
  async signUp (payload: { email: string; password: string }) {
    return await supabase.auth.signUp({
      email: payload.email,
      password: payload.password
    })
  }
}

export const authService = new AuthService()
