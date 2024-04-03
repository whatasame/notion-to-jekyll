import { Client, isFullDatabase, isFullPage, LogLevel } from '@notionhq/client';
import { Page, PROPERTIES } from './model';
import { validateProperty } from '../utils/helper';
import { toPage, toPath } from '../utils/mapper';
import { NotionToMarkdown } from 'notion-to-md';
import * as core from '@actions/core';
import path from 'path';
import { isExistPath } from '../utils/file-manager';
import { isChecked } from '../utils/filter';
import * as fs from 'fs-extra';

export interface Inputs {
  notion: NotionOptions;
  github: GithubOptions;
  post: PostOptions;
}

interface NotionOptions {
  apiKey: string;
  databaseId: string;
}

interface GithubOptions {
  workspace: string;
}

interface PostOptions {
  dir: string;
  layout: string;
  skipLayout: boolean;
}

type SaveResult = {
  page_id: string;
  synchronized_time: string;
  post_path: string;
};

export class NotionToJekyllClient {
  readonly #notionClient: Client;
  readonly #n2mClient: NotionToMarkdown;
  readonly #notionOptions: NotionOptions;
  readonly #githubOptions: GithubOptions;
  readonly #postOptions: PostOptions;

  constructor(options: Inputs) {
    this.#notionClient = new Client({
      auth: options.notion.apiKey,
      logLevel: core.isDebug() ? LogLevel.DEBUG : LogLevel.WARN
    });
    this.#n2mClient = new NotionToMarkdown({
      notionClient: this.#notionClient,
      config: { separateChildPage: true, convertImagesToBase64: true }
    });
    this.#notionOptions = options.notion;
    this.#githubOptions = options.github;
    this.#postOptions = options.post;
  }

  async validateDatabaseProperties(): Promise<void> {
    const db = await this.#notionClient.databases.retrieve({
      database_id: this.#notionOptions.databaseId
    });
    if (!isFullDatabase(db)) {
      throw new Error('Not a database');
    }

    validateProperty(db.properties, PROPERTIES);
  }

  validatePostDirectory(): void {
    if (!isExistPath(this.#githubOptions.workspace, this.#postOptions.dir)) {
      throw new Error(
        `⛔️ Post directory "${this.#postOptions.dir}" does not exist.`
      );
    }
  }

  async getCheckedPages(page_size = 100, cursor?: string): Promise<Page[]> {
    const response = await this.#notionClient.databases.query({
      database_id: this.#notionOptions.databaseId,
      page_size,
      start_cursor: cursor
    });

    const pages = response.results
      .filter(isFullPage)
      .map(toPage)
      .filter(isChecked);

    if (response.has_more) {
      const nextPages = await this.getCheckedPages(
        page_size,
        response.next_cursor as string
      );
      return [...pages, ...nextPages];
    }

    return pages;
  }

  async updateSaveResults(results: SaveResult[]): Promise<void> {
    for (const result of results) {
      await this.updatePage(result);
    }
  }

  async updatePage(result: SaveResult): Promise<Page> {
    const response = await this.#notionClient.pages.update({
      page_id: result.page_id,
      properties: {
        [PROPERTIES.POST_PATH.name]: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: result.post_path
              }
            }
          ]
        },
        [PROPERTIES.SYNC_TIME.name]: {
          date: {
            start: new Date().toISOString()
          }
        }
      }
    });
    if (!isFullPage(response)) {
      throw new Error('Not a page');
    }
    console.log(`👻 Synchronized "${result.post_path}"`);

    return toPage(response);
  }

  async savePagesAsMarkdown(pages: Page[]): Promise<SaveResult[]> {
    const saveResults: SaveResult[] = [];
    for (const page of pages) {
      const frontMatter = this.#getFrontMatter(page, this.#postOptions);
      const markdown = await this.getMarkdownAsString(page.id);
      const post = [frontMatter, markdown].join('\n\n');

      const directory = path.join(
        this.#githubOptions.workspace,
        this.#postOptions.dir
      );
      const fullPath = toPath(directory, page.created_time, page.title);

      await fs.outputFile(fullPath, post, 'utf-8');
      saveResults.push({
        page_id: page.id,
        synchronized_time: new Date().toISOString(),
        post_path: fullPath
      });
      console.log(`📝 Saved to ${fullPath}`);
    }

    return saveResults;
  }

  async getMarkdownAsString(pageId: string): Promise<string> {
    const mdBlocks = await this.#n2mClient.pageToMarkdown(pageId);

    return this.#n2mClient.toMarkdownString(mdBlocks)['parent'];
  }

  #getFrontMatter(page: Page, options: PostOptions): string {
    const lines: string[] = [];
    lines.push('---');
    if (!options.skipLayout) {
      lines.push(`layout: ${options.layout}`);
    }
    lines.push(`title: |\n    ${page.title}`);
    lines.push(`date: ${page.created_time}`);
    lines.push(`categories: [${page.categories.join(', ')}]`);
    lines.push(`tags: [${page.tags.join(', ')}]`);
    lines.push('---');

    return lines.join('\n');
  }
}
