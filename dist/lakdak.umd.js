var $bbNEX$os = require("os");
var $bbNEX$crypto = require("crypto");

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

$parcel$export(module.exports, "testFunction", () => $71713b189d753220$export$e2e77b41cb4e1f9e);
$parcel$export(module.exports, "DevOpsHelper", () => $441290d673c9fdae$export$2e2bcd8739ae039);
$parcel$export(module.exports, "SecurityHelper", () => $3b4d8d87d35b724a$export$2e2bcd8739ae039);
function $71713b189d753220$export$e2e77b41cb4e1f9e() {
    return 1;
}


/// <reference types="node" />

class $441290d673c9fdae$export$2e2bcd8739ae039 {
    /**
   * Get current server IP address
   * @param ipType "v4" or "v6"
   * @returns
   */ static getCurrentServerIpAddresses(ipType = "v4") {
        const networkInterfaces = Object.values((0, ($parcel$interopDefault($bbNEX$os))).networkInterfaces()).reduce((r, a)=>{
            r = r.concat(a);
            return r;
        }, []).filter(({ family: family , address: address  })=>{
            return family.toLowerCase().indexOf(ipType) >= 0 && address !== "127.0.0.1";
        }).map(({ address: address  })=>address);
        const serverIpAddresses = networkInterfaces.join(", ");
        return serverIpAddresses;
    }
    /**
   * Get IP from request (if behind proxy, use X-Forwarded-For header)
   * @param req
   * @returns
   */ static extractIpFromRequest(req) {
        // TODO: should improve this func to whitelist the proxies
        // TODO: should use this library https://www.npmjs.com/package/request-ip
        return req?.socket?.remoteAddress || req?.headers["x-forwarded-for"];
    }
}


/// <reference types="node" />

class $3b4d8d87d35b724a$export$2e2bcd8739ae039 {
    /**
   *
   * @param input
   * @param algorithm  "sha1" "sha256"
   * @returns hex string
   */ static hash(input, algorithm = "sha256") {
        if (!input) return;
        return (0, ($parcel$interopDefault($bbNEX$crypto))).createHash(algorithm).update(input).digest("hex");
    }
    /**
   *
   * @param modulusLength effective key size 2048 bit (good until 2030), after 2030, use 3072 bit
   * @returns keypair: object of public and private
   */ static generateRSAKeyPair(modulusLength = 2048) {
        const { publicKey: publicKey , privateKey: privateKey  } = (0, ($parcel$interopDefault($bbNEX$crypto))).generateKeyPairSync("rsa", {
            modulusLength: modulusLength,
            publicKeyEncoding: {
                type: "spki",
                format: "pem"
            },
            privateKeyEncoding: {
                type: "pkcs8",
                format: "pem"
            }
        });
        return {
            publicKey: publicKey,
            privateKey: privateKey
        };
    }
    /**
   * Encrypt using publicKey, the encrypted data is in the form of bytes, so we print it in base64 format
   * so that it's displayed in a more readable form
   * @param publicKey
   * @param plainText
   * @returns String base64 format
   */ static encryptText(publicKey, plainText) {
        const encryptedData = (0, ($parcel$interopDefault($bbNEX$crypto))).publicEncrypt({
            key: publicKey,
            padding: (0, ($parcel$interopDefault($bbNEX$crypto))).constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256"
        }, Buffer.from(plainText));
        return encryptedData.toString("base64");
    }
    /**
   * decrypt using privateKey. The decrypted data is of the Buffer type,
   * which we can convert to a string to reveal the original data
   * @param privateKey
   * @param encryptedTextBase64 String in base64 format
   * @returns utf-8 string
   */ static decryptText(privateKey, encryptedTextBase64) {
        const decryptedData = (0, ($parcel$interopDefault($bbNEX$crypto))).privateDecrypt({
            key: privateKey,
            // In order to decrypt the data, we need to specify the
            // same hashing function and padding scheme that we used to
            // encrypt the data in the previous step
            padding: (0, ($parcel$interopDefault($bbNEX$crypto))).constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256"
        }, Buffer.from(encryptedTextBase64, "base64"));
        return decryptedData.toString("utf8");
    }
}




//# sourceMappingURL=lakdak.umd.js.map
