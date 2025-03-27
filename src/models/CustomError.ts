/** Custom Error class, with support extra information about the exception */
export class CustomError extends Error {
  constructor(
    message: string,

    /** original error */
    public readonly error?: Error | unknown,

    /** extra information about the exception, attached to this Error */
    public readonly extra?: any
  ) {
    super(message)
    this.name = this.constructor.name || 'CustomError'
  }
}

export class SecurityError extends CustomError {
  constructor(message: string, public readonly error?: Error | unknown, extra?: any) {
    super(message, error || 'SECURITY_ERROR', extra)
  }
}

export class FileError extends CustomError {
  constructor(message: string, public readonly error?: Error | unknown, extra?: any) {
    super(message, error || 'FILE_ERROR', extra)
  }
}

export class ValidationError extends CustomError {
  constructor(message: string, public readonly error?: Error | unknown, extra?: any) {
    super(message, error || 'VALIDATION_ERROR', extra)
  }
}
