let notionApiKey: string | null = null
let notionDatabaseId: string | null = null
let commitAuthor: string | null = null
let commitEmail: string | null = null

// TODO: Improve
export function initialize(
  apiKey: string,
  databaseId: string,
  author: string,
  email: string
): void {
  notionApiKey = apiKey
  notionDatabaseId = databaseId
  commitAuthor = author
  commitEmail = email
}

export function initializeNotionApiKey(apiKey: string): void {
  notionApiKey = apiKey
}

export function initializeNotionDatabaseId(databaseId: string): void {
  notionDatabaseId = databaseId
}

export function initializeCommitAuthor(author: string): void {
  commitAuthor = author
}

export function initializeCommitEmail(email: string): void {
  commitEmail = email
}

export function getNotionApiKey(): string {
  if (notionApiKey === null) {
    throw new Error('Notion API key is not set')
  }
  return notionApiKey
}

export function getNotionDatabaseId(): string {
  if (notionDatabaseId === null) {
    throw new Error('Notion database id is not set')
  }
  return notionDatabaseId
}

export function getCommitAuthor(): string {
  if (commitAuthor === null) {
    throw new Error('Commit author is not set')
  }
  return commitAuthor
}

export function getCommitEmail(): string {
  if (commitEmail === null) {
    throw new Error('Commit email is not set')
  }
  return commitEmail
}
