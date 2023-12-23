import {
  CheckboxPropertyItemObjectResponse,
  DatePropertyItemObjectResponse,
  MultiSelectPropertyItemObjectResponse,
  RichTextPropertyItemObjectResponse,
  TitlePropertyItemObjectResponse
} from '@notionhq/client/build/src/api-endpoints';
import { DatabaseProperties } from '../core/model';

export function validateProperty(
  target: Record<string, { type: string }>,
  properties: DatabaseProperties
): void {
  for (const key in properties) {
    const propertyName = properties[key].name;
    if (!target[propertyName]) {
      throw new Error(`Property ${propertyName} is not found`);
    }

    const propertyType = properties[key].type;
    if (target[propertyName].type !== propertyType) {
      throw new Error(`Property ${key} is not ${propertyType}`);
    }
  }
}

export function isCheckboxProperty(response: {
  type: string;
}): response is CheckboxPropertyItemObjectResponse {
  return response.type === 'checkbox';
}

export function isTitleProperty(response: {
  type: string;
}): response is TitlePropertyItemObjectResponse {
  return response.type === 'title';
}

export function isMultiSelectProperty(response: {
  type: string;
}): response is MultiSelectPropertyItemObjectResponse {
  return response.type === 'multi_select';
}

export function isDateProperty(response: {
  type: string;
}): response is DatePropertyItemObjectResponse {
  return response.type === 'date';
}

export function isRichTextProperty(response: {
  type: string;
}): response is RichTextPropertyItemObjectResponse {
  return response.type === 'rich_text';
}
