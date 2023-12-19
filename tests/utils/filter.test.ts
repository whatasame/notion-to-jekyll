import { Page, Pages } from '../../src/core/model'
import { filterNotSynchronized } from '../../src/utils/filter'

describe('Pages are given', () => {
  const nullSyncTime: Page = {
    id: '12345678-9abc-def0-1234-56789abcdef0',
    title: 'null sync time',
    categories: [],
    tags: [],
    created_time: '2023-12-17T15:43:00.000Z',
    last_edited_time: '2023-12-17T15:43:00.000Z',
    synchronized_time: null,
    post_path: null
  }
  const earlierSyncTime: Page = {
    id: 'abcdef01-2345-6789-abcd-ef0123456789',
    title: 'earlier sync time',
    categories: ['sync', 'time'],
    tags: ['earlier', 'sync', 'time'],
    created_time: '2023-12-17T15:43:00.000Z',
    last_edited_time: '2023-12-17T15:43:00.000Z',
    synchronized_time: '2023-12-16T15:43:00.000Z',
    post_path: './_posts/2023-12-16-earlier-sync-time.md'
  }
  const laterSyncTime: Page = {
    id: 'fedcba09-8765-4321-fedc-ba0987654321',
    title: 'later sync time',
    categories: ['sync', 'test'],
    tags: ['later', 'sync', 'time'],
    created_time: '2023-12-17T15:43:00.000Z',
    last_edited_time: '2023-12-17T15:43:00.000Z',
    synchronized_time: '2023-12-18T15:43:00.000Z',
    post_path: './_posts/2023-12-18-later-sync-time.md'
  }
  const sameSyncTime: Page = {
    id: '98765432-10ef-cdba-9876-543210fedcba',
    title: 'same sync time',
    categories: ['test', 'time'],
    tags: ['same', 'sync', 'time'],
    created_time: '2023-12-17T15:43:00.000Z',
    last_edited_time: '2023-12-17T15:43:00.000Z',
    synchronized_time: '2023-12-17T15:43:00.000Z',
    post_path: './_posts/2023-12-17-same-sync-time.md'
  }

  const pages: Pages = {
    contents: [nullSyncTime, earlierSyncTime, laterSyncTime, sameSyncTime],
    has_more: false,
    next_cursor: null
  }

  it('should return pages that have not been synchronized', () => {
    const filtered: Page[] = filterNotSynchronized(pages)

    expect(filtered).toEqual([nullSyncTime, earlierSyncTime])
  })
})
