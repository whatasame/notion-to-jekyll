import { getNotionToMarkdownClient } from '../../src/core/di-container'

describe('NotionToMarkdownClient', () => {
  const notionToMarkdownClient = getNotionToMarkdownClient()

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

  // TODO: page id로 markdown 파일을 __posts에 저장하는 테스트
})
