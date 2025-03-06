import $5WFuR$os from "os";

/// <reference types="node" />

class $8a2cad5664b9ffc9$export$2e2bcd8739ae039 {
    /**
   * Get current server IP address
   * @param ipType "v4" or "v6"
   * @returns
   */ static getCurrentServerIpAddresses(ipType = 'v4') {
        const networkInterfaces = Object.values((0, $5WFuR$os).networkInterfaces()).reduce((r, a)=>{
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


export {$8a2cad5664b9ffc9$export$2e2bcd8739ae039 as default};
//# sourceMappingURL=DevOpsHelper.8414e9f2.js.map
