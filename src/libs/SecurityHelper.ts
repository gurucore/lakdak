import crypto from 'crypto'
import { SecurityError, ValidationError } from '../models/CustomError'

export interface SecurityConfig {
  /** effective key size 2048 bit (good until 2030), after 2030, use 3072 bit */
  rsaKeySize: number

  /** validation for the hash method to prevent potential DoS attacks */
  maxHashInputSize: number
}

export class SecurityHelper {
  private static config: SecurityConfig = {
    rsaKeySize: 2048,
    maxHashInputSize: 10 * 1024 * 1024 // 1MB
  }

  static setConfig(config: Partial<SecurityConfig>): void {
    this.config = { ...this.config, ...config }
  }

  /**
   *
   * @param input
   * @param algorithm  "sha1" "sha256"
   * @returns hex string
   */
  static hash(input: crypto.BinaryLike, algorithm = 'sha256'): string {
    if (!input) return

    return crypto.createHash(algorithm).update(input).digest('hex')
  }

  /**
   * Safer async hashing, with validating input size, with salt support to prevent rainbow table attacks
   * @param input with validating input size
   * @param algorithm  "sha1" "sha256"
   * @param salt prevent rainbow table attacks
   * @returns hex string
   */
  static async hashAsync(input: crypto.BinaryLike, algorithm = 'sha256', salt?: string) {
    if (!this.validateInput(input, this.config.maxHashInputSize)) {
      throw new ValidationError('Input size exceeds maximum allowed size')
    }

    const finalSalt = salt || (await this.generateSalt())
    const hash = crypto.createHash(algorithm)

    return new Promise((resolve, reject) => {
      try {
        hash.update(finalSalt)
        hash.update(input)
        resolve(hash.digest('hex'))
      } catch (error) {
        reject(new SecurityError('Failed to generate hash', { error }))
      }
    })
  }

  /**
   *
   * @param modulusLength effective key size 2048 bit (good until 2030), after 2030, use 3072 bit
   * @returns keypair: object of public and private
   */
  static generateRSAKeyPair(modulusLength: number = this.config.rsaKeySize): { publicKey: string | Buffer; privateKey: string | Buffer } {
    if (modulusLength < 2048) {
      throw new SecurityError('RSA key size must be at least 2048 bits')
    }

    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    })
    return { publicKey, privateKey }
  }

  /**
   * Encrypt using publicKey, the encrypted data is in the form of bytes, so we print it in base64 format
   * so that it's displayed in a more readable form
   * @param publicKey
   * @param plainText
   * @returns String base64 format
   */
  static encryptText(publicKey: string | Buffer, plainText: string): string {
    const encryptedData = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
      },
      Buffer.from(plainText)
    )
    return encryptedData.toString('base64')
  }

  /**
   * decrypt using privateKey. The decrypted data is of the Buffer type,
   * which we can convert to a string to reveal the original data
   * @param privateKey
   * @param encryptedTextBase64 String in base64 format
   * @returns utf-8 string
   */
  static decryptText(privateKey: string | Buffer, encryptedTextBase64: string): string {
    const decryptedData = crypto.privateDecrypt(
      {
        key: privateKey,
        // In order to decrypt the data, we need to specify the
        // same hashing function and padding scheme that we used to
        // encrypt the data in the previous step
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
      },
      Buffer.from(encryptedTextBase64, 'base64')
    )
    return decryptedData.toString('utf8')
  }

  private static async generateSalt(): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buffer) => {
        if (err) {
          reject(new SecurityError('Failed to generate salt', { error: err }))
        } else {
          resolve(buffer.toString('hex'))
        }
      })
    })
  }

  /**
   *
   * @param input
   * @param maxSize in bytes
   * @returns
   */
  private static validateInput(input: crypto.BinaryLike, maxSize: number): boolean {
    if (Buffer.isBuffer(input)) {
      return input.length <= maxSize
    }
    if (typeof input === 'string') {
      return Buffer.byteLength(input) <= maxSize
    }
    return true
  }
}
