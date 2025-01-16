import crypto from "crypto";
export function testFunction(): number;
/**
 * Helper to inspect, check, analyse command send to chatbot
 */
export class DevOpsHelper {
    /**
     * Get current server IP address
     * @param ipType "v4" or "v6"
     * @returns
     */
    static getCurrentServerIpAddresses(ipType?: string): string;
    /**
     * Get IP from request (if behind proxy, use X-Forwarded-For header)
     * @param req
     * @returns
     */
    static extractIpFromRequest(req: any): any;
}
export class SecurityHelper {
    /**
     *
     * @param input
     * @param algorithm  "sha1" "sha256"
     * @returns hex string
     */
    static hash(input: crypto.BinaryLike, algorithm?: string): string;
    /**
     *
     * @param modulusLength effective key size 2048 bit (good until 2030), after 2030, use 3072 bit
     * @returns keypair: object of public and private
     */
    static generateRSAKeyPair(modulusLength?: number): {
        publicKey: string | Buffer;
        privateKey: string | Buffer;
    };
    /**
     * Encrypt using publicKey, the encrypted data is in the form of bytes, so we print it in base64 format
     * so that it's displayed in a more readable form
     * @param publicKey
     * @param plainText
     * @returns String base64 format
     */
    static encryptText(publicKey: any, plainText: string): string;
    /**
     * decrypt using privateKey. The decrypted data is of the Buffer type,
     * which we can convert to a string to reveal the original data
     * @param privateKey
     * @param encryptedTextBase64 String in base64 format
     * @returns utf-8 string
     */
    static decryptText(privateKey: any, encryptedTextBase64: string): string;
}
/** Helper to work with HTTP Protocol */
export class HttpProtocolHelper {
    /**
     * extract bearer token from request header
     * @param req
     * @returns
     */
    static extractBearerToken(req: any): any;
}

//# sourceMappingURL=index.d.ts.map
