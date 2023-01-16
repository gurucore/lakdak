/** Helper to work with HTTP Protocol */
export default class HttpProtocolHelper {
  /**
   * extract bearer token from request header
   * @param req
   * @returns
   */
  public static extractBearerToken(req) {
    const hash = req?.headers?.authorization?.replace("Bearer ", "")

    return hash
  }
}
