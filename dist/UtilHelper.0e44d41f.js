var $2YcEe$path = require("path");
var $2YcEe$nanoid = require("nanoid");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "DEBUG", () => $834034c963019366$export$3f32c2013f0dcc1e);
$parcel$export(module.exports, "UtilHelper", () => $834034c963019366$export$e616ecc10ddca3fa);


function $834034c963019366$export$3f32c2013f0dcc1e(...args) {
    if (process.env.NODE_ENV !== 'production') console.debug("\x1b[36m\uD83D\uDC1E ------ \x1b[0m", ...args);
}
class $834034c963019366$export$e616ecc10ddca3fa {
    static createRandom() {
        return `${new Date().toISOString().substring(0, 10)}_${(0, $2YcEe$nanoid.nanoid)()}`;
    }
    /** convert true false to yes/no or icon of yes/no */ static boolToYesNo(b, withText = false) {
        const text = b ? 'yes' : 'no ';
        const icon = b ? "\u2705" : "\uD83D\uDEAB";
        return icon + (withText ? text : '');
    }
    /**
   * Checks if a string is a valid URL.
   * @param str The string to check.
   */ static isURL(str) {
        try {
            new URL(str);
            return true;
        } catch (error) {
            return false;
        }
    }
    /**
   * Checks if a string is a valid file path. Just file name like "file" or "file.txt" is false. "c:/file" is true
   * @param str The string to check.
   */ static isLocalFilePath(str) {
        if (!str) throw Error('argument "str" is empty');
        // Check if it's an absolute path or relative path
        if ((0, ($parcel$interopDefault($2YcEe$path))).isAbsolute(str) || str.startsWith('./') || str.startsWith('../')) return true;
        return false;
    }
}


//# sourceMappingURL=UtilHelper.0e44d41f.js.map
