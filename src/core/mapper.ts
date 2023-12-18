import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { Page } from './model'
import { POST_PATH_NAME, SYNC_TIME_NAME, TITLE_NAME } from './constant'
import { isDateProperty, isRichTextProperty, isTitleProperty } from './helper'

export function toPage(result: PageObjectResponse): Page {
  // TODO: extract
  const title = result.properties[TITLE_NAME]
  if (!isTitleProperty(title)) {
    throw new Error('Title property is not a title property')
  }

  const synchronizedTime = result.properties[SYNC_TIME_NAME]
  if (!isDateProperty(synchronizedTime)) {
    throw new Error(`Property ${SYNC_TIME_NAME} is not a date property`)
  }

  const postPath = result.properties[POST_PATH_NAME]
  if (!isRichTextProperty(postPath)) {
    throw new Error(`Property ${POST_PATH_NAME} is not a rich_text property`)
  }

  return {
    id: result.id,
    title: title.title[0].plain_text,
    last_edited_time: result.last_edited_time,
    synchronized_time: synchronizedTime.date?.start ?? null,
    post_path: postPath.rich_text[0]?.plain_text ?? null
  }
}
