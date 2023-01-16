import { vi, describe, expect, it, test } from 'vitest'
import SecurityHelper from './SecurityHelper'

describe('SecurityHelper', () => {
  describe('Hash', () => {
    it('hash nothing to undefined', async () => {
      expect(SecurityHelper.hash('')).toBe(undefined)
      expect(SecurityHelper.hash(null)).toBe(undefined)
    })

    it('hash value', async () => {
      expect(SecurityHelper.hash('abc')).toBe(SecurityHelper.hash('ab' + 'c'))
    })
  })

  describe('Asymetric encryption using RSA', () => {
    test('generate keys', async () => {
      const { publicKey, privateKey } = SecurityHelper.generateRSAKeyPair()

      expect(publicKey).toMatch('BEGIN PUBLIC KEY')
      expect(privateKey).toMatch('BEGIN PRIVATE KEY')
    })

    test('encryptText & decryptText', async () => {
      const { publicKey, privateKey } = SecurityHelper.generateRSAKeyPair()
      // console.log(publicKey)
      // console.log(privateKey)

      const plainText = 'this is the plain test used to test'
      const encrypted = SecurityHelper.encryptText(publicKey, plainText)
      const decrypted = SecurityHelper.decryptText(privateKey, encrypted)

      expect(decrypted).toEqual(plainText)
    })
  })
})
