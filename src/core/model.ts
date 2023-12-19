export type Pages = {
  contents: Page[]
  has_more: boolean
  next_cursor: string | null
}

export type Page = {
  id: string
  title: string
  categories: string[]
  tags: string[]
  created_time: string
  last_edited_time: string
  synchronized_time: string | null
  post_path: string | null
}

export const PROPERTY_NAMES = {
  TITLE: '[notion-to-jekyll] title',
  CATEGORIES: '[notion-to-jekyll] categories',
  TAGS: '[notion-to-jekyll] tags',
  SYNC_TIME: '[notion-to-jekyll] sync time',
  POST_PATH: '[notion-to-jekyll] post path'
}
