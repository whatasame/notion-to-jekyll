import {
  DatePropertyItemObjectResponse,
  RichTextPropertyItemObjectResponse,
  TitlePropertyItemObjectResponse
} from '@notionhq/client/build/src/api-endpoints'

export function validateProperty(
  properties: Record<string, { type: string }>,
  propertyName: string,
  expectedType: string
): void {
  if (!properties[propertyName]) {
    throw new Error(`Property ${propertyName} is not defined`)
  }

  if (properties[propertyName].type !== expectedType) {
    throw new Error(
      `Property ${propertyName} is not a ${expectedType} property`
    )
  }
}

export function isTitleProperty(response: {
  type: string
}): response is TitlePropertyItemObjectResponse {
  return response.type === 'title'
}

export function isDateProperty(response: {
  type: string
}): response is DatePropertyItemObjectResponse {
  return response.type === 'date'
}

export function isRichTextProperty(response: {
  type: string
}): response is RichTextPropertyItemObjectResponse {
  return response.type === 'rich_text'
}
