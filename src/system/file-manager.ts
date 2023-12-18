import { Page } from '../core/model'
import * as fs from 'fs-extra'
import path from 'node:path'
import { BASE_POST_PATH } from '../config/constant'

export async function saveMarkdown(
  page: Page,
  markdown: string
): Promise<Page> {
  const yymmdd = page.last_edited_time.split('T')[0]
  const hyphenatedTitle = page.title.replace(/\s/g, '-')

  const filename = `${yymmdd}-${hyphenatedTitle}.md`
  const filePath = path.join(BASE_POST_PATH, filename)

  const data = [generateMetadata(page), markdown].join('\n\n')

  await fs.outputFile(filePath, data, 'utf-8')

  return {
    title: page.title,
    id: page.id,
    categories: page.categories,
    tags: page.tags,
    created_time: page.created_time,
    last_edited_time: page.last_edited_time,
    synchronized_time: new Date().toISOString(),
    post_path: filePath
  }
}

function generateMetadata(page: Page): string {
  const yymmdd = page.created_time.split('T')[0]

  const metadataLines = [
    '---',
    'layout: post',
    `title: ${page.title}`,
    `date: ${yymmdd}`,
    `categories: [${page.categories.join(', ')}]`,
    `tags: [${page.tags.join(', ')}]`,
    '---'
  ]

  return metadataLines.join('\n')
}
