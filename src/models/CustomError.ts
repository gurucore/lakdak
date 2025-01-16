export class CustomError extends Error {
  constructor(
    message: string,
    public readonly error?: Error | unknown,
    public readonly extra?: any
  ) {
    super(message)
    this.name = 'CustomError'
  }
}
