interface IProfile {
  id: string
  created_at?: string
  updated_at?: string
  username: string
  full_name: string
  avatar_url: string
  role: any
  bio: string
  is_banned: boolean
}

interface IProfileResponse {
  error: any
  data: IProfile
  count: any
  status: number
  statusText: string
}
