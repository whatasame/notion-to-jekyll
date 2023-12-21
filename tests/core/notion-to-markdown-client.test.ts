import { NotionToMarkdownClient } from '../../src/core/notion-to-markdown-client';
import { NotionToMarkdown } from 'notion-to-md';
import { Client, LogLevel } from '@notionhq/client';

describe('NotionToMarkdownClient', () => {
  const notionToMarkdownClient = new NotionToMarkdownClient(
    new NotionToMarkdown({
      notionClient: new Client({
        auth: process.env.NOTION_TO_JEKYLL_API_KEY as string,
        logLevel: LogLevel.DEBUG
      }),
      config: { separateChildPage: true }
    })
  );

  const pageId = process.env.NOTION_TO_JEKYLL_PAGE_ID as string;

  it('should get markdown by page id', async () => {
    const markdown = await notionToMarkdownClient.getMarkdownAsString(pageId);

    expect(markdown).toBeTruthy();
  });
});
