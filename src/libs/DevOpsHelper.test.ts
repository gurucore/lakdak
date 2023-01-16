import { vi, describe, expect, it, test } from 'vitest'
import DevOpsHelper from './DevOpsHelper'

describe('DevOpsHelper', () => {
  describe('getCurrentServerIpAddresses', () => {
    it('should be IP v4', async () => {
      expect(DevOpsHelper.getCurrentServerIpAddresses()).toMatch(/(\d+\.?){4}/)
    })
  })
})
