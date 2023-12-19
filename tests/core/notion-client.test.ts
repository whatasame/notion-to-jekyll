import { getNotionClient } from '../../src/core/di-container'
import {
  initializeNotionApiKey,
  initializeNotionDatabaseId
} from '../../src/config/secret'

describe('Notion client', () => {
  // TODO: Not use as string?
  initializeNotionApiKey(process.env.NOTION_TO_JEKYLL_API_KEY as string)
  initializeNotionDatabaseId(process.env.NOTION_TO_JEKYLL_DATABASE_ID as string)
  const notionClient = getNotionClient()

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
})
