import { saveMarkdownAsFile } from './utils/file-manager';
import path from 'path';
import { Client, LogLevel } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { NotionClient } from './core/notion-client';
import * as core from '@actions/core';
import { NotionToMarkdownClient } from './core/notion-to-markdown-client';
import { Page, Pages } from './core/model';

export interface Options {
  notion: {
    apiKey: string;
    databaseId: string;
  };
  github: {
    workspace: string;
    post_dir: string;
  };
}

export async function run(options: Options): Promise<void> {
  const notion = new Client({
    auth: options.notion.apiKey,
    logLevel: core.isDebug() ? LogLevel.DEBUG : LogLevel.WARN
  });
  const notionToMarkdown = new NotionToMarkdown({
    notionClient: notion,
    config: { separateChildPage: true }
  });
  const notionClient = new NotionClient(notion, options.notion.databaseId);
  const notionToMarkdownClient = new NotionToMarkdownClient(notionToMarkdown);

  await notionClient.validateDatabaseProperties();
  const pages = await notionClient.getPages(); // TODO: If pages size is over 100 ?
  for (const page of filterNotSynchronized(pages)) {
    const markdown = await notionToMarkdownClient.getMarkdownAsString(page.id);

    const directory = path.join(
      options.github.workspace,
      options.github.post_dir
    );
    const result = await saveMarkdownAsFile(directory, page, markdown);
    const updatedPage = await notionClient.updatePage(
      page.id,
      result.post_path
    );
    console.log(
      `👻 Synchronized "${updatedPage.title}" to "${updatedPage.post_path}"`
    );
  }
}

export function filterNotSynchronized(pages: Pages): Page[] {
  return pages.contents.filter(
    page =>
      page.synchronized_time === null ||
      new Date(page.synchronized_time) < new Date(page.last_edited_time)
  );
}
