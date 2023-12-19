import { Page } from '../core/model'
import * as fs from 'fs-extra'
import path from 'node:path'

type SaveResult = {
  synchronized_time: string
  post_path: string
}

export async function saveMarkdownAsFile(
  directory: string,
  page: Page,
  markdown: string
): Promise<SaveResult> {
  const yymmdd = page.last_edited_time.split('T')[0]
  const hyphenatedTitle = page.title.replace(/\s/g, '-')

  const filename = `${yymmdd}-${hyphenatedTitle}.md`
  const filePath = path.join(__dirname, '../', directory, filename)

  const data = [generateMetadata(page), markdown].join('\n\n')

  await fs.outputFile(filePath, data, 'utf-8')

  return {
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
