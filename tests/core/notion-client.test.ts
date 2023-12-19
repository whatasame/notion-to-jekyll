import { NotionClient } from '../../src/core/notion-client'
import { Client, LogLevel } from '@notionhq/client'

describe('Notion client', () => {
  const notionClient = new NotionClient(
    new Client({
      auth: process.env.NOTION_TO_JEKYLL_API_KEY as string,
      logLevel: LogLevel.DEBUG
    }),
    process.env.NOTION_TO_JEKYLL_DATABASE_ID as string
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
      expect(page.title).toBeDefined()
      expect(page.categories).toBeDefined()
      expect(page.tags).toBeDefined()
      expect(page.created_time).toBeDefined()
      expect(page.last_edited_time).toBeDefined()
      expect(page.synchronized_time).toBeDefined()
      expect(page.post_path).toBeDefined()
    }
    expect(pages.has_more).toBeDefined()
    expect(pages.next_cursor).toBeDefined()
  })

  it('should be able to update page properties', async () => {
    const startTime = new Date().toISOString()

    const page = await notionClient.updatePage(
      process.env.NOTION_TO_JEKYLL_PAGE_ID as string,
      '__posts/2023-12-17-same-sync-time.md'
    )

    expect(page.synchronized_time?.localeCompare(startTime)).toBeLessThan(0)
    expect(page.post_path).toEqual('__posts/2023-12-17-same-sync-time.md')
  })
})
