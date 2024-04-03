import * as core from '@actions/core';
import path from 'path';
import { NotionToJekyllClient, Inputs } from './core/client';
import { filterPathsToDelete, isNotSynchronized } from './utils/filter';
import { getFilePaths, removeFiles } from './utils/file-manager';
import { spawnSync } from 'child_process';

async function start(): Promise<void> {
  const inputs: Inputs = {
    notion: {
      apiKey: core.getInput('notion_api_key', {
        required: true
      }),
      databaseId: core.getInput('notion_database_id', {
        required: true
      })
    },
    github: {
      workspace: core.getInput('github_workspace')
    },
    post: {
      dir: core.getInput('post_dir'),
      layout: core.getInput('post_layout'),
      skipLayout: core.getBooleanInput('post_layout_skip')
    }
  };

  const client = new NotionToJekyllClient(inputs);
  client.validatePostDirectory();
  await client.validateDatabaseProperties();

  const checkedPages = await client.getCheckedPages();

  // TODO: Refactor
  removeFiles(
    filterPathsToDelete(
      await getFilePaths(path.join(inputs.github.workspace, inputs.post.dir), [
        '.md',
        '.markdown'
      ]),
      checkedPages.map(page => page.title)
    )
  );

  const targetPages = checkedPages.filter(isNotSynchronized);
  console.log(`📝 Found ${targetPages.length} pages to synchronize.`);
  const saveResults = await client.savePagesAsMarkdown(targetPages);

  execBash(path.join(__dirname, '../scripts/run.sh'));

  await client.updateSaveResults(saveResults);
}

function execBash(script: string): void {
  const result = spawnSync('bash', [script]);

  if (result.error) {
    console.error(`Error during shell execution: ${result.error.message}`);
  }
  if (result.stderr) {
    console.error(`error: ${result.stderr}`);
  }
  if (result.stdout) {
    console.log(`${result.stdout}`);
  }

  if (result.status !== 0) {
    console.error(`Execution failed with code ${result.status}.`);
    process.exit(result.status ?? 1);
  }
  console.log('Script execution completed successfully.');
}

// ------- Bootstrap -------
(async () => {
  try {
    await start();
  } catch (e) {
    core.setFailed(`${e instanceof Error ? e.message : e}`);
  }
})();
