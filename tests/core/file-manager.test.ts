import { Page } from '../../src/core/model'
import { saveMarkdown } from '../../src/core/file-manager'
import * as fs from 'fs-extra'
import { BASE_POST_PATH } from '../../src/core/constant'

afterEach(async () => {
  await fs.remove(BASE_POST_PATH)
})

describe('FileManager', () => {
  const page: Page = {
    id: '12345678-9abc-def0-1234-56789abcdef0',
    title: 'null sync time',
    created_time: '2023-12-17T15:43:00.000Z',
    last_edited_time: '2023-12-18T15:43:00.000Z',
    synchronized_time: null,
    post_path: null
  }

  // TODO: Validate metadata
  const markdown = ` 
## Heading 2

This is a test page.
`

  it('should be able to save markdown file', async () => {
    const uploadedPage = await saveMarkdown(page, markdown)

    expect(uploadedPage).toEqual({
      id: page.id,
      title: page.title,
      created_time: page.created_time,
      last_edited_time: page.last_edited_time,
      synchronized_time: expect.any(String),
      post_path: expect.any(String)
    })
    expect(await fs.pathExists(uploadedPage.post_path as string)).toBe(true)
  })
})
