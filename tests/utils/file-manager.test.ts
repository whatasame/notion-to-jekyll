import { Page } from '../../src/core/model';
import {
  getFilePaths,
  isExistPath,
  removeFiles
} from '../../src/utils/file-manager';
import * as fs from 'fs-extra';
import path from 'path';

const directory = path.join(__dirname, '../', '_posts');

beforeEach(async () => {
  await fs.mkdir(directory);
  await fs.outputFile(path.join(directory, 'test.md'), 'test', 'utf-8');
  await fs.outputFile(path.join(directory, 'test2.md'), 'test2', 'utf-8');
});

afterEach(async () => {
  await fs.remove(directory);
});

describe('FileManager', () => {
  it('should get post paths', async () => {
    const postPaths = await getFilePaths(directory, ['.md']);

    expect(postPaths).toEqual([
      path.join(directory, 'test.md'),
      path.join(directory, 'test2.md')
    ]);
  });

  it('should remove files', async () => {
    removeFiles(await getFilePaths(directory, ['.md']));

    expect(await getFilePaths(directory, ['.md'])).toEqual([]);
  });

  it('should check if path exists', async () => {
    expect(isExistPath(directory)).toBeTruthy();
    expect(isExistPath(directory, 'weird_dir')).not.toBeTruthy();
  });
});
