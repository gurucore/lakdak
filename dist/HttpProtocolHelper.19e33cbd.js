/** Helper to work with HTTP Protocol */ class $36d75b1bf949342d$export$2e2bcd8739ae039 {
    /**
   * extract bearer token from request header
   * @param req
   * @returns
   */ static extractBearerToken(req) {
        const hash = req?.headers?.authorization?.replace("Bearer ", "");
        return hash;
    }
}


export {$36d75b1bf949342d$export$2e2bcd8739ae039 as default};
//# sourceMappingURL=HttpProtocolHelper.19e33cbd.js.map
