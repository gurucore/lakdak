/// <reference types="node" />

import crypto from 'crypto'

export default class SecurityHelper {
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
   *
   * @param modulusLength effective key size 2048 bit (good until 2030), after 2030, use 3072 bit
   * @returns keypair: object of public and private
   */
  static generateRSAKeyPair(modulusLength = 2048): { publicKey: string | Buffer; privateKey: string | Buffer } {
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
  static encryptText(publicKey, plainText: string): string {
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
  static decryptText(privateKey, encryptedTextBase64: string): string {
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
}
