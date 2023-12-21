import { NotionToJekyllClient } from '../../src/core/client';

describe('Notion to Jekyll client', () => {
  const client = new NotionToJekyllClient({
    notion: {
      apiKey: process.env.NOTION_TO_JEKYLL_API_KEY as string,
      databaseId: process.env.NOTION_TO_JEKYLL_DATABASE_ID as string
    },
    github: {
      workspace: process.env.NOTION_TO_JEKYLL_WORKSPACE as string,
      post_dir: process.env.NOTION_TO_JEKYLL_POST_DIR as string
    }
  });

  it('should be able to validate database has correct properties', async () => {
    await expect(client.validateDatabaseProperties()).resolves.toBeUndefined();
  });

  it('should be able to query pages of database', async () => {
    const pages = await client.getPages();

    expect(pages.contents).toBeDefined();
    for (const page of pages.contents) {
      expect(page.id).toBeDefined();
      expect(page.title).toBeDefined();
      expect(page.categories).toBeDefined();
      expect(page.tags).toBeDefined();
      expect(page.created_time).toBeDefined();
      expect(page.last_edited_time).toBeDefined();
      expect(page.synchronized_time).toBeDefined();
      expect(page.post_path).toBeDefined();
    }
    expect(pages.has_more).toBeDefined();
    expect(pages.next_cursor).toBeDefined();
  });

  it('should be able to update page properties', async () => {
    const startTime = new Date().toISOString();

    const page = await client.updatePage(
      process.env.NOTION_TO_JEKYLL_PAGE_ID as string,
      '_posts/2023-12-17-same-sync-time.md'
    );

    expect(page.synchronized_time?.localeCompare(startTime)).toBeLessThan(0);
    expect(page.post_path).toEqual('_posts/2023-12-17-same-sync-time.md');
  });

  it('should get markdown by page id', async () => {
    const pageId = process.env.NOTION_TO_JEKYLL_PAGE_ID as string;

    const markdown = await client.getMarkdownAsString(pageId);

    expect(markdown).toBeTruthy();
  });
});
