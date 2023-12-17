import { Client, isFullPage, LogLevel } from "@notionhq/client";
import { Page, Pages } from "../../tests/core/response";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { SYNCHRONIZE_TIME_PROPERTY } from "../../tests/config";
import { isDateProperty } from "../../tests/core/helper";

export class NotionClient {
  #client: Client;
  #databaseId: string;

  constructor(apiKey: string, databaseId: string, logLevel?: LogLevel) {
    this.#client = new Client({
      auth: apiKey,
      logLevel: logLevel,
    });
    this.#databaseId = databaseId;
  }

  // TODO: NTY property validation
  public async retrieveDatabase() {
    const databaseResponsePromise = await this.#client.databases.retrieve({
      database_id: this.#databaseId,
    });

    return databaseResponsePromise;
  }

  public async getPages(page_size?: number, cursor?: string): Promise<Pages> {
    const response = await this.#client.databases.query({
      database_id: this.#databaseId,
      page_size: page_size ?? 100,
      start_cursor: cursor,
    });

    return {
      contents: response.results.filter(isFullPage).map(this.#extractPage),
      has_more: response.has_more,
      next_cursor: response.next_cursor,
    };
  }

  #extractPage(result: PageObjectResponse): Page {
    const synchronizedTime = result.properties[SYNCHRONIZE_TIME_PROPERTY];
    if (!isDateProperty(synchronizedTime)) {
      throw new Error(
        `Property ${SYNCHRONIZE_TIME_PROPERTY} is not a date property`,
      );
    }

    return {
      id: result.id,
      last_edited_time: result.last_edited_time,
      synchronized_time: synchronizedTime.date?.start ?? null,
    };
  }
}
