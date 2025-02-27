import path from 'path'
import { FileHelper } from './FileHelper'

const sampleTypeMap = {
  small: 'beep-',
  medium: 'ngochuyen_test001_'
}

export class TestHelper {
  static ExistingInternetFileUrl = 'https://vnexpress.net/robots.txt'
  static SampleDomainUrl = 'https://gurucore.com'

  /**
   * Create some temp files in temp folder
   * @param length default is 2
   * @param sampleFileType default is "small"
   * @returns
   */
  static async createTempFilesToTest(length: number = 2, sampleFileType: 'small' | 'medium' = 'small'): Promise<string[]> {
    const filesPromises = Array.from({ length }, async (_, i) => {
      const audioFilePrefix = sampleTypeMap[sampleFileType]

      const formattedNumber = (i + 1).toString().padStart(2, '0')
      const fileName = `${audioFilePrefix}${formattedNumber}.wav`
      const sourceFilePath = path.join(process.cwd(), './.data/audio', fileName)
      const tempFilePath = await FileHelper.copyToTempDir(sourceFilePath)
      return tempFilePath
    })

    return (await Promise.all(filesPromises)) as string[]
  }
}
