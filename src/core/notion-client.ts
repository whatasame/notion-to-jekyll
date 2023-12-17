import { Client } from "@notionhq/client";

export class NotionClient {
  private readonly client: Client;
  private readonly databaseId: string;

  constructor(apiKey: string, databaseId: string) {
    this.client = new Client({
      auth: apiKey,
    });
    this.databaseId = databaseId;
  }

  public async retrieveDatabase() {
    return this.client.databases.retrieve({ database_id: this.databaseId });
  }
}
