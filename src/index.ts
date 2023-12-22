import * as core from '@actions/core';
import { spawn } from 'node:child_process';
import path from 'path';
import { NotionToJekyllClient, Options } from './core/client';
import { filterNotSynchronized } from './utils/filter';

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
  const targets = filterNotSynchronized(pages);
  if (targets.length === 0) {
    core.warning('👻 No pages to synchronize.');
    return;
  }

  await client.savePagesAsMarkdown(targets);
  await exec('bash', [path.join(__dirname, '../script/run.sh')], {
    env: {
      ...process.env
    }
  });
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

async function exec(
  cmd: string,
  args: string[],
  options: object
): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit', ...options });
    child.on('close', code => {
      if (code !== 0) {
        return reject(
          Object.assign(new Error(`Invalid exit code: ${code}`), { code })
        );
      }

      return resolve(code);
    });
    child.on('error', reject);
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
