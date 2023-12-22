import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { Page, PROPERTY_NAMES } from '../core/model';

import {
  isDateProperty,
  isMultiSelectProperty,
  isRichTextProperty,
  isTitleProperty
} from './helper';
import path from 'path';

export function toPage(result: PageObjectResponse): Page {
  // TODO: extract
  const title = result.properties[PROPERTY_NAMES.TITLE];
  if (!isTitleProperty(title)) {
    throw new Error(`Property ${PROPERTY_NAMES.TITLE} is not a title property`);
  }

  const tags = result.properties[PROPERTY_NAMES.TAGS];
  if (!isMultiSelectProperty(tags)) {
    throw new Error(
      `Property ${PROPERTY_NAMES.TAGS} is not a multi_select property`
    );
  }

  const categories = result.properties[PROPERTY_NAMES.CATEGORIES];
  if (!isMultiSelectProperty(categories)) {
    throw new Error(
      `Property ${PROPERTY_NAMES.CATEGORIES} is not a multi_select property`
    );
  }

  const synchronizedTime = result.properties[PROPERTY_NAMES.SYNC_TIME];
  if (!isDateProperty(synchronizedTime)) {
    throw new Error(
      `Property ${PROPERTY_NAMES.SYNC_TIME} is not a date property`
    );
  }

  const postPath = result.properties[PROPERTY_NAMES.POST_PATH];
  if (!isRichTextProperty(postPath)) {
    throw new Error(
      `Property ${PROPERTY_NAMES.POST_PATH} is not a rich_text property`
    );
  }

  return {
    id: result.id,
    title: title.title[0].plain_text,
    categories: categories.multi_select.map(category => category.name),
    tags: tags.multi_select.map(tag => tag.name),
    created_time: result.created_time,
    last_edited_time: result.last_edited_time,
    synchronized_time: synchronizedTime.date?.start ?? null,
    post_path: postPath.rich_text[0]?.plain_text ?? null
  };
}

export function toPath(
  directory: string,
  createTime: string,
  title: string
): string {
  const yymmdd = createTime.split('T')[0];
  const hyphenatedTitle = title.replace(/\s/g, '-');
  const filename = `${yymmdd}-${hyphenatedTitle}.md`;

  return path.join(directory, filename);
}

export function toTitle(fullPath: string): string {
  const file = fullPath.split('/').pop() as string;
  const name = file.split('.')[0];
  const title = name.split('-').slice(3).join('-');

  return title.replace(/-/g, ' ');
}
