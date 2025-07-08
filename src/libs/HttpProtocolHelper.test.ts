import { vi, describe, expect, it, test } from 'vitest'
import { HttpProtocolHelper } from './HttpProtocolHelper'

describe('HttpProtocolHelper', () => {
  describe('Hash', () => {
    it('request with nothing ==> undefined', async () => {
      expect(HttpProtocolHelper.extractBearerToken({})).toBe(undefined)
    })

    it('request with bearer token', async () => {
      const req = {
        headers: { authorization: 'Bearer 123' }
      }

      expect(HttpProtocolHelper.extractBearerToken(req)).toBe('123')
    })
  })

  describe('isValidUrl', () => {
    it('valid', async () => {
      expect(HttpProtocolHelper.isValidUrl('https://chat.zalo.me/')).toBeTruthy()
      expect(HttpProtocolHelper.isValidUrl('https://vbee.store/')).toBeTruthy()
      expect(HttpProtocolHelper.isValidUrl('https://docs.google.com/document/d/1oR2YMdIiwrmPWzjq9M-6LmE4nETjWaNcugcc4fbc/edit?tab=t.0')).toBeTruthy()
      expect(HttpProtocolHelper.isValidUrl('http://vbee.ai/ref9M-6LmE4nETjWaNcugcc4fbc/edit?tab=t.0#a=555')).toBeTruthy()
    })

    it('invalid http', async () => {
      expect(HttpProtocolHelper.isValidUrl('ftps://vbee.cloud')).toBeFalsy()
      expect(HttpProtocolHelper.isValidUrl('mailto:vbee@com.com')).toBeFalsy()
    })
  })
})
