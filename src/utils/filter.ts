import { Page, Pages } from '../core/model';

export function filterNotSynchronized(pages: Pages): Page[] {
  const filtered = pages.contents.filter(
    page =>
      page.synchronized_time === null ||
      new Date(page.synchronized_time) < new Date(page.last_edited_time)
  );
  console.log(`📝 Found ${filtered.length} pages to synchronize.`);

  return filtered;
}

export function filterPathsToDelete(paths: string[], pages: Pages): string[] {
  // TODO: Improve performance
  const filtered = Array.from(paths).filter(
    path => !pages.contents.some(page => page.post_path === path)
  );
  console.log(`🗑 Found ${filtered.length} paths to delete.`);

  return filtered;
}
