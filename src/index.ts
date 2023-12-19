import * as core from '@actions/core'
import { run } from './main'
import { spawn } from 'node:child_process'
import path from 'path'

const INPUTS = {
  NOTION_API_KEY: 'notion_api_key',
  NOTION_DATABASE_ID: 'notion_database_id'
}

async function start(): Promise<void> {
  try {
    const notionApiKey = core.getInput(INPUTS.NOTION_API_KEY, {
      required: true
    })
    const notionDatabaseId = core.getInput(INPUTS.NOTION_DATABASE_ID, {
      required: true
    })
    const options = {
      notion: {
        apiKey: notionApiKey,
        databaseId: notionDatabaseId
      }
    }

    await run(options)
  } catch (e) {
    core.setFailed(`${e instanceof Error ? e.message : e}`)
  }

  await exec('bash', [path.join(__dirname, '../script/run.sh')], {
    env: {
      ...process.env
    }
  })
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
;(async () => {
  await start()
})()
