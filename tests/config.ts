import { hasString } from '../src/core/helper'

const API_KEY_ENV = 'NOTION_TO_JEKYLL_API_KEY'
const DATABASE_ID_ENV = 'NOTION_TO_JEKYLL_DATABASE_ID'

const notionApiKey = process.env[API_KEY_ENV] ?? ''
const notionDatabaseId = process.env[DATABASE_ID_ENV] ?? ''

if (!hasString(notionApiKey) || !hasString(notionDatabaseId)) {
  throw new Error(
    `Missing environment variables for test. Required: "${API_KEY_ENV}", "${DATABASE_ID_ENV}"`
  )
}

export { notionApiKey, notionDatabaseId }
