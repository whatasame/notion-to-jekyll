import { Page } from '../../src/core/model'
import { saveMarkdown } from '../../src/system/file-manager'
import * as fs from 'fs-extra'
import { BASE_POST_PATH } from '../../src/config/constant'

afterEach(async () => {
  await fs.remove(BASE_POST_PATH)
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
    const uploadedPage = await saveMarkdown(page, markdown)

    expect(uploadedPage).toEqual({
      id: page.id,
      title: page.title,
      categories: page.categories,
      tags: page.tags,
      created_time: page.created_time,
      last_edited_time: page.last_edited_time,
      synchronized_time: expect.any(String),
      post_path: expect.any(String)
    })
  })

  it('should have correct metadata in the saved markdown file', async () => {
    const uploadedPage = await saveMarkdown(page, markdown)

    const fileContent = await fs.readFile(
      uploadedPage.post_path as string,
      'utf-8'
    )

    expect(fileContent).toBe(`---
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
