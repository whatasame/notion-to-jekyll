import { Client } from '@notionhq/client'
import { notionApiKey, notionDatabaseId } from './config'
import { NotionToMarkdown } from 'notion-to-md'
import { NotionToMarkdownClient } from './notion-to-markdown-client'
import { NotionClient } from './notion-client'

const client = new Client({ auth: notionApiKey })
const notionToMarkdown = new NotionToMarkdown({
  notionClient: client,
  config: { separateChildPage: true }
})

export const notionClient = new NotionClient(client, notionDatabaseId)
export const notionToMarkdownClient = new NotionToMarkdownClient(
  notionToMarkdown
)

// TODO getter
// TODO develop debug mode
