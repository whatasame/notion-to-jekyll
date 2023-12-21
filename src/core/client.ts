import { Client, isFullDatabase, isFullPage, LogLevel } from '@notionhq/client';
import { Page, Pages, PROPERTY_NAMES } from './model';
import { validateProperty } from '../utils/helper';
import { toPage } from '../utils/mapper';
import { NotionToMarkdown } from 'notion-to-md';
import * as core from '@actions/core';
import path from 'path';
import { saveMarkdownAsFile } from '../utils/file-manager';
import { filterNotSynchronized } from '../utils/filter';
import fs from 'fs';

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
    const database = await this.#notionClient.databases.retrieve({
      database_id: this.#databaseId
    });
    if (!isFullDatabase(database)) {
      throw new Error('Not a database');
    }

    validateProperty(database.properties, PROPERTY_NAMES.TAGS, 'multi_select');
    validateProperty(database.properties, PROPERTY_NAMES.SYNC_TIME, 'date');
    validateProperty(
      database.properties,
      PROPERTY_NAMES.POST_PATH,
      'rich_text'
    );
  }

  // TODO: extract to Validator class
  validatePostDirectory(): void {
    const postDirectory = path.join(this.#githubWorkspace, this.#postDir);
    if (!fs.existsSync(postDirectory)) {
      throw new Error(`⛔️ Post directory "${postDirectory}" does not exist.`);
    }
  }

  async getPages(page_size = 100, cursor?: string): Promise<Pages> {
    const response = await this.#notionClient.databases.query({
      database_id: this.#databaseId,
      page_size,
      start_cursor: cursor
    });

    return {
      contents: response.results.filter(isFullPage).map(toPage),
      has_more: response.has_more,
      next_cursor: response.next_cursor
    };
  }

  async updatePage(pageId: string, postPath: string): Promise<Page> {
    const response = await this.#notionClient.pages.update({
      page_id: pageId,
      properties: {
        [PROPERTY_NAMES.POST_PATH]: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: postPath
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

    return toPage(response);
  }

  async savePagesAsMarkdown(pages: Pages): Promise<void> {
    for (const page of filterNotSynchronized(pages)) {
      const markdown = await this.getMarkdownAsString(page.id);

      const directory = path.join(this.#githubWorkspace, this.#postDir);
      const result = await saveMarkdownAsFile(directory, page, markdown);
      const updatedPage = await this.updatePage(page.id, result.post_path);
      console.log(
        `👻 Synchronized "${updatedPage.title}" to "${updatedPage.post_path}"`
      );
    }
  }

  async getMarkdownAsString(pageId: string): Promise<string> {
    const mdBlocks = await this.#n2mClient.pageToMarkdown(pageId);

    return this.#n2mClient.toMarkdownString(mdBlocks)['parent'];
  }
}
