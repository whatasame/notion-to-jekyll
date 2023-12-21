import * as core from '@actions/core'
import { run } from './main'
import { spawn } from 'node:child_process'
import path from 'path'
import * as fs from 'fs'

const INPUTS = {
  NOTION_API_KEY: 'notion_api_key',
  NOTION_DATABASE_ID: 'notion_database_id',
  GITHUB_WORKSPACE: 'github_workspace'
}

export async function start(): Promise<void> {
  const options = importOptions()
  validatePostDirectory(options.github.workspace)

  await run(options)

  await exec('bash', [path.join(__dirname, '../script/run.sh')], {
    env: {
      ...process.env
    }
  })
}

function importOptions() {
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
      })
    }
  }
}

function validatePostDirectory(workspace: string) {
  const postDirectory = path.join(workspace, '_posts')
  if (!fs.existsSync(postDirectory)) {
    throw new Error(`⛔️ Post directory "${postDirectory}" does not exist.`)
  }
}

const exec = async (
  cmd: string,
  args: string[] = [],
  options = {}
): Promise<void> => {
  new Promise((resolve, reject) =>
    spawn(cmd, args, { stdio: 'inherit', ...options })
      .on('close', code => {
        if (code !== 0) {
          return reject(
            Object.assign(new Error(`Invalid exit code: ${code}`), { code })
          )
        }
        return resolve(code)
      })
      .on('error', reject)
  )
}

// ------- Bootstrap -------

;(async () => {
  try {
    await start()
  } catch (e) {
    core.setFailed(`${e instanceof Error ? e.message : e}`)
  }
})()
