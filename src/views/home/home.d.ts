interface IJsonData {
  id: string
  title: string
  exercise_type: string
  equipment_category: string
  muscle_group: string
  thumbnails_url: string
  sets: ISet[]
}

interface IFeed {
  created_at: number
  user_id: string
  description: string
  media_url: string
  duration: string
  feed_id: string
  json_data: IJsonData[]
}

interface IFeedResponse {
  created_at: number
  user_id: string
  description: string
  media_url: string
  duration: string
  feed_id: string
  json_data: string
}
