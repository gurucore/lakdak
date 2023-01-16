import { vi, describe, expect, it, test } from 'vitest'
import HttpProtocolHelper from './HttpProtocolHelper'

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
})
