import { Page } from '../../src/core/model';
import {
  filterPathsToDelete,
  isChecked,
  isNotSynchronized
} from '../../src/utils/filter';

describe('Pages are given', () => {
  const nullSyncTime: Page = {
    id: '12345678-9abc-def0-1234-56789abcdef0',
    checkbox: true,
    title: 'null sync time',
    categories: [],
    tags: [],
    created_time: '2023-12-17T15:43:00.000Z',
    last_edited_time: '2023-12-17T15:43:00.000Z',
    synchronized_time: null,
    post_path: null
  };
  const earlierSyncTime: Page = {
    id: 'abcdef01-2345-6789-abcd-ef0123456789',
    checkbox: false,
    title: 'earlier sync time',
    categories: ['sync', 'time'],
    tags: ['earlier', 'sync', 'time'],
    created_time: '2023-12-17T15:43:00.000Z',
    last_edited_time: '2023-12-17T15:43:00.000Z',
    synchronized_time: '2023-12-16T15:43:00.000Z',
    post_path: './_posts/2023-12-16-earlier-sync-time.md'
  };
  const laterSyncTime: Page = {
    id: 'fedcba09-8765-4321-fedc-ba0987654321',
    checkbox: true,
    title: 'later sync time',
    categories: ['sync', 'test'],
    tags: ['later', 'sync', 'time'],
    created_time: '2023-12-17T15:43:00.000Z',
    last_edited_time: '2023-12-17T15:43:00.000Z',
    synchronized_time: '2023-12-18T15:43:00.000Z',
    post_path: './_posts/2023-12-18-later-sync-time.md'
  };
  const sameSyncTime: Page = {
    id: '98765432-10ef-cdba-9876-543210fedcba',
    checkbox: false,
    title: 'same sync time',
    categories: ['test', 'time'],
    tags: ['same', 'sync', 'time'],
    created_time: '2023-12-17T15:43:00.000Z',
    last_edited_time: '2023-12-17T15:43:00.000Z',
    synchronized_time: '2023-12-17T15:43:00.000Z',
    post_path: './_posts/2023-12-17-same-sync-time.md'
  };

  it('should return pages that have not been synchronized', () => {
    expect(isNotSynchronized(nullSyncTime)).toEqual(true);
    expect(isNotSynchronized(earlierSyncTime)).toEqual(true);
    expect(isNotSynchronized(laterSyncTime)).toEqual(false);
    expect(isNotSynchronized(sameSyncTime)).toEqual(false);
  });

  it('should return pages that is checked', () => {
    expect(isChecked(nullSyncTime)).toEqual(true);
    expect(isChecked(earlierSyncTime)).toEqual(false);
    expect(isChecked(laterSyncTime)).toEqual(true);
    expect(isChecked(sameSyncTime)).toEqual(false);
  });
});

describe('File exist but not exist in pages', () => {
  const paths = [
    './_posts/2023-12-17-not-exist-page.md',
    './_posts/2023-12-17-exist-page.md'
  ];
  const titles = ['exist page'];

  it('should return target to delete pages', () => {
    const target = filterPathsToDelete(paths, titles);

    expect(target).toEqual(['./_posts/2023-12-17-not-exist-page.md']);
  });
});
