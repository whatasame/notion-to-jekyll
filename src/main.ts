import { getNotionClient, getNotionToMarkdownClient } from './core/di-container'
import { filterNotSynchronized } from './utils/filter'
import { saveMarkdown } from './system/file-manager'
import { commit } from './system/git'
import { BASE_POST_PATH } from './config/constant'
import path from 'path'
import * as fs from 'fs-extra'

export async function run(workspace: string): Promise<void> {
  const notionClient = getNotionClient()
  const notionToMarkdownClient = getNotionToMarkdownClient()

  await notionClient.validateDatabaseProperties()
  const pages = await notionClient.getPages() // TODO: If pages size is over 100 ?
  const targetPages = filterNotSynchronized(pages)

  for (const page of targetPages) {
    const markdown = await notionToMarkdownClient.getMarkdownFromPage(page.id)

    const saved = await saveMarkdown(page, markdown)
    const updated = await notionClient.updatePage(
      page.id,
      saved.post_path as string
    )

    console.log(`Synchronized ${updated.title} to ${updated.post_path}`)
  }

  await fs.copy(
    path.join(__dirname, '../', BASE_POST_PATH),
    path.join(workspace, BASE_POST_PATH)
  )
  await commit(path.join(workspace, BASE_POST_PATH), 'Update post')
}
