import { Page } from '../core/model';
import * as fs from 'fs-extra';
import path from 'path';
import { toPath } from './mapper';

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

export function isExistPath(...paths: string[]): boolean {
  return fs.existsSync(path.join(...paths));
}
