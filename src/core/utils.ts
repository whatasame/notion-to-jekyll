import { Page, Pages } from "./model";

export function filterNotSynchronized(pages: Pages): Array<Page> {
  return pages.contents.filter(
    (page) =>
      page.synchronized_time === null ||
      new Date(page.synchronized_time) < new Date(page.last_edited_time),
  );
}
