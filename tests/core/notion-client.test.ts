import { NotionClient } from "../../src/core/notion-client";
import { notionApiKey, notionDatabaseId } from "../config";
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

  it("should be able to query pages of database", async () => {
    const pages = await notionClient.getPages();

    console.log(JSON.stringify(pages, null, 2));

    expect(pages.contents).toBeDefined();
    pages.contents.forEach((page) => {
      expect(page.id).toBeDefined();
      expect(page.last_edited_time).toBeDefined();
      expect(page.synchronized_time).toBeDefined();
    });
    expect(pages.has_more).toBeDefined();
    expect(pages.next_cursor).toBeDefined();
  });
});
