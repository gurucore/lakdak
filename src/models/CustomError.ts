import { CustomError as CustomErrorBase } from 'gachchan'
/** Custom Error class, with support extra information about the exception
 * @deprecated should use CustomError from npm:gachchan
 */
export class CustomError extends CustomErrorBase {}

export class SecurityError extends CustomErrorBase {
  constructor(message: string, public readonly error?: Error | unknown, extra?: any) {
    super(message, error || 'SECURITY_ERROR', extra)
  }
}

export class FileError extends CustomErrorBase {
  constructor(message: string, public readonly error?: Error | unknown, extra?: any) {
    super(message, error || 'FILE_ERROR', extra)
  }
}

export class ValidationError extends CustomErrorBase {
  constructor(message: string, public readonly error?: Error | unknown, extra?: any) {
    super(message, error || 'VALIDATION_ERROR', extra)
  }
}
