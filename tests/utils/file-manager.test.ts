import { Page } from '../../src/core/model';
import {
  getFilePaths,
  removeFiles,
  saveMarkdownAsFile
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
});

describe('FileManager with page and markdown', () => {
  const page: Page = {
    id: '12345678-9abc-def0-1234-56789abcdef0',
    checkbox: true,
    title: 'null sync time',
    categories: ['infra', 'tools'],
    tags: ['null'],
    created_time: '2023-12-17T15:43:00.000Z',
    last_edited_time: '2023-12-18T15:43:00.000Z',
    synchronized_time: null,
    post_path: null
  };

  const markdown = `## Heading 2

This is a test page.
`;

  it('should save markdown file with correct metadata', async () => {
    const uploadedPage = await saveMarkdownAsFile(directory, page, markdown);

    expect(uploadedPage).toEqual({
      page_id: expect.any(String),
      synchronized_time: expect.any(String),
      post_path: expect.any(String)
    });
  });

  it('should have correct metadata in the saved markdown file', async () => {
    const uploadedPage = await saveMarkdownAsFile(directory, page, markdown);

    expect(uploadedPage.post_path).toBe(
      `${directory}/2023-12-17-null-sync-time.md`
    );
    expect(uploadedPage.synchronized_time).toBeTruthy();
    fs.readFile(uploadedPage.post_path, (_err, data) => {
      expect(data.toString()).toBe(`---
layout: post
title: |
    null sync time
date: 2023-12-17T15:43:00.000Z
categories: [infra, tools]
tags: [null]
---

## Heading 2

This is a test page.
`);
    });
  });
});
