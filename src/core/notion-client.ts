import { Client, isFullDatabase, isFullPage } from '@notionhq/client'
import { Page, Pages, PROPERTY_NAMES } from './model'
import { validateProperty } from '../utils/helper'
import { toPage } from '../utils/mapper'

export class NotionClient {
  readonly #client: Client
  readonly #databaseId: string

  constructor(client: Client, databaseId: string) {
    this.#client = client
    this.#databaseId = databaseId
  }

  async validateDatabaseProperties(): Promise<void> {
    const database = await this.#client.databases.retrieve({
      database_id: this.#databaseId
    })
    if (!isFullDatabase(database)) {
      throw new Error('Not a database')
    }

    validateProperty(database.properties, PROPERTY_NAMES.TAGS, 'multi_select')
    validateProperty(database.properties, PROPERTY_NAMES.SYNC_TIME, 'date')
    validateProperty(database.properties, PROPERTY_NAMES.POST_PATH, 'rich_text')
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
        [PROPERTY_NAMES.POST_PATH]: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: postPath
              }
            }
          ]
        },
        [PROPERTY_NAMES.SYNC_TIME]: {
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
