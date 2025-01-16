import path from 'path'
import { nanoid } from 'nanoid'

/** noticable log in DEBUG environment */
export function DEBUG(...args) {
  if (process.env.NODE_ENV !== 'production') {
    console.debug('\x1b[36m🐞 ------ \x1b[0m', ...args)
    // [ℹ️]
  }
}

export class UtilHelper {
  static createRandom() {
    return `${new Date().toISOString().substring(0, 10)}_${nanoid()}`
  }

  /** convert true false to yes/no or icon of yes/no */
  static boolToYesNo(b?: boolean, withText = false) {
    const text = b ? 'yes' : 'no '
    const icon = b ? '✅' : '🚫'

    return icon + (withText ? text : '')
  }

  /**
   * Checks if a string is a valid URL.
   * @param str The string to check.
   */
  static isURL(str: string): boolean {
    try {
      new URL(str)
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Checks if a string is a valid file path. Just file name like "file" or "file.txt" is false. "c:/file" is true
   * @param str The string to check.
   */
  static isLocalFilePath(str: string): boolean {
    if (!str) throw Error('str is empty')

    // Check if it's an absolute path or relative path
    if (path.isAbsolute(str) || str.startsWith('./') || str.startsWith('../')) {
      return true
    }
    return false
  }
}
