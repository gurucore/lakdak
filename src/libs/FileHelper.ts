import os from 'os'
import path from 'path'
import { Readable } from 'stream'
import { promises as fsPromises, constants, createWriteStream } from 'fs'

import { RawNetworkHelper } from './RawNetworkHelper'
import { CommonHelper } from 'gachchan'

import { DEBUG } from './Utils'

export class FileHelper {
  /** use promise based access() API to check existence */
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

  /**
   * Checks if a string is a valid file path. Just file name like "file" or "file.txt" is false. "c:/file" is true
   * @param str The string to check.
   */
  static isLocalFilePath(str: string): boolean {
    if (!str) throw Error('argument "str" is empty')

    // Check if it's an absolute path or relative path
    if (path.isAbsolute(str) || str.startsWith('./') || str.startsWith('../')) {
      return true
    }
    return false
  }

  /** copy files to OS temp dir  */
  static async copyToTempDir(sourceFilePath: string) {
    if (!sourceFilePath) return

    const tmpFileName = path.basename(sourceFilePath)
    const tmpFilePath = path.join(os.tmpdir(), tmpFileName)

    try {
      await fsPromises.copyFile(sourceFilePath, tmpFilePath)
      DEBUG(`File copied: ${sourceFilePath} => ${tmpFilePath}`)
      return tmpFilePath
    } catch (err) {
      console.error(`Error copying file: ${err}`)
      throw err
    }
  }

  /**
   * Generate a temp filePath in side temp dir (but it is just the file path, no file content existed)
   * @param prefix prepend to the fileName
   * @param fileExtension extension must be with the dot (.), append to the result fileName
   * @returns
   */
  static generateNewTempFilePath(prefix: string = '', fileExtension = '') {
    const tmpFileName = `${prefix}${CommonHelper.createRandomString()}${fileExtension}`
    const tmpFilePath = path.join(os.tmpdir(), tmpFileName)

    return tmpFilePath
  }

  /** try to delete files */
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
    if (!link) throw new Error(`argument link:${link} is empty, neither URL nor localFile`)

    if (FileHelper.isLocalFilePath(link)) {
      return link // already in local, no need to download
    }

    if (!CommonHelper.isURL(link)) {
      throw new Error(`argument link:${link} is neither URL nor localFile`)
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

  /**
   * write content to file
   * @param content
   * @param filePath
   * @returns written filePath, or undefined if error
   */
  static async writeDataToFile(content: string | Buffer, filePath: string) {
    if (!filePath) return
    if (!content) return

    try {
      await fsPromises.writeFile(filePath, content)
      return filePath
    } catch (err) {
      console.error(`Failed to save content to file ${filePath}`, { filePath, error: err })
    }
  }

  /**
   * pipe stream to file
   * @param readableStream
   * @param filePath
   * @returns written filePath, throw if error
   */
  static async writeStreamToFile(readableStream: Readable, filePath: string) {
    if (!filePath) return
    if (!readableStream) return

    return new Promise((resolve, reject) => {
      const writableStream = createWriteStream(filePath)

      readableStream.on('error', (err) => {
        reject(err)
      })
      writableStream.on('error', (err) => {
        reject(err)
      })
      writableStream.on('finish', () => {
        resolve(filePath)
      })

      readableStream.pipe(writableStream)
    })
  }
}
