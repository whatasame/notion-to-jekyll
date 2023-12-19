import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { Page, PROPERTY_NAMES } from '../core/model'
import {
  isDateProperty,
  isMultiSelectProperty,
  isRichTextProperty,
  isTitleProperty
} from './helper'

const propertyTypes: Record<string, (property: any) => boolean> = {
  [PROPERTY_NAMES.TITLE]: isTitleProperty,
  [PROPERTY_NAMES.TAGS]: isMultiSelectProperty,
  [PROPERTY_NAMES.CATEGORIES]: isMultiSelectProperty,
  [PROPERTY_NAMES.SYNC_TIME]: isDateProperty,
  [PROPERTY_NAMES.POST_PATH]: isRichTextProperty
}

export function toPage(result: PageObjectResponse): Page {
  const title = getProperty(result, PROPERTY_NAMES.TITLE)
  const tags = getProperty(result, PROPERTY_NAMES.TAGS)
  const categories = getProperty(result, PROPERTY_NAMES.CATEGORIES)
  const synchronizedTime = getProperty(result, PROPERTY_NAMES.SYNC_TIME)
  const postPath = getProperty(result, PROPERTY_NAMES.POST_PATH)

  return {
    id: result.id,
    title: title.title[0].plain_text,
    categories: categories.multi_select.map((category: any) => category.name),
    tags: tags.multi_select.map((tag: any) => tag.name),
    created_time: result.created_time,
    last_edited_time: result.last_edited_time,
    synchronized_time: synchronizedTime.date?.start ?? null,
    post_path: postPath.rich_text[0]?.plain_text ?? null
  }
}

function getProperty(result: PageObjectResponse, propertyName: string): any {
  const property = result.properties[propertyName]
  const typeCheck = propertyTypes[propertyName]

  typeCheck?.(property) ||
    (() => {
      throw new Error(`Property ${propertyName} is not of the expected type`)
    })()

  return property
}
