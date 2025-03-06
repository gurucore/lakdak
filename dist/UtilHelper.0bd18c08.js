import $49zDQ$path from "path";
import {nanoid as $49zDQ$nanoid} from "nanoid";



function $0cc62a8604e6e0a9$export$3f32c2013f0dcc1e(...args) {
    if (process.env.NODE_ENV !== 'production') console.debug("\x1b[36m\uD83D\uDC1E ------ \x1b[0m", ...args);
}
class $0cc62a8604e6e0a9$export$e616ecc10ddca3fa {
    static createRandom() {
        return `${new Date().toISOString().substring(0, 10)}_${(0, $49zDQ$nanoid)()}`;
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
        if ((0, $49zDQ$path).isAbsolute(str) || str.startsWith('./') || str.startsWith('../')) return true;
        return false;
    }
}


export {$0cc62a8604e6e0a9$export$3f32c2013f0dcc1e as DEBUG, $0cc62a8604e6e0a9$export$e616ecc10ddca3fa as UtilHelper};
//# sourceMappingURL=UtilHelper.0bd18c08.js.map
