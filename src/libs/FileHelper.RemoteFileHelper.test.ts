import { it, expect, describe } from 'vitest'
import path from 'path'
import { RemoteFileHelper as target } from './FileHelper'
import { TestHelper } from './TestHelper'

describe('RemoteFileHelper', () => {
  describe('cacheRemoteUrl', () => {
    it('exist file should be downloaded', async () => {
      expect(await target.checkFileExist(await target.cacheRemoteUrl(TestHelper.ExistingInternetFileUrl))).toBeTruthy()
      expect(await target.checkFileExist(await target.cacheRemoteUrl(TestHelper.ExistingInternetWaveFileUrl))).toBeTruthy()
    })

    it('exist file with url param should be downloaded', async () => {
      expect(await target.checkFileExist(await target.cacheRemoteUrl(TestHelper.ExistingInternetFileUrl + '?a=b&c=d.mp3#hash=$'))).toBeTruthy()
      expect(await target.checkFileExist(await target.cacheRemoteUrl(TestHelper.ExistingInternetWaveFileUrl + '?a=b&c=d.mp3#hash=$'))).toBeTruthy()
    })
  })
})
