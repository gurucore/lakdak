import crypto from "crypto";
export function testFunction(): number;
export class DevOpsHelper {
    static getCurrentServerIpAddresses(ipType?: string): string;
    static extractIpFromRequest(req: any): any;
}
export class SecurityHelper {
    static hash(input: crypto.BinaryLike, algorithm?: string): string;
    static generateRSAKeyPair(modulusLength?: number): {
        publicKey: string | Buffer;
        privateKey: string | Buffer;
    };
    static encryptText(publicKey: any, plainText: string): string;
    static decryptText(privateKey: any, encryptedTextBase64: string): string;
}
export class HttpProtocolHelper {
    static extractBearerToken(req: any): any;
}

//# sourceMappingURL=index.d.ts.map
