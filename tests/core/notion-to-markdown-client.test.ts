import { NotionToMarkdownClient } from '../../src/core/notion-to-markdown-client'
import { notionToMarkdownClient } from '../../src/core/di-container'

describe('NotionToMarkdownClient', () => {
  const pageId = process.env.NOTION_TO_JEKYLL_PAGE_ID
  if (!pageId) {
    throw new Error(
      `Missing environment variable for test. Required: "NOTION_TO_JEKYLL_PAGE_ID"`
    )
  }

  it('should get markdown by page id', async () => {
    const markdown = await notionToMarkdownClient.getMarkdownFromPage(pageId)

    expect(markdown).toBeTruthy()
  })
})
