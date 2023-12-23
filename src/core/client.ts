import { Client, isFullDatabase, isFullPage, LogLevel } from '@notionhq/client';
import { Page, PROPERTY_NAMES } from './model';
import { validateProperty } from '../utils/helper';
import { toPage } from '../utils/mapper';
import { NotionToMarkdown } from 'notion-to-md';
import * as core from '@actions/core';
import path from 'path';
import {
  isExistPath,
  saveMarkdownAsFile,
  SaveResult
} from '../utils/file-manager';
import { isChecked, isNotSynchronized } from '../utils/filter';

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

export class NotionToJekyllClient {
  readonly #notionClient: Client;
  readonly #n2mClient: NotionToMarkdown;
  readonly #databaseId: string;
  readonly #githubWorkspace: string;
  readonly #postDir: string;

  constructor(options: Options) {
    this.#notionClient = new Client({
      auth: options.notion.apiKey,
      logLevel: core.isDebug() ? LogLevel.DEBUG : LogLevel.WARN
    });
    this.#n2mClient = new NotionToMarkdown({
      notionClient: this.#notionClient,
      config: { separateChildPage: true }
    });
    this.#databaseId = options.notion.databaseId;
    this.#githubWorkspace = options.github.workspace;
    this.#postDir = options.github.post_dir;
  }

  // TODO: extract to Validator class
  async validateDatabaseProperties(): Promise<void> {
    const db = await this.#notionClient.databases.retrieve({
      database_id: this.#databaseId
    });
    if (!isFullDatabase(db)) {
      throw new Error('Not a database');
    }

    validateProperty(db.properties, PROPERTY_NAMES.CHECKBOX, 'checkbox');
    validateProperty(db.properties, PROPERTY_NAMES.TITLE, 'title');
    validateProperty(db.properties, PROPERTY_NAMES.CATEGORIES, 'multi_select');
    validateProperty(db.properties, PROPERTY_NAMES.TAGS, 'multi_select');
    validateProperty(db.properties, PROPERTY_NAMES.SYNC_TIME, 'date');
    validateProperty(db.properties, PROPERTY_NAMES.POST_PATH, 'rich_text');
  }

  validatePostDirectory(): void {
    if (!isExistPath(this.#githubWorkspace, this.#postDir)) {
      throw new Error(`⛔️ Post directory "${this.#postDir}" does not exist.`);
    }
  }

  async getTargetPages(page_size = 100, cursor?: string): Promise<Page[]> {
    const response = await this.#notionClient.databases.query({
      database_id: this.#databaseId,
      page_size,
      start_cursor: cursor
    });

    const pages = response.results
      .filter(isFullPage)
      .map(toPage)
      .filter(isChecked)
      .filter(isNotSynchronized);

    if (response.has_more) {
      const nextPages = await this.getTargetPages(
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
        [PROPERTY_NAMES.POST_PATH]: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: result.post_path
              }
            }
          ]
        },
        [PROPERTY_NAMES.SYNC_TIME]: {
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
      const markdown = await this.getMarkdownAsString(page.id);

      const directory = path.join(this.#githubWorkspace, this.#postDir);
      const result = await saveMarkdownAsFile(directory, page, markdown);
      saveResults.push(result);
      console.log(`📝 Saved to ${result.post_path}`);
    }

    return saveResults;
  }

  async getMarkdownAsString(pageId: string): Promise<string> {
    const mdBlocks = await this.#n2mClient.pageToMarkdown(pageId);

    return this.#n2mClient.toMarkdownString(mdBlocks)['parent'];
  }
}
