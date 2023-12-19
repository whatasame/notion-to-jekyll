import { commit } from '../../src/system/git'
import * as fs from 'fs-extra'
import path from 'path'
import { getGitClient } from '../../src/core/di-container'
import {
  initializeCommitAuthor,
  initializeCommitEmail
} from '../../src/config/secret'

const testFilePath = path.join(__dirname, 'test-file.txt')
const testBranchName = 'test-branch'

initializeCommitAuthor('whatasame')
initializeCommitEmail('whatasame@users.noreply.github.com')
const git = getGitClient()

let originalBranch: string

beforeEach(async () => {
  originalBranch = (await git.branchLocal()).current
  await git.checkoutBranch(testBranchName, originalBranch)

  await fs.writeFile(testFilePath, 'This is a test file.')
})

afterEach(async () => {
  await fs.remove(testFilePath)

  await git.checkout(originalBranch)
  await git.deleteLocalBranch(testBranchName, true)
})

describe('git', () => {
  it('should commit', async () => {
    await commit(testFilePath, 'Test commit')

    const commitLog = await git.log()
    expect(commitLog.latest?.message).toBe('Test commit')
  })
})
