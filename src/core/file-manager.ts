import { Page } from './model'
import * as fs from 'fs-extra'
import path from 'node:path'
import { BASE_POST_PATH } from './constant'

export async function saveMarkdown(
  page: Page,
  markdown: string
): Promise<Page> {
  const yymmdd = page.last_edited_time.split('T')[0]
  const hyphenatedTitle = page.title.replace(/\s/g, '-')

  const filename = `${yymmdd}-${hyphenatedTitle}.md`
  const filePath = path.join(BASE_POST_PATH, filename)

  try {
    await fs.outputFile(filePath, markdown, 'utf-8')
    console.log(`Saved ${filePath}`)
  } catch (error) {
    console.error(`Failed to save ${filePath}`, error)
    throw error
  }

  return {
    title: page.title,
    id: page.id,
    tags: page.tags,
    created_time: page.created_time,
    last_edited_time: page.last_edited_time,
    synchronized_time: new Date().toISOString(),
    post_path: filePath
  }
}
