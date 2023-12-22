import { Page, Pages } from '../core/model';
import { toTitle } from './mapper';

export function filterNotSynchronized(pages: Pages): Page[] {
  const filtered = pages.contents.filter(
    page =>
      page.synchronized_time === null ||
      new Date(page.synchronized_time) < new Date(page.last_edited_time)
  );
  console.log(`📝 Found ${filtered.length} pages to synchronize.`);

  return filtered;
}

export function filterPathsToDelete(
  paths: string[],
  titles: string[]
): string[] {
  const titleSet = new Set(titles);

  return paths.filter(path => !titleSet.has(toTitle(path)));
}
