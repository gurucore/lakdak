/** Helper to work with HTTP Protocol */
export class HttpProtocolHelper {
  /**
   * extract bearer token from request header
   * @param req
   * @returns
   */
  public static extractBearerToken(req) {
    const hash = req?.headers?.authorization?.replace('Bearer ', '')

    return hash
  }

  /** get and normalize the ip (v4, v6) from headers */
  public static extractIpAddress(headers: Headers | Record<string, string>) {
    if (!headers) return null

    const ip: string =
      headers['cloudfront-viewer-address'] || // CloudFront
      headers['x-original-forwarded-for'] || // Nginx Ingress
      headers['x-forwarded-for'] ||
      // Cloud flare
      headers['True-Client-IP'] || // enterprise Cloudflare user
      headers['CF-Connecting-IP'] ||
      headers['Cf-Connecting-IPv6'] || // IPv6 version
      //
      headers['x-real-ip']

    if (!ip) return

    // Example: 1.2.3.4 or 1.2.3.4:8080
    const isIPv4 = ip.includes('.')
    if (isIPv4) return ip.split(':')[0]

    // Example: [2406:da18:d9c:5d00:cde7:2cba:aef2:49c9]:46568
    const isIPv6WithPort = ip.includes(']:')
    if (isIPv6WithPort) return ip.split(']:')[0].slice(1)

    // Example: 2406:da18:d9c:5d00:cde7:2cba:aef2:49c9:46568
    const colonCount = ip.match(/:/g).length
    if (colonCount === 8) {
      const lastColonIndex = ip.lastIndexOf(':')
      return ip.slice(0, lastColonIndex)
    }

    // There are stills some ipv6 cases that are not handled
    // (1) Compressing consecutive zero blocks: 2001:db8:85a3::8a2e:370:7334
    // (2) IPv6 Address with Port: [2001:db8:85a3::8a2e:370:7334]:443
    // (3) Loopback Address: ::1
    // (4) Link-local Address: fe80::1ff:fe23:4567:890a
    // And many more...

    return ip
  }

  /** decorate the request with extra info (ip, physical location) of browser/client */
  public static extractClientInfo(headers: Headers | Record<string, string>) {
    const clientInfo = {
      publicIP: HttpProtocolHelper.extractIpAddress(headers),

      country:
        headers['cloudfront-viewer-country'] || // cloudfront
        headers['CF-IPCountry'] ||
        '', // cloudflare
      countryName: headers['cloudfront-viewer-country-name'] || '',
      region: headers['cloudfront-viewer-country-region'] || '',
      regionName: headers['cloudfront-viewer-region-name'] || '',
      city: headers['cloudfront-viewer-city'] || ''
    }

    return clientInfo
  }

  public static isValidUrl(str: string) {
    let url: URL
    try {
      url = new URL(str)
    } catch (_) {
      return false
    }
    return url.protocol === 'http:' || url.protocol === 'https:'
  }
}
