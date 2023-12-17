const apiKeyEnvName = "NOTION_TO_JEKYLL_API_KEY";
const databaseIdEnvName = "NOTION_TO_JEKYLL_DATABASE_ID";

const notionApiKey = process.env[apiKeyEnvName] as string;
const notionDatabaseId = process.env[databaseIdEnvName] as string;

if (!notionApiKey || !notionDatabaseId) {
  throw new Error(
    `Missing environment variables for test. Required: "${apiKeyEnvName}", "${databaseIdEnvName}"`,
  );
}

export { notionApiKey, notionDatabaseId };
