import {
  CheckboxPropertyItemObjectResponse,
  DatePropertyItemObjectResponse,
  MultiSelectPropertyItemObjectResponse,
  RichTextPropertyItemObjectResponse,
  TitlePropertyItemObjectResponse
} from '@notionhq/client/build/src/api-endpoints';

export function validateProperty(
  properties: Record<string, { type: string }>,
  propertyName: string,
  expectedType: string
): void {
  if (!properties[propertyName]) {
    throw new Error(`Property ${propertyName} is not defined`);
  }

  if (properties[propertyName].type !== expectedType) {
    throw new Error(
      `Property ${propertyName} is not a ${expectedType} property`
    );
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
