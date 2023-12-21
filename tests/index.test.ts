import { start } from '../src'

beforeAll(() => {
  process.env.INPUT_NOTION_API_KEY = '12345678-9abc-def0-1234-56789abcdef0'
  process.env.INPUT_NOTION_DATABASE_ID = '12345678-9abc-def0-1234-56789abcdef0'
  process.env.INPUT_GITHUB_WORKSPACE =
    '/home/runner/work/notion-to-jekyll/notion-to-jekyll'
})

describe('Bootstrap', () => {
  it('should check post directory exists', async () => {
    await expect(start()).rejects.toThrow(
      '⛔️ Post directory "/home/runner/work/notion-to-jekyll/notion-to-jekyll/_posts" does not exist.'
    )
  })
})
