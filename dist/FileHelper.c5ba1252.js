var $d45e804977bc8ba0$exports = require("./CLIHelper.2a7c8d40.js");
var $1f6d16a92569a9c9$exports = require("./UtilHelper.9c8080a7.js");
var $bb2fd2799a25985b$exports = require("./NetworkHelper.40cbfae3.js");
var $72Ush$os = require("os");
var $72Ush$path = require("path");
var $72Ush$fs = require("fs");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "FileHelper", () => $d06b3bef2a4bf440$export$af3e19fefa989154);






class $d06b3bef2a4bf440$export$af3e19fefa989154 {
    static async checkFileExist(filePath) {
        if (!filePath) return false;
        try {
            await (0, $72Ush$fs.promises).access(filePath, (0, $72Ush$fs.constants).F_OK);
            return true;
        } catch (err) {
            if (err.code === 'ENOENT') return false;
            else throw err // Re-throw the error if it's not a "file not found" error
            ;
        }
    }
    /** return the extension, include the dot (.) */ static getFileExtension(filePathOrURL) {
        if (!filePathOrURL) return '';
        return (0, ($parcel$interopDefault($72Ush$path))).extname(filePathOrURL);
    }
    /** copy files to OS temp dir  */ static async copyToTempDir(sourceFilePath) {
        if (!sourceFilePath) return;
        const tmpFileName = (0, ($parcel$interopDefault($72Ush$path))).basename(sourceFilePath);
        const tmpFilePath = (0, ($parcel$interopDefault($72Ush$path))).join((0, ($parcel$interopDefault($72Ush$os))).tmpdir(), tmpFileName);
        try {
            await (0, $72Ush$fs.promises).copyFile(sourceFilePath, tmpFilePath);
            // DEBUG(`File copied: ${sourceFilePath} => ${tmpFilePath}`)
            return tmpFilePath;
        } catch (err) {
            console.error(`Error copying file: ${err}`);
            throw err;
        }
    }
    static async clearTempDir() {
        console.log('Clearing /tmp dir ...');
        await (0, $d45e804977bc8ba0$exports.CLIHelper).exec('rm', [
            '-rf',
            (0, ($parcel$interopDefault($72Ush$os))).tmpdir() + '/*'
        ], 'os.clearTempDir', {
            cwd: (0, ($parcel$interopDefault($72Ush$os))).tmpdir()
        });
    }
    /**
   * Generate a temp filePath in side temp dir (but it is just the file path, no file content existed)
   * @param prefix prepend to the fileName
   * @param fileExtension extension must be with the dot (.), append to the result fileName
   * @returns
   */ static generateNewTempFilePath(prefix = '', fileExtension = '') {
        const tmpFileName = `${prefix}${(0, $1f6d16a92569a9c9$exports.UtilHelper).createRandom()}${fileExtension}`;
        const tmpFilePath = (0, ($parcel$interopDefault($72Ush$path))).join((0, ($parcel$interopDefault($72Ush$os))).tmpdir(), tmpFileName);
        return tmpFilePath;
    }
    /** try to delete files */ static async unlinksSafe(paths) {
        const arr = paths.map(async (p)=>{
            if (await $d06b3bef2a4bf440$export$af3e19fefa989154.checkFileExist(p)) await (0, $72Ush$fs.promises).unlink(p);
        });
        return Promise.all(arr);
    }
    /**
   * download remote file into local temp dir
   * @param link
   * @returns local temp file path
   */ static async cacheRemoteUrl(link) {
        if (!link) throw new Error(`${link} is empty, neither URL nor localFile`);
        if ((0, $1f6d16a92569a9c9$exports.UtilHelper).isLocalFilePath(link)) return link // already in local, no need to download
        ;
        if (!(0, $1f6d16a92569a9c9$exports.UtilHelper).isURL(link)) throw new Error(`${link} is neither URL nor localFile`);
        const url = link;
        // https://vbee-studio-tmp.s3.ap-southeast-1.amazonaws.com/voice-cloning/voices/6765858815ba1ce0979a8b35/filename.wav ==> filename.wav
        const fileName = (0, ($parcel$interopDefault($72Ush$path))).basename(link) // = link.split('/').slice(-1)[0]
        ;
        const outputFilePath = $d06b3bef2a4bf440$export$af3e19fefa989154.generateNewTempFilePath('temp-cached_', '_' + fileName);
        try {
            await (0, $bb2fd2799a25985b$exports.RawNetworkHelper).download(url, outputFilePath);
        } catch (err) {
            console.error('Error: 404 not Found: ', url, err.code);
        }
        return outputFilePath;
    }
}


//# sourceMappingURL=FileHelper.c5ba1252.js.map
