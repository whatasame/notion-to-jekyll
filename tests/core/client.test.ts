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
    const pages = await client.getTargetPages();

    expect(pages.length).toBeGreaterThan(0);
  });

  it('should be able to recursively query pages of database if has_more is true', async () => {
    const pages = await client.getTargetPages(1);

    expect(pages.length).toBeGreaterThan(1);
  });

  it('should be able to update page properties', async () => {
    const startTime = new Date().toISOString();

    const page = await client.updatePage({
      page_id: process.env.NOTION_TO_JEKYLL_PAGE_ID as string,
      synchronized_time: startTime,
      post_path: '_posts/2023-12-17-same-sync-time.md'
    });

    expect(page.synchronized_time?.localeCompare(startTime)).toBeLessThan(0);
    expect(page.post_path).toEqual('_posts/2023-12-17-same-sync-time.md');
  });

  it('should get markdown by page id', async () => {
    const pageId = process.env.NOTION_TO_JEKYLL_PAGE_ID as string;

    const markdown = await client.getMarkdownAsString(pageId);

    expect(markdown).toBeTruthy();
  });
});
