import * as core from '@actions/core';
import { spawn } from 'node:child_process';
import path from 'path';
import { NotionToJekyllClient, Options } from './core/client';
import { filterNotSynchronized, filterPathsToDelete } from './utils/filter';
import { getFilePaths } from './utils/file-manager';

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

  const pageToSync = filterNotSynchronized(pages);
  const saveResults = await client.savePagesAsMarkdown(pageToSync);

  const postFiles = await getFilePaths(
    path.join(options.github.workspace, options.github.post_dir),
    ['.md', '.markdown']
  );
  const paths = JSON.stringify({
    removePaths: filterPathsToDelete(postFiles, pages)
  });

  // TODO: 저장할 페이지가 없거나 삭제할 페이지가 없으면 경고 코드 -> 경고 메시지 리스트 가능?
  // TODO: 스크립트 실행 실패시 에러 코드
  execBash(path.join(__dirname, '../scripts/run.sh'), paths);

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

function execBash(script: string, paths: string) {
  const child = spawn('bash', ['-c', `echo '${paths}' | ${script}`]);

  child.stdout.on('data', data => {
    console.log('result', data.toString());
  });

  child.stderr.on('data', data => {
    console.error(`error: ${data}`);
  });

  child.on('close', code => {
    console.log(`exit: ${code}`);
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
