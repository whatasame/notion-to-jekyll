import * as core from '@actions/core';
import { spawn } from 'node:child_process';
import path from 'path';
import { NotionToJekyllClient, Options } from './core/client';
import { filterNotSynchronized, filterPathsToDelete } from './utils/filter';
import { getFilePaths, removeFiles } from './utils/file-manager';

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

  const pages = await client.getPages();

  removeFiles(
    filterPathsToDelete(
      await getFilePaths(
        path.join(options.github.workspace, options.github.post_dir),
        ['.md', '.markdown']
      ),
      pages.contents.map(page => page.title)
    )
  );

  const pageToSync = filterNotSynchronized(pages);
  const saveResults = await client.savePagesAsMarkdown(pageToSync);

  // TODO: If there is no page to save or delete, warning code -> warning message list possible?
  // TODO: Throw error if script exit code is not 0 -> no update
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
  const child = spawn('bash', [script]);

  child.stdout.on('data', data => {
    console.log(`[Script] ${data.toString()}`);
  });

  child.stderr.on('data', data => {
    console.error(`[Script] error: ${data}`);
  });

  child.on('close', code => {
    console.log(`[Script] exited with code ${code}`);
  });
}

// ------- Bootstrap -------
(async () => {
  try {
    await start();
  } catch (e) {
    core.setFailed(`${e instanceof Error ? e.message : e}`);
  }
})();
