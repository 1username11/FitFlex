interface IData {
  id: string
  updated_at: string
  username: string
  full_name: string
  avatar_url: string
  role: any
  bio: string
}

interface IProfileResponse {
  error: any
  data: IData
  count: any
  status: number
  statusText: string
}
