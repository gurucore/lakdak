var $hpNod$os = require("os");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "default", () => $24eda3839f56b77d$export$2e2bcd8739ae039);
/// <reference types="node" />

class $24eda3839f56b77d$export$2e2bcd8739ae039 {
    /**
   * Get current server IP address
   * @param ipType "v4" or "v6"
   * @returns
   */ static getCurrentServerIpAddresses(ipType = 'v4') {
        const networkInterfaces = Object.values((0, ($parcel$interopDefault($hpNod$os))).networkInterfaces()).reduce((r, a)=>{
            r = r.concat(a);
            return r;
        }, []).filter(({ family: family, address: address })=>{
            return family.toLowerCase().indexOf(ipType) >= 0 && address !== '127.0.0.1';
        }).map(({ address: address })=>address);
        const serverIpAddresses = networkInterfaces.join(', ');
        return serverIpAddresses;
    }
    /**
   * Get IP from request (if behind proxy, use X-Forwarded-For header)
   * @param req
   * @returns
   */ static extractIpFromRequest(req) {
        // TODO: should improve this func to whitelist the proxies
        // TODO: should use this library https://www.npmjs.com/package/request-ip
        return req?.socket?.remoteAddress || req?.headers['x-forwarded-for'];
    }
}


//# sourceMappingURL=DevOpsHelper.f768ca68.js.map
