import { it, expect, describe } from 'vitest'
import path from 'path'
import { FileHelper as target } from './FileHelper'
import { TestHelper } from './TestHelper'

describe('FileHelper', () => {
  describe('checkFileExist', () => {
    it('checkFileExist', async () => {
      expect(await target.checkFileExist()).toBeFalsy()
      expect(await target.checkFileExist('')).toBeFalsy()
      expect(await target.checkFileExist('         ')).toBeFalsy()
    })
  })

  describe('copyToTempDir', () => {
    it('copyToTempDir', async () => {
      const audioFilePrefix = 'ngochuyen_test001_'
      const formattedNumber = (1).toString().padStart(2, '0')
      const fileName = `${audioFilePrefix}${formattedNumber}.wav`
      const sourceFilePath = path.join(process.cwd(), './.data/audio', fileName)

      const targetFilePath = await target.copyToTempDir(sourceFilePath)

      expect(targetFilePath).not.toBeUndefined()
      expect(target.checkFileExist(targetFilePath)).toBeTruthy()
    })
  })

  describe('getFileExtension', () => {
    it('normal file path should be correct', async () => {
      expect(target.getFileExtension('hello.txt')).toBe('.txt')
      expect(target.getFileExtension('hello')).toBe('')
    })

    it('file inside URL should be correct', async () => {
      expect(target.getFileExtension(TestHelper.ExistingInternetFileUrl)).toBe('.txt')

      expect(target.getFileExtension('https://vbee-studio-tmp.s3.ap-southeast-1.amazonaws.com/voice-cloning/voices/676585-1734998803328.wav')).toBe('.wav')
    })
  })

  describe('generateNewTempFilePath', () => {
    it('with prefix and ext', async () => {
      const prefix = 'prefix_'
      const ext = '.txt'
      const filePath = await target.generateNewTempFilePath(prefix, ext)
      // DEBUG(filePath)
      expect(filePath.indexOf(prefix)).toBeGreaterThan(0)
      expect(filePath.endsWith(ext)).toBeTruthy()
    })
  })

  describe('cacheRemoteUrl', () => {
    it('exist file should be downloaded into temp folder', async () => {
      expect(await target.cacheRemoteUrl(TestHelper.ExistingInternetFileUrl)).contain(path.basename(TestHelper.ExistingInternetFileUrl))
    })
  })
})
