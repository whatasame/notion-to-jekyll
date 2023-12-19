import { Page } from '../../src/core/model'
import { saveMarkdownAsFile } from '../../src/system/file-manager'
import * as fs from 'fs-extra'
import path from 'path'

const directory = path.join(__dirname, '../', '_posts')

afterEach(async () => {
  await fs.remove(directory)
})

describe('FileManager', () => {
  const page: Page = {
    id: '12345678-9abc-def0-1234-56789abcdef0',
    title: 'null sync time',
    categories: ['infra', 'tools'],
    tags: ['null'],
    created_time: '2023-12-17T15:43:00.000Z',
    last_edited_time: '2023-12-18T15:43:00.000Z',
    synchronized_time: null,
    post_path: null
  }

  const markdown = `## Heading 2

This is a test page.
`

  it('should save markdown file with correct metadata', async () => {
    const uploadedPage = await saveMarkdownAsFile(directory, page, markdown)

    expect(uploadedPage).toEqual({
      synchronized_time: expect.any(String),
      post_path: expect.any(String)
    })
  })

  it('should have correct metadata in the saved markdown file', async () => {
    const uploadedPage = await saveMarkdownAsFile(directory, page, markdown)

    fs.readFile(uploadedPage.post_path, (err, data) => {
      expect(data.toString()).toBe(`---
layout: post
title: null sync time
date: 2023-12-17
categories: [infra, tools]
tags: [null]
---

## Heading 2

This is a test page.
`)
    })
  })
})
