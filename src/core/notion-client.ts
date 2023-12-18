import { Client, isFullDatabase, isFullPage, LogLevel } from '@notionhq/client'
import { Pages } from './model'
import { POST_PATH_NAME, SYNC_TIME_NAME, TAGS_NAME } from './constant'
import { validateProperty } from './helper'
import { toPage } from './mapper'

export class NotionClient {
  readonly #client: Client
  readonly #databaseId: string

  // TODO: Client injection
  constructor(apiKey: string, databaseId: string, logLevel?: LogLevel) {
    this.#client = new Client({
      auth: apiKey,
      logLevel
    })
    this.#databaseId = databaseId
  }

  // TODO: Run immediately after instantiation
  async validateDatabaseProperties(): Promise<void> {
    const database = await this.#client.databases.retrieve({
      database_id: this.#databaseId
    })
    if (!isFullDatabase(database)) {
      throw new Error('Not a database')
    }

    validateProperty(database.properties, TAGS_NAME, 'multi_select')
    validateProperty(database.properties, SYNC_TIME_NAME, 'date')
    validateProperty(database.properties, POST_PATH_NAME, 'rich_text')
  }

  async getPages(page_size = 100, cursor?: string): Promise<Pages> {
    const response = await this.#client.databases.query({
      database_id: this.#databaseId,
      page_size,
      start_cursor: cursor
    })

    return {
      contents: response.results.filter(isFullPage).map(toPage),
      has_more: response.has_more,
      next_cursor: response.next_cursor
    }
  }
}
