import * as core from '@actions/core'
import { initialize } from './config/secret'
import { run } from './main'

initialize(
  core.getInput('notion_api_key'),
  core.getInput('notion_database_id'),
  core.getInput('commit_email'),
  core.getInput('commit_author')
)

run(core.getInput('github.workspace'))
