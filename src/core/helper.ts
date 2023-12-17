import { DatePropertyItemObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export function validateProperty(
  properties: Record<string, any>,
  propertyName: string,
  expectedType: string,
) {
  if (!properties[propertyName]) {
    throw new Error(`Property ${propertyName} is not defined`);
  }

  if (properties[propertyName].type !== expectedType) {
    throw new Error(
      `Property ${propertyName} is not a ${expectedType} property`,
    );
  }
}

export function isDateProperty(
  response: any,
): response is DatePropertyItemObjectResponse {
  return response.type === "date";
}
