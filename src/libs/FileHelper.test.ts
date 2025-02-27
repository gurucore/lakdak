import { it, expect, describe } from 'vitest'
import path from 'path'
import { FileHelper as target } from './FileHelper'
import { TestHelper } from './TestHelper'
import { createReadStream } from 'fs'

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
      const tempFiles = await TestHelper.createTempFilesToTest(1, 'small')

      const targetFilePath = await target.copyToTempDir(tempFiles[0])

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

  describe('writeDataToFile', () => {
    it('write some string to file', async () => {
      const tempFilePath = target.generateNewTempFilePath()
      await target.writeDataToFile('test', tempFilePath)

      expect(await target.checkFileExist(tempFilePath)).toBeTruthy()
    })

    it('null path or content should be undefined', async () => {
      const tempFilePath = target.generateNewTempFilePath()
      await target.writeDataToFile(null, tempFilePath)
      expect(await target.checkFileExist(tempFilePath)).toBeFalsy()

      const filePath = await target.writeDataToFile('some string', null)
      expect(filePath).toBeUndefined()
    })
  })

  describe('writeStreamToFile', () => {
    it('write stream to file', async () => {
      const tempFiles = await TestHelper.createTempFilesToTest(1, 'small')
      const readableStream = createReadStream(tempFiles[0])

      const tempFilePathTarget = target.generateNewTempFilePath()
      await target.writeStreamToFile(readableStream, tempFilePathTarget)

      expect(await target.checkFileExist(tempFilePathTarget)).toBeTruthy()
    })
  })
})
