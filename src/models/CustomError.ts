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
    this.name = 'CustomError'
  }
}
