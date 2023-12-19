import { Client, isFullDatabase, isFullPage } from '@notionhq/client'
import { Page, Pages } from './model'
import { POST_PATH_NAME, SYNC_TIME_NAME, TAGS_NAME } from '../config/constant'
import { validateProperty } from '../utils/helper'
import { toPage } from '../utils/mapper'

export class NotionClient {
  readonly #client: Client
  readonly #databaseId: string

  constructor(client: Client, databaseId: string) {
    this.#client = client
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

  async updatePage(pageId: string, postPath: string): Promise<Page> {
    const response = await this.#client.pages.update({
      page_id: pageId,
      properties: {
        [POST_PATH_NAME]: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: postPath
              }
            }
          ]
        },
        [SYNC_TIME_NAME]: {
          date: {
            start: new Date().toISOString()
          }
        }
      }
    })

    if (!isFullPage(response)) {
      throw new Error('Not a page')
    }

    return toPage(response)
  }
}
