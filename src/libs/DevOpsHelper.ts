import os from 'os'

/**
 * Helper to  inspect, check, analyse command send to chatbot
 */
export default class DevOpsHelper {
  /**
   * Get current server IP address
   * @param ipType "v4" or "v6"
   * @returns
   */
  static getCurrentServerIpAddresses(ipType = 'v4'): string {
    const networkInterfaces = Object.values(os.networkInterfaces())
      .reduce((r, a) => {
        r = r.concat(a)
        return r
      }, [])
      .filter(({ family, address }) => {
        return family.toLowerCase().indexOf(ipType) >= 0 && address !== '127.0.0.1'
      })
      .map(({ address }) => address)
    const serverIpAddresses = networkInterfaces.join(', ')
    return serverIpAddresses
  }

  /**
   * Get IP from request (if behind proxy, use X-Forwarded-For header)
   * @param req
   * @returns
   */
  public static extractIpFromRequest(req) {
    // TODO: should improve this func to whitelist the proxies
    // TODO: should use this library https://www.npmjs.com/package/request-ip
    return req?.socket?.remoteAddress || req?.headers['x-forwarded-for']
  }
}
