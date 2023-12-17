import { NotionClient } from "../../src/core/notion-client";
import { notionApiKey, notionDatabaseId } from "../secret-config";
import { LogLevel } from "@notionhq/client";

describe("Notion client", () => {
  const notionClient = new NotionClient(
    notionApiKey,
    notionDatabaseId,
    LogLevel.DEBUG,
  );

  it("should be able to retrieve a database information", async () => {
    const database = await notionClient.retrieveDatabase();

    expect(database).toBeDefined();
  });

  it("should be able to query a database filtering after specific last edited time", async () => {
    const database = await notionClient.retrieveDatabase();

    const query = await notionClient.queryDatabaseAfterLastEditedTime(
      "2023-12-17T07:09:00.000Z",
    );

    expect(query).toBeDefined();
  });
});
