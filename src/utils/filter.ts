import { Page, Pages } from '../core/model';

export function filterNotSynchronized(pages: Pages): Page[] {
  const filtered = pages.contents.filter(
    page =>
      page.synchronized_time === null ||
      new Date(page.synchronized_time) < new Date(page.last_edited_time)
  );
  console.log(`📝 ${filtered.length} pages found.`);

  return filtered;
}
