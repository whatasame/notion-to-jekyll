import { Page } from '../core/model';
import { toTitle } from './mapper';

export function isChecked(page: Page): boolean {
  return page.checkbox;
}

export function isNotSynchronized(page: Page): boolean {
  return (
    page.synchronized_time === null ||
    new Date(page.synchronized_time) < new Date(page.last_edited_time)
  );
}

export function filterPathsToDelete(
  paths: string[],
  titles: string[]
): string[] {
  const titleSet = new Set(titles);

  const filtered = paths.filter(path => !titleSet.has(toTitle(path)));
  console.log(`🗑️ Found ${filtered.length} pages to delete.`);

  return filtered;
}
