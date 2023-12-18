import { getGitClient } from '../core/di-container'

export async function commit(path: string, message: string): Promise<void> {
  const git = getGitClient()

  try {
    await git.add(path)
    await git.commit(message)
    console.log('Changes committed successfully.')
  } catch (error) {
    console.error('Failed to commit changes:', error)
  }
}
