export const SYNCHRONIZE_TIME_PROPERTY = "[notion-to-jekyll] sync time";

const API_KEY_ENV = "NOTION_TO_JEKYLL_API_KEY";
const DATABASE_ID_ENV = "NOTION_TO_JEKYLL_DATABASE_ID";

const notionApiKey = process.env[API_KEY_ENV] as string;
const notionDatabaseId = process.env[DATABASE_ID_ENV] as string;

if (!notionApiKey || !notionDatabaseId) {
  throw new Error(
    `Missing environment variables for test. Required: "${API_KEY_ENV}", "${DATABASE_ID_ENV}"`,
  );
}

export { notionApiKey, notionDatabaseId };
