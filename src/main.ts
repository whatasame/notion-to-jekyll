import { getNotionClient, getNotionToMarkdownClient } from './core/di-container'
import { filterNotSynchronized } from './utils/filter'
import { saveMarkdown } from './system/file-manager'
import { commit } from './system/git'
import { BASE_POST_PATH } from './config/constant'

export async function run(): Promise<void> {
  const notionClient = getNotionClient()
  const notionToMarkdownClient = getNotionToMarkdownClient()

  await notionClient.validateDatabaseProperties()
  const pages = await notionClient.getPages()
  const targetPages = filterNotSynchronized(pages)

  for (const page of targetPages) {
    const markdown = await notionToMarkdownClient.getMarkdownFromPage(page.id)

    // TODO: Update Notion page property
    await saveMarkdown(page, markdown)
  }

  await commit(BASE_POST_PATH, 'Update post')
}
