import os from 'os'
import path from 'path'
import { Readable } from 'stream'
import { promises as fsPromises, constants, createWriteStream } from 'fs'
import { CommonHelper } from 'gachchan'

import { DownloadOptions, RawNetworkHelper } from './RawNetworkHelper'

import { CustomError, FileError, ValidationError } from '../models/CustomError'

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
        // Re-throw the error if it's not a "file not found" error
        throw new FileError('Error checking file existence', err, { filePath })
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
    if (!str) throw new ValidationError('Path string cannot be empty')
    // Check if it's an absolute path or relative path
    if (path.isAbsolute(str) || str.startsWith('./') || str.startsWith('../')) {
      return true
    }
    return false
  }

  /** copy files to OS temp dir  */
  static async copyToTempDir(sourceFilePath: string) {
    if (!sourceFilePath) {
      throw new ValidationError('Source file path cannot be empty')
    }

    const tmpFileName = path.basename(sourceFilePath)
    const tmpFilePath = path.join(os.tmpdir(), tmpFileName)

    try {
      await fsPromises.copyFile(sourceFilePath, tmpFilePath)
      return tmpFilePath
    } catch (err) {
      console.error(`Error copying file: ${err}`)
      throw new FileError('Failed to copy file to temp directory', err, { sourceFilePath, tmpFilePath })
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

  /** try to delete files, does not throw */
  static async unlinksSafe(paths: string[]) {
    const operations = paths.map(async (p) => {
      if (await FileHelper.checkFileExist(p)) {
        try {
          await fsPromises.unlink(p)
        } catch (err) {
          console.error(`Failed to delete file: ${p}`, err)
        }
      }
    })

    return Promise.all(operations)
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

    // if (!filePath || !content) {
    //   throw new ValidationError('File path and content are required')
    // }

    try {
      await fsPromises.writeFile(filePath, content)
      return filePath
    } catch (err) {
      console.error(`Failed to save content to file ${filePath}`, { filePath, error: err })
      // throw new FileError('Failed to write content to file', err, { filePath })
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

    if (!filePath || !readableStream) {
      throw new ValidationError('File path and readable stream are required')
    }

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

  static async getSize(filePath: string) {
    try {
      const stats = await fsPromises.stat(filePath)
      return stats.size
    } catch (err) {
      throw new FileError('Failed to get file size', err, { filePath })
    }
  }
}

export class RemoteFileHelper extends FileHelper {
  /**
   * download remote file into local temp dir
   * @param link
   * @returns local temp file path
   */
  static async cacheRemoteUrl(link: string, options: DownloadOptions = {}) {
    if (!link) throw new ValidationError(`argument link/URL cannot be empty:${link}`)

    if (FileHelper.isLocalFilePath(link)) {
      return link // already in local, no need to download
    }

    if (!CommonHelper.isURL(link)) {
      throw new ValidationError(`argument link:${link} is invalid URL format`)
    }

    const url = link
    // https://vbee-studio-tmp.s3.ap-southeast-1.amazonaws.com/test/a/b/filename.wav?a=b&c=d.mp3 ==> filename.wav
    const fileName = this.extractFilenameFromUrl(link)
    const fileExtension = path.extname(fileName)
    const outputFilePath = FileHelper.generateNewTempFilePath('temp-cached_', '_' + fileName.slice(0, 30) + fileExtension)

    try {
      await RawNetworkHelper.download(url, outputFilePath, options)
    } catch (err) {
      throw new FileError('Failed to cache remote URL', err, { errorCode: (err as any).code, url, outputFilePath })
    }

    return outputFilePath
  }

  private static extractFilenameFromUrl(url: string): string {
    try {
      // URL Parsing: The URL object is used to parse the input URL, which automatically handles the components (protocol, hostname, pathname, search, hash).
      const urlObj = new URL(url)

      // Pathname Extraction: The pathname is split by '/' to get an array of path segments.
      const pathSegments = urlObj.pathname.split('/')

      // Filename Isolation: The last segment of the path is taken as it contains the filename.
      return pathSegments[pathSegments.length - 1]
    } catch (error) {
      throw new CustomError('Invalid URL', error, { url })
    }
  }
}
