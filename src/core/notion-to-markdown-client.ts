import { NotionToMarkdown } from 'notion-to-md'
import { MdStringObject } from 'notion-to-md/build/types'

export class NotionToMarkdownClient {
  readonly #client: NotionToMarkdown

  constructor(notionToMarkdown: NotionToMarkdown) {
    this.#client = notionToMarkdown
  }

  async getMarkdownFromPage(pageId: string): Promise<MdStringObject> {
    const mdBlocks = await this.#client.pageToMarkdown(pageId)

    return this.#client.toMarkdownString(mdBlocks)
  }
}
