import { NotionClient } from '../../src/core/notion-client'
import { notionApiKey, notionDatabaseId } from '../config'
import { LogLevel } from '@notionhq/client'

describe('Notion client', () => {
  const notionClient = new NotionClient(
    notionApiKey,
    notionDatabaseId,
    LogLevel.DEBUG
  )

  it('should be able to validate database has correct properties', async () => {
    await expect(
      notionClient.validateDatabaseProperties()
    ).resolves.toBeUndefined()
  })

  it('should be able to query pages of database', async () => {
    const pages = await notionClient.getPages()

    expect(pages.contents).toBeDefined()
    for (const page of pages.contents) {
      expect(page.id).toBeDefined()
      expect(page.last_edited_time).toBeDefined()
      expect(page.synchronized_time).toBeDefined()
    }
    expect(pages.has_more).toBeDefined()
    expect(pages.next_cursor).toBeDefined()
  })
})
