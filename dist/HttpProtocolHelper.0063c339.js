
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "default", () => $69395aa0788d586f$export$2e2bcd8739ae039);
/** Helper to work with HTTP Protocol */ class $69395aa0788d586f$export$2e2bcd8739ae039 {
    /**
   * extract bearer token from request header
   * @param req
   * @returns
   */ static extractBearerToken(req) {
        const hash = req?.headers?.authorization?.replace("Bearer ", "");
        return hash;
    }
}


//# sourceMappingURL=HttpProtocolHelper.0063c339.js.map
