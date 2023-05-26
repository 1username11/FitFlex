import { supabase } from '@/supabase'

class AuthService {
  signUp (payload: IAuthForm) {
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

  signInWithPassword(payload: IAuthForm) {
    return supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password
    })
  }

  resetPasswordForEmail (payload: IAuthForm['email']) {
    return supabase.auth.resetPasswordForEmail(payload, { redirectTo: 'http://localhost:5173/auth/update-password' })
  }

  updatePassword(password: IAuthForm['password']) {
    return supabase.auth.updateUser({ password })
  }
}

export const authService = new AuthService()
