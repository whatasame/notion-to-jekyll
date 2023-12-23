import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { Page, PROPERTIES } from '../core/model';

import {
  isCheckboxProperty,
  isDateProperty,
  isMultiSelectProperty,
  isRichTextProperty,
  isTitleProperty
} from './helper';
import path from 'path';

export function toPage(result: PageObjectResponse): Page {
  // TODO: extract
  const checkbox = result.properties[PROPERTIES.CHECKBOX.name];
  if (!isCheckboxProperty(checkbox)) {
    throw new Error(
      `Property ${PROPERTIES.CHECKBOX.name} is not a ${PROPERTIES.CHECKBOX.type} property`
    );
  }
  const title = result.properties[PROPERTIES.TITLE.name];
  if (!isTitleProperty(title)) {
    throw new Error(
      `Property ${PROPERTIES.TITLE.name} is not a ${PROPERTIES.TITLE.type} property`
    );
  }
  const tags = result.properties[PROPERTIES.TAGS.name];
  if (!isMultiSelectProperty(tags)) {
    throw new Error(
      `Property ${PROPERTIES.TAGS.name} is not a ${PROPERTIES.TAGS.type} property`
    );
  }
  const categories = result.properties[PROPERTIES.CATEGORIES.name];
  if (!isMultiSelectProperty(categories)) {
    throw new Error(
      `Property ${PROPERTIES.CATEGORIES.name} is not a ${PROPERTIES.CATEGORIES.type} property`
    );
  }
  const synchronizedTime = result.properties[PROPERTIES.SYNC_TIME.name];
  if (!isDateProperty(synchronizedTime)) {
    throw new Error(
      `Property ${PROPERTIES.SYNC_TIME.name} is not a ${PROPERTIES.SYNC_TIME.type} property`
    );
  }
  const postPath = result.properties[PROPERTIES.POST_PATH.name];
  if (!isRichTextProperty(postPath)) {
    throw new Error(
      `Property ${PROPERTIES.POST_PATH.name} is not a ${PROPERTIES.POST_PATH.type} property`
    );
  }

  return {
    id: result.id,
    checkbox: checkbox.checkbox,
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
