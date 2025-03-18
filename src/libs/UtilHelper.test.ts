import { it, expect, describe } from 'vitest'
import { UtilHelper as target } from './UtilHelper'
import { TestHelper } from './TestHelper'

describe('UtilHelper', () => {
  describe('isURL', () => {
    it('URL should be true', async () => {
      expect(target.isURL('https://vbee-studio-tmp.s3.ap-southeast-1.amazonaws.com/voice-cloning/voices/6765858815ba1ce0979a8b35/8d9e502b-9f8b-4dbe-9b0b-65c45c8bdf41-1734998803328.wav')).toBeTruthy()
      expect(target.isURL(TestHelper.SampleDomainUrl)).toBeTruthy()
    })

    it('file should be false', async () => {
      expect(target.isURL('../https.txt')).toBeFalsy()
    })
  })
})
