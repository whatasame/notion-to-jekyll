import { NotionClient } from "../../src/core/notion-client";
import { notionApiKey, notionDatabaseId } from "../secret-config";

describe("Notion client", () => {
  const notionClient = new NotionClient(notionApiKey, notionDatabaseId);

  it("should be able to retrieve a database information", async () => {
    const database = await notionClient.retrieveDatabase();

    expect(database).toBeDefined();
  });
});
