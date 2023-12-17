import { DatePropertyItemObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export function isDateProperty(
  response: any,
): response is DatePropertyItemObjectResponse {
  return response.type === "date";
}
