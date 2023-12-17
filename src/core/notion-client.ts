import { Client, isFullDatabase, isFullPage, LogLevel } from '@notionhq/client'
import { Page, Pages } from './model'
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { POST_PATH_NAME, SYNC_TIME_NAME, TAGS_NAME } from './constant'
import { isDateProperty, validateProperty } from './helper'

export class NotionClient {
  readonly #client: Client
  readonly #databaseId: string

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

  async getPages(page_size?: number, cursor?: string): Promise<Pages> {
    const response = await this.#client.databases.query({
      database_id: this.#databaseId,
      page_size: page_size ?? 100,
      start_cursor: cursor
    })

    return {
      contents: response.results
        .filter(isFullPage)
        .map(page => this.#extractPage(page)),
      has_more: response.has_more,
      next_cursor: response.next_cursor
    }
  }

  #extractPage(result: PageObjectResponse): Page {
    const synchronizedTime = result.properties[SYNC_TIME_NAME]
    if (!isDateProperty(synchronizedTime)) {
      throw new Error(`Property ${SYNC_TIME_NAME} is not a date property`)
    }

    return {
      id: result.id,
      last_edited_time: result.last_edited_time,
      synchronized_time: synchronizedTime.date?.start ?? null
    }
  }
}
