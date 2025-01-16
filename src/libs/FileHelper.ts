import os from 'os'
import path from 'path'

import { promises as fsPromises, constants } from 'fs'

import { CLIHelper } from './CLIHelper'
import { DEBUG, UtilHelper } from './UtilHelper'
import { RawNetworkHelper } from './NetworkHelper'

export class FileHelper {
  static async checkFileExist(filePath?: string) {
    if (!filePath) return false

    try {
      await fsPromises.access(filePath, constants.F_OK)
      return true
    } catch (err) {
      if ((err as any).code === 'ENOENT') {
        return false
      } else {
        throw err // Re-throw the error if it's not a "file not found" error
      }
    }
  }

  /** return the extension, include the dot (.) */
  static getFileExtension(filePathOrURL?: string) {
    if (!filePathOrURL) return ''
    return path.extname(filePathOrURL)
  }

  /** copy files to OS temp dir  */
  static async copyToTempDir(sourceFilePath: string) {
    if (!sourceFilePath) return

    const tmpFileName = path.basename(sourceFilePath)
    const tmpFilePath = path.join(os.tmpdir(), tmpFileName)

    try {
      await fsPromises.copyFile(sourceFilePath, tmpFilePath)
      // DEBUG(`File copied: ${sourceFilePath} => ${tmpFilePath}`)
      return tmpFilePath
    } catch (err) {
      console.error(`Error copying file: ${err}`)
      throw err
    }
  }

  static async clearTempDir() {
    console.log('Clearing /tmp dir ...')
    await CLIHelper.exec('rm', ['-rf', os.tmpdir() + '/*'], 'os.clearTempDir', { cwd: os.tmpdir() })
  }

  /**
   * Generate a temp filePath in side temp dir (but it is just the file path, no file content existed)
   * @param prefix prepend to the fileName
   * @param fileExtension extension must be with the dot (.), append to the result fileName
   * @returns
   */
  static generateNewTempFilePath(prefix: string = '', fileExtension = '') {
    const tmpFileName = `${prefix}${UtilHelper.createRandom()}${fileExtension}`
    const tmpFilePath = path.join(os.tmpdir(), tmpFileName)

    return tmpFilePath
  }

  static async unlinksSafe(paths: string[]) {
    const arr = paths.map(async (p) => {
      if (await FileHelper.checkFileExist(p)) {
        await fsPromises.unlink(p)
      }
    })

    return Promise.all(arr)
  }

  /**
   * download remote file into local temp dir
   * @param link
   * @returns local temp file path
   */
  static async cacheRemoteUrl(link: string) {
    if (!link) throw new Error(`${link} is empty, neither URL nor localFile`)

    if (UtilHelper.isLocalFilePath(link)) {
      return link // already in local, no need to download
    }

    if (!UtilHelper.isURL(link)) {
      throw new Error(`${link} is neither URL nor localFile`)
    }

    const url = link
    // https://vbee-studio-tmp.s3.ap-southeast-1.amazonaws.com/voice-cloning/voices/6765858815ba1ce0979a8b35/filename.wav ==> filename.wav
    const fileName = path.basename(link) // = link.split('/').slice(-1)[0]
    const outputFilePath = FileHelper.generateNewTempFilePath('temp-cached_', '_' + fileName)

    try {
      await RawNetworkHelper.download(url, outputFilePath)
    } catch (err) {
      console.error('Error: 404 not Found: ', url, (err as any).code)
    }

    return outputFilePath
  }
}
