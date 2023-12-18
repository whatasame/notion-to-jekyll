import { getNotionClient, getNotionToMarkdownClient } from './core/di-container'
import { filterNotSynchronized } from './core/utils'
import { saveMarkdown } from './core/file-manager'
import { commit } from './system/git'
import { BASE_POST_PATH } from './core/constant'

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

run()
