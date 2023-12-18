export type Pages = {
  contents: Page[]
  has_more: boolean
  next_cursor: string | null
}

export type Page = {
  title: string
  id: string
  created_time: string
  last_edited_time: string
  synchronized_time: string | null
  post_path: string | null
}
