import { it, expect, describe } from 'vitest'
import { CLIHelper as target } from './CLIHelper'

describe('CLIHelper', () => {
  describe('escapeArg', () => {
    it('undefined or null should be empty string (no appearance in the CLI cmd)', async () => {
      expect(target.escapeArg(undefined)).toBe('')
      expect(target.escapeArg(null)).toBe('')
    })

    it('empty string should be "" (appear as "" in the output CLI cmd)', async () => {
      expect(target.escapeArg('')).toBe('""')
    })
  })

  describe('exec', () => {
    it('exec dir', async () => {
      const result = await target.exec('dir', undefined, 'unit test')
      console.log(result)
      expect(result.output?.length).greaterThan(0)
    })
  })

  describe('spawn', () => {
    it('spawn dir', async () => {
      const result = await target.spawn(
        'dir',
        ['-a'],
        'unit test'
        // { silent: false, throwOnError: false }
      )
      console.log(result)
      expect(result.output?.length).greaterThan(0)
    })
  })
})
