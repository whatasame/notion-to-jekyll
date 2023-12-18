import { Client } from '@notionhq/client'
import { notionApiKey } from './config'
import { NotionToMarkdown } from 'notion-to-md'
import { NotionToMarkdownClient } from './notion-to-markdown-client'

const client = new Client({ auth: notionApiKey })
const notionToMarkdown = new NotionToMarkdown({
  notionClient: client,
  config: { separateChildPage: true }
})

// export const notionClient = new NotionClient(client);
export const notionToMarkdownClient = new NotionToMarkdownClient(
  notionToMarkdown
)
