import { NotionToMarkdown } from 'notion-to-md';

export class NotionToMarkdownClient {
  readonly #client: NotionToMarkdown;

  constructor(notionToMarkdown: NotionToMarkdown) {
    this.#client = notionToMarkdown;
  }

  async getMarkdownAsString(pageId: string): Promise<string> {
    const mdBlocks = await this.#client.pageToMarkdown(pageId);

    return this.#client.toMarkdownString(mdBlocks)['parent'];
  }
}
