import { getNotionToMarkdownClient } from '../../src/core/di-container'
import {
  initializeNotionApiKey,
  initializeNotionDatabaseId
} from '../../src/config/secret'

describe('NotionToMarkdownClient', () => {
  // TODO: Not use as string?
  initializeNotionApiKey(process.env.NOTION_TO_JEKYLL_API_KEY as string)
  initializeNotionDatabaseId(process.env.NOTION_TO_JEKYLL_DATABASE_ID as string)

  const notionToMarkdownClient = getNotionToMarkdownClient()

  const pageId = process.env.NOTION_TO_JEKYLL_PAGE_ID as string

  it('should get markdown by page id', async () => {
    const markdown = await notionToMarkdownClient.getMarkdownFromPage(pageId)

    expect(markdown).toBeTruthy()
  })

  // TODO: page id로 markdown 파일을 __posts에 저장하는 테스트
})
