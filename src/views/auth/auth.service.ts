import { supabase } from '@/supabase'

class AuthService {
  signUp(payload: IAuthForm) {
    return supabase.auth.signUp({
      email: payload.email,
      password: payload.password
    })
  }

  signInWithOAuth () {
    return supabase.auth.signInWithOAuth({
      provider: 'google'
    })
  }
}

export const authService = new AuthService()
