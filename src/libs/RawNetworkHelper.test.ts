import { it, expect, describe } from 'vitest'
import { RawNetworkHelper as target } from './RawNetworkHelper'
import { FileHelper } from './FileHelper'
import { TestHelper } from './TestHelper'

describe('RawNetworkHelper', () => {
  describe('download existing file should be in temp local file', () => {
    it('exist file should be downloaded into temp folder', async () => {
      const outputTempFilePath = FileHelper.generateNewTempFilePath('unittest_', '.txt')
      const result = await target.download(TestHelper.ExistingInternetFileUrl, outputTempFilePath)
      expect(result?.size).greaterThan(0)
      expect(FileHelper.checkFileExist(outputTempFilePath)).toBeTruthy()
    })
  })
})
