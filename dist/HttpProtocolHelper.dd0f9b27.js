
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "default", () => $133c6b1a22b5327c$export$2e2bcd8739ae039);
/** Helper to work with HTTP Protocol */ class $133c6b1a22b5327c$export$2e2bcd8739ae039 {
    /**
   * extract bearer token from request header
   * @param req
   * @returns
   */ static extractBearerToken(req) {
        const hash = req?.headers?.authorization?.replace("Bearer ", "");
        return hash;
    }
}


//# sourceMappingURL=HttpProtocolHelper.dd0f9b27.js.map
