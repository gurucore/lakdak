/** Custom Error class, with support extra information about the exception */ class $3daa0d994a161828$export$f7a70f5f17339408 extends Error {
    error;
    extra;
    constructor(message, /** original error */ error, /** extra information about the exception, attached to this Error */ extra){
        super(message), this.error = error, this.extra = extra;
        this.name = 'CustomError';
    }
}


export {$3daa0d994a161828$export$f7a70f5f17339408 as CustomError};
//# sourceMappingURL=CustomError.5ce5bc73.js.map
