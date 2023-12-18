import { Client, LogLevel } from '@notionhq/client'
import { notionApiKey, notionDatabaseId } from './config'
import { NotionToMarkdown } from 'notion-to-md'
import { NotionToMarkdownClient } from './notion-to-markdown-client'
import { NotionClient } from './notion-client'
import { simpleGit, SimpleGit } from 'simple-git'

let client: Client | null = null
let notionToMarkdown: NotionToMarkdown | null = null
let notionClient: NotionClient | null = null
let notionToMarkdownClient: NotionToMarkdownClient | null = null

let gitClient: SimpleGit | null = null

function getClient(): Client {
  if (client === null) {
    client = new Client({
      auth: notionApiKey,
      logLevel: process.env.NOTION_TO_JEKYLL_DEBUG
        ? LogLevel.DEBUG
        : LogLevel.WARN
    })
  }
  return client
}

function getNotionToMarkdown(): NotionToMarkdown {
  if (notionToMarkdown === null) {
    notionToMarkdown = new NotionToMarkdown({
      notionClient: getClient(),
      config: { separateChildPage: true }
    })
  }
  return notionToMarkdown
}

export function getNotionClient(): NotionClient {
  if (notionClient === null) {
    notionClient = new NotionClient(getClient(), notionDatabaseId)
  }
  return notionClient
}

export function getNotionToMarkdownClient(): NotionToMarkdownClient {
  if (notionToMarkdownClient === null) {
    notionToMarkdownClient = new NotionToMarkdownClient(getNotionToMarkdown())
  }
  return notionToMarkdownClient
}

export function getGitClient(): SimpleGit {
  if (gitClient === null) {
    gitClient = simpleGit()
  }
  return gitClient
}
