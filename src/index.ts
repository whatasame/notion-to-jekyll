import * as core from '@actions/core';
import path from 'path';
import { NotionToJekyllClient, Options } from './core/client';
import { filterPathsToDelete } from './utils/filter';
import { getFilePaths, removeFiles } from './utils/file-manager';
import { spawnSync } from 'child_process';

const INPUTS = {
  NOTION_API_KEY: 'notion_api_key',
  NOTION_DATABASE_ID: 'notion_database_id',
  GITHUB_WORKSPACE: 'github_workspace',
  POST_DIR: 'post_dir'
};

export async function start(): Promise<void> {
  const options = importOptions();

  const client = new NotionToJekyllClient(options);
  client.validatePostDirectory();
  await client.validateDatabaseProperties();

  const targetPages = await client.getTargetPages();
  console.log(`📝 Found ${targetPages.length} pages to synchronize.`);

  // TODO: Refactor
  removeFiles(
    filterPathsToDelete(
      await getFilePaths(
        path.join(options.github.workspace, options.github.post_dir),
        ['.md', '.markdown']
      ),
      targetPages.map(page => page.title)
    )
  );

  const saveResults = await client.savePagesAsMarkdown(targetPages);

  execBash(path.join(__dirname, '../scripts/run.sh'));

  await client.updateSaveResults(saveResults);
}

function importOptions(): Options {
  return {
    notion: {
      apiKey: core.getInput(INPUTS.NOTION_API_KEY, {
        required: true
      }),
      databaseId: core.getInput(INPUTS.NOTION_DATABASE_ID, {
        required: true
      })
    },
    github: {
      workspace: core.getInput(INPUTS.GITHUB_WORKSPACE, {
        required: true
      }),
      post_dir: core.getInput(INPUTS.POST_DIR, {
        required: true
      })
    }
  };
}

function execBash(script: string): void {
  const result = spawnSync('bash', [script]);

  if (result.error) {
    console.error(`[Script] Error during execution: ${result.error.message}`);
  }
  if (result.stderr) {
    console.error(`[Script]: ${result.stderr}`);
  }
  console.log(`[Script]: ${result.stdout}`);

  if (result.status !== 0) {
    console.error(`[Script]: execution failed with code ${result.status}.`);
    process.exitCode = result.status ?? 1;
  }
  console.log('[Script]: Script execution completed successfully.');
}

// ------- Bootstrap -------
(async () => {
  try {
    await start();
  } catch (e) {
    core.setFailed(`${e instanceof Error ? e.message : e}`);
  }
})();
