import { Page } from '../core/model';
import * as fs from 'fs-extra';
import path from 'path';
import { toPath } from './mapper';

export type SaveResult = {
  page_id: string;
  synchronized_time: string;
  post_path: string;
};

export async function saveMarkdownAsFile(
  directory: string,
  page: Page,
  markdown: string
): Promise<SaveResult> {
  const fullPath = toPath(directory, page.created_time, page.title);

  const data = [generateMetadata(page), markdown].join('\n\n');

  await fs.outputFile(fullPath, data, 'utf-8');

  return {
    page_id: page.id,
    synchronized_time: new Date().toISOString(),
    post_path: fullPath
  };
}

function generateMetadata(page: Page): string {
  const metadataLines = [
    '---',
    'layout: post',
    `title: |\n    ${page.title}`,
    `date: ${page.created_time}`,
    `categories: [${page.categories.join(', ')}]`,
    `tags: [${page.tags.join(', ')}]`,
    '---'
  ];

  return metadataLines.join('\n');
}

export async function getFilePaths(
  directory: string,
  extension: string[]
): Promise<string[]> {
  const files = await fs.readdir(directory);

  return files
    .map(file => path.join(directory, file))
    .filter(file => extension.includes(path.extname(file)));
}

export function removeFiles(strings: string[]): void {
  for (const string of strings) {
    if (!fs.existsSync(string)) {
      continue;
    }
    fs.removeSync(string);
    console.log(`🗑 Removed ${string}`);
  }
}
