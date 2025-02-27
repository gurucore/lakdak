import {DEBUG as $2f2ded2a5b986c68$export$3f32c2013f0dcc1e, UtilHelper as $2f2ded2a5b986c68$export$e616ecc10ddca3fa} from "./UtilHelper.cfb13df6.js";
import {RawNetworkHelper as $c37ead06c04bb665$export$4daadb33ccaded1} from "./RawNetworkHelper.da955a3c.js";
import $4Q4gs$os from "os";
import $4Q4gs$path from "path";
import {promises as $4Q4gs$promises, constants as $4Q4gs$constants, createWriteStream as $4Q4gs$createWriteStream} from "fs";






class $2067f62d46a56051$export$af3e19fefa989154 {
    /** use promise based access() API to check existence */ static async checkFileExist(filePath) {
        if (!filePath) return false;
        try {
            await (0, $4Q4gs$promises).access(filePath, (0, $4Q4gs$constants).F_OK);
            return true;
        } catch (err) {
            if (err.code === 'ENOENT') return false;
            else throw err // Re-throw the error if it's not a "file not found" error
            ;
        }
    }
    /** return the extension, include the dot (.) */ static getFileExtension(filePathOrURL) {
        if (!filePathOrURL) return '';
        return (0, $4Q4gs$path).extname(filePathOrURL);
    }
    /** copy files to OS temp dir  */ static async copyToTempDir(sourceFilePath) {
        if (!sourceFilePath) return;
        const tmpFileName = (0, $4Q4gs$path).basename(sourceFilePath);
        const tmpFilePath = (0, $4Q4gs$path).join((0, $4Q4gs$os).tmpdir(), tmpFileName);
        try {
            await (0, $4Q4gs$promises).copyFile(sourceFilePath, tmpFilePath);
            (0, $2f2ded2a5b986c68$export$3f32c2013f0dcc1e)(`File copied: ${sourceFilePath} => ${tmpFilePath}`);
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
        const tmpFileName = `${prefix}${(0, $2f2ded2a5b986c68$export$e616ecc10ddca3fa).createRandom()}${fileExtension}`;
        const tmpFilePath = (0, $4Q4gs$path).join((0, $4Q4gs$os).tmpdir(), tmpFileName);
        return tmpFilePath;
    }
    /** try to delete files */ static async unlinksSafe(paths) {
        const arr = paths.map(async (p)=>{
            if (await $2067f62d46a56051$export$af3e19fefa989154.checkFileExist(p)) await (0, $4Q4gs$promises).unlink(p);
        });
        return Promise.all(arr);
    }
    /**
   * download remote file into local temp dir
   * @param link
   * @returns local temp file path
   */ static async cacheRemoteUrl(link) {
        if (!link) throw new Error(`argument link:${link} is empty, neither URL nor localFile`);
        if ((0, $2f2ded2a5b986c68$export$e616ecc10ddca3fa).isLocalFilePath(link)) return link // already in local, no need to download
        ;
        if (!(0, $2f2ded2a5b986c68$export$e616ecc10ddca3fa).isURL(link)) throw new Error(`argument link:${link} is neither URL nor localFile`);
        const url = link;
        // https://vbee-studio-tmp.s3.ap-southeast-1.amazonaws.com/voice-cloning/voices/6765858815ba1ce0979a8b35/filename.wav ==> filename.wav
        const fileName = (0, $4Q4gs$path).basename(link) // = link.split('/').slice(-1)[0]
        ;
        const outputFilePath = $2067f62d46a56051$export$af3e19fefa989154.generateNewTempFilePath('temp-cached_', '_' + fileName);
        try {
            await (0, $c37ead06c04bb665$export$4daadb33ccaded1).download(url, outputFilePath);
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
            await (0, $4Q4gs$promises).writeFile(filePath, content);
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
            const writableStream = (0, $4Q4gs$createWriteStream)(filePath);
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


export {$2067f62d46a56051$export$af3e19fefa989154 as FileHelper};
//# sourceMappingURL=FileHelper.f65f65f4.js.map
