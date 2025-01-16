/** Helper to work with HTTP Protocol */ class $e0c455149e6d3832$export$2e2bcd8739ae039 {
    /**
   * extract bearer token from request header
   * @param req
   * @returns
   */ static extractBearerToken(req) {
        const hash = req?.headers?.authorization?.replace("Bearer ", "");
        return hash;
    }
}


export {$e0c455149e6d3832$export$2e2bcd8739ae039 as default};
//# sourceMappingURL=HttpProtocolHelper.5dd8a9a0.js.map
