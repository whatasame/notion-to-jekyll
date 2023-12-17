import { Client, LogLevel } from "@notionhq/client";

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

  public async retrieveDatabase() {
    const databaseResponsePromise = this.#client.databases.retrieve({
      database_id: this.#databaseId,
    });

    return databaseResponsePromise;
  }

  public async queryDatabaseAfterLastEditedTime(after: string) {
    return this.#client.databases.query({
      database_id: this.#databaseId,
      filter: {
        property: "Last edited time",
        date: {
          after: after,
        },
      },
    });
  }
}
