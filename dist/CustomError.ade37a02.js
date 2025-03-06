
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "CustomError", () => $dd5d48c41ddf3c9b$export$f7a70f5f17339408);
/** Custom Error class, with support extra information about the exception */ class $dd5d48c41ddf3c9b$export$f7a70f5f17339408 extends Error {
    error;
    extra;
    constructor(message, /** original error */ error, /** extra information about the exception, attached to this Error */ extra){
        super(message), this.error = error, this.extra = extra;
        this.name = 'CustomError';
    }
}


//# sourceMappingURL=CustomError.ade37a02.js.map
