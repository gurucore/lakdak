import http from 'http'
import https from 'https'
import fs from 'fs'
import { URL } from 'url'
import { CustomError } from '../models/CustomError'

export interface FileInfo {
  mime: string
  size: number
  filePath: string
}

export interface DownloadOptions {
  timeout?: number
  headers?: Record<string, string>
}

export class DownloadError extends CustomError {
  constructor(message: string, error?: Error | unknown, public readonly statusCode?: number, public readonly url?: string, extra?: any) {
    super(message, error, extra)
    this.name = 'DownloadError'
  }
}

/*
      In Node.js: Axios uses the built-in http and https modules. 
      This means that when you use Axios in a Node.js environment, 
      it's essentially a wrapper around these core modules, 
      providing a higher-level API and additional features.
      */
export class RawNetworkHelper {
  /**
   * This is stream download using raw http/https API
   * Real-world performance example for a 1GB file:

Stream implementation: ~100MB memory usage
fetch()/axios: ~1.1GB memory usage (entire file + overhead)

However, there are cases where fetch() or axios might be preferred:

If you need to process the file in memory anyway
For very small files where the overhead doesn't matter
When you need the additional features these libraries provide (like automatic retries, request interception, etc.)
   */
  static async download(urlString: string, filePath: string, options: DownloadOptions = {}): Promise<FileInfo> {
    // Validate and parse URL
    let url: URL
    try {
      url = new URL(urlString)
    } catch (err) {
      throw new DownloadError(`Invalid URL: ${urlString}`, err, undefined, urlString)
    }

    // Validate protocol
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new DownloadError(`Unsupported protocol: ${url.protocol}`)
    }

    // Ensure directory exists
    // const directory = path.dirname(filePath)
    // await fs.promises.mkdir(directory, { recursive: true })

    const { timeout = 30000, headers = {} } = options

    return new Promise<FileInfo>((resolve, reject) => {
      const fileStream = fs.createWriteStream(filePath)
      let fileInfo: FileInfo = {
        mime: '',
        size: 0,
        filePath
      }

      const protocol = url.protocol === 'https:' ? https : http
      const request = protocol.get(url, { timeout, headers }, (response) => {
        // Support download via http redirects
        if (response.statusCode === 301 || response.statusCode === 302) {
          const redirectUrl = response.headers.location
          if (!redirectUrl) {
            reject(new DownloadError('Redirect location not provided', undefined, response.statusCode, urlString))
            return
          }

          RawNetworkHelper.download(redirectUrl, filePath, options).then(resolve).catch(reject)
          return
        }

        // Handle error status codes
        if (response.statusCode !== 200) {
          reject(
            new DownloadError(
              `Raw download file error. ${response.statusCode}`,
              //
              undefined,
              response.statusCode,
              urlString
            )
          )
          return
        }

        // Set file info
        fileInfo = {
          mime: response.headers['content-type'] || '',
          size: parseInt(response.headers['content-length'] || '0', 10),
          filePath
        }

        response.pipe(fileStream)
      })

      request.on('error', (err) => {
        fileStream.destroy()
        fs.unlink(filePath, () => {
          reject(new DownloadError(`Network error: ${err.message}`, err, undefined, urlString))
        })
      })
      request.on('timeout', () => {
        request.destroy()
        fileStream.destroy()
        fs.unlink(filePath, () => {
          reject(new DownloadError(`Download timed out after ${timeout}ms`, undefined, undefined, urlString))
        })
      })

      // Handle successful download
      fileStream.on('finish', () => {
        fileStream.close(() => resolve(fileInfo))
      })
      // Handle file system errors
      fileStream.on('error', (err) => {
        fileStream.destroy()
        fs.unlink(filePath, () => {
          reject(new DownloadError(`File system error: ${err.message}`, err, undefined, urlString))
        })
      })
    })
  }
}
