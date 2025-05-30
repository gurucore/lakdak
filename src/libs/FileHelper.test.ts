import { it, expect, describe } from 'vitest'
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

  describe('isLocalFilePath', () => {
    it('URL should be false', async () => {
      expect(target.isLocalFilePath('https://vbee-studio-tmp.s3.ap-southeast-1.amazonaws.com/voice-cloning/voices/67658588134998803328.wav')).toBeFalsy()

      expect(target.isLocalFilePath(TestHelper.SampleDomainUrl)).toBeFalsy()
    })

    it('filename ONLY should be false', async () => {
      expect(target.isLocalFilePath('file')).toBeFalsy()
      expect(target.isLocalFilePath('filename.ext')).toBeFalsy()
    })

    it('file should be true', async () => {
      expect(target.isLocalFilePath('/https')).toBeTruthy()
      expect(target.isLocalFilePath('./https.txt')).toBeTruthy()
      expect(target.isLocalFilePath('../https.txt')).toBeTruthy()
      expect(target.isLocalFilePath('/mnt/test/https.txt')).toBeTruthy()
    })
  })
})
