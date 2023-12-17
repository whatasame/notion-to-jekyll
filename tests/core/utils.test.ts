import { Page, Pages } from "../../src/core/model";
import { filterNotSynchronized } from "../../src/core/utils";

describe("Pages are given", () => {
  const nullSyncTime: Page = {
    id: "12345678-9abc-def0-1234-56789abcdef0",
    last_edited_time: "2023-12-17T15:43:00.000Z",
    synchronized_time: null,
  };
  const earlierSyncTime: Page = {
    id: "abcdef01-2345-6789-abcd-ef0123456789",
    last_edited_time: "2023-12-17T15:43:00.000Z",
    synchronized_time: "2023-12-16T15:43:00.000Z",
  };
  const laterSyncTime: Page = {
    id: "fedcba09-8765-4321-fedc-ba0987654321",
    last_edited_time: "2023-12-17T15:43:00.000Z",
    synchronized_time: "2023-12-18T15:43:00.000Z",
  };
  const sameSyncTime: Page = {
    id: "98765432-10ef-cdba-9876-543210fedcba",
    last_edited_time: "2023-12-17T15:43:00.000Z",
    synchronized_time: "2023-12-17T15:43:00.000Z",
  };

  const pages: Pages = {
    contents: [nullSyncTime, earlierSyncTime, laterSyncTime, sameSyncTime],
    has_more: false,
    next_cursor: null,
  };

  it("should return pages that have not been synchronized", () => {
    const filtered: Array<Page> = filterNotSynchronized(pages);

    expect(filtered).toEqual([nullSyncTime, earlierSyncTime]);
  });
});
