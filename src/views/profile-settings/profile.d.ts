interface IProfile {
  id: string
  created_at?: string
  updated_at?: string
  username: string
  full_name: string
  avatar_url?: string
  role: any
  bio: string
  is_banned: boolean
  lat?: number
  lng?: number
  phone_number?: string
  telegram_link?: string
  e_mail?: string
  other_contact_info?: string
  additional_info?: string
  is_public: boolean
  body_weight?: number
}

interface IProfileResponse {
  error: any
  data: IProfile
  count: any
  status: number
  statusText: string
}
