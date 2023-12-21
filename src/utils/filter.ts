import { Page, Pages } from '../core/model';

export function filterNotSynchronized(pages: Pages): Page[] {
  return pages.contents.filter(
    page =>
      page.synchronized_time === null ||
      new Date(page.synchronized_time) < new Date(page.last_edited_time)
  );
}
