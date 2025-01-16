
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "CustomError", () => $f6b600db55700cdd$export$f7a70f5f17339408);
class $f6b600db55700cdd$export$f7a70f5f17339408 extends Error {
    error;
    extra;
    constructor(message, error, extra){
        super(message), this.error = error, this.extra = extra;
        this.name = 'CustomError';
    }
}


//# sourceMappingURL=CustomError.1083a31e.js.map
