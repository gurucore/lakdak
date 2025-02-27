var $1f6d16a92569a9c9$exports = require("./UtilHelper.c21f1cb5.js");
var $2036d0ecb554b269$exports = require("./RawNetworkHelper.761de896.js");
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
    /** use promise based access() API to check existence */ static async checkFileExist(filePath) {
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
            (0, $1f6d16a92569a9c9$exports.DEBUG)(`File copied: ${sourceFilePath} => ${tmpFilePath}`);
            return tmpFilePath;
        } catch (err) {
            console.error(`Error copying file: ${err}`);
            throw err;
        }
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
        if (!link) throw new Error(`argument link:${link} is empty, neither URL nor localFile`);
        if ((0, $1f6d16a92569a9c9$exports.UtilHelper).isLocalFilePath(link)) return link // already in local, no need to download
        ;
        if (!(0, $1f6d16a92569a9c9$exports.UtilHelper).isURL(link)) throw new Error(`argument link:${link} is neither URL nor localFile`);
        const url = link;
        // https://vbee-studio-tmp.s3.ap-southeast-1.amazonaws.com/voice-cloning/voices/6765858815ba1ce0979a8b35/filename.wav ==> filename.wav
        const fileName = (0, ($parcel$interopDefault($72Ush$path))).basename(link) // = link.split('/').slice(-1)[0]
        ;
        const outputFilePath = $d06b3bef2a4bf440$export$af3e19fefa989154.generateNewTempFilePath('temp-cached_', '_' + fileName);
        try {
            await (0, $2036d0ecb554b269$exports.RawNetworkHelper).download(url, outputFilePath);
        } catch (err) {
            console.error('Error: 404 not Found: ', url, err.code);
        }
        return outputFilePath;
    }
    /**
   * write content to file
   * @param content
   * @param filePath
   * @returns written filePath, or undefined if error
   */ static async writeDataToFile(content, filePath) {
        if (!filePath) return;
        if (!content) return;
        try {
            await (0, $72Ush$fs.promises).writeFile(filePath, content);
            return filePath;
        } catch (err) {
            console.error(`Failed to save content to file ${filePath}`, {
                filePath: filePath,
                error: err
            });
        }
    }
    /**
   * pipe stream to file
   * @param readableStream
   * @param filePath
   * @returns written filePath, throw if error
   */ static async writeStreamToFile(readableStream, filePath) {
        if (!filePath) return;
        if (!readableStream) return;
        return new Promise((resolve, reject)=>{
            const writableStream = (0, $72Ush$fs.createWriteStream)(filePath);
            readableStream.on('error', (err)=>{
                reject(err);
            });
            writableStream.on('error', (err)=>{
                reject(err);
            });
            writableStream.on('finish', ()=>{
                resolve(filePath);
            });
            readableStream.pipe(writableStream);
        });
    }
}


//# sourceMappingURL=FileHelper.5934dc86.js.map
