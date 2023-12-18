import { getNotionClient } from '../../src/core/di-container'

describe('Notion client', () => {
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
      expect(page.last_edited_time).toBeDefined()
      expect(page.synchronized_time).toBeDefined()
      expect(page.post_path).toBeDefined()
    }
    expect(pages.has_more).toBeDefined()
    expect(pages.next_cursor).toBeDefined()
  })
})
