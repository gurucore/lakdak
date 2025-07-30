import { it, expect, describe, vi } from 'vitest'
import { RemoteFileHelper as target } from './FileHelper'
import { TestHelper } from './TestHelper'

describe('RemoteFileHelper', () => {
  describe('cacheRemoteUrl', { timeout: 20000 }, () => {
    it('exist file should be downloaded', async () => {
      expect(await target.checkFileExist(await target.cacheRemoteUrl(TestHelper.ExistingInternetFileUrl))).toBeTruthy()
      expect(await target.checkFileExist(await target.cacheRemoteUrl(TestHelper.ExistingInternetWaveFileUrl))).toBeTruthy()
    })

    it('exist file with url param should be downloaded', async () => {
      expect(await target.checkFileExist(await target.cacheRemoteUrl(TestHelper.ExistingInternetFileUrl + '?a=b&c=d.mp3#hash=$'))).toBeTruthy()
      expect(await target.checkFileExist(await target.cacheRemoteUrl(TestHelper.ExistingInternetWaveFileUrl + '?a=b&c=d.mp3#hash=$'))).toBeTruthy()
    })

    it('non exist file with url should throw', async () => {
      await expect(target.cacheRemoteUrl(`https://example.com/non-exist-123456789${Date.now()}.mp3`, { timeout: 10000 })).rejects.toThrow()
    })
  })
})
