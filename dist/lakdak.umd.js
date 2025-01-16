var $hT1bR$os = require("os");
var $hT1bR$crypto = require("crypto");
var $hT1bR$child_process = require("child_process");
var $hT1bR$util = require("util");
var $hT1bR$path = require("path");
var $hT1bR$fs = require("fs");
var $hT1bR$nanoid = require("nanoid");
var $hT1bR$http = require("http");
var $hT1bR$https = require("https");
var $hT1bR$url = require("url");

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

$parcel$export(module.exports, "DevOpsHelper", () => $24eda3839f56b77d$export$2e2bcd8739ae039);
$parcel$export(module.exports, "SecurityHelper", () => $3bb31363fa170543$export$2e2bcd8739ae039);
$parcel$export(module.exports, "HttpProtocolHelper", () => $133c6b1a22b5327c$export$2e2bcd8739ae039);
$parcel$export(module.exports, "CLIHelper", () => $d45e804977bc8ba0$export$73e2f76829f803fa);
$parcel$export(module.exports, "FileHelper", () => $d06b3bef2a4bf440$export$af3e19fefa989154);
$parcel$export(module.exports, "RawNetworkHelper", () => $bb2fd2799a25985b$export$4daadb33ccaded1);
$parcel$export(module.exports, "UtilHelper", () => $1f6d16a92569a9c9$export$e616ecc10ddca3fa);
/// <reference types="node" />

class $24eda3839f56b77d$export$2e2bcd8739ae039 {
    /**
   * Get current server IP address
   * @param ipType "v4" or "v6"
   * @returns
   */ static getCurrentServerIpAddresses(ipType = "v4") {
        const networkInterfaces = Object.values((0, ($parcel$interopDefault($hT1bR$os))).networkInterfaces()).reduce((r, a)=>{
            r = r.concat(a);
            return r;
        }, []).filter(({ family: family , address: address  })=>{
            return family.toLowerCase().indexOf(ipType) >= 0 && address !== "127.0.0.1";
        }).map(({ address: address  })=>address);
        const serverIpAddresses = networkInterfaces.join(", ");
        return serverIpAddresses;
    }
    /**
   * Get IP from request (if behind proxy, use X-Forwarded-For header)
   * @param req
   * @returns
   */ static extractIpFromRequest(req) {
        // TODO: should improve this func to whitelist the proxies
        // TODO: should use this library https://www.npmjs.com/package/request-ip
        return req?.socket?.remoteAddress || req?.headers["x-forwarded-for"];
    }
}


/// <reference types="node" />

class $3bb31363fa170543$export$2e2bcd8739ae039 {
    /**
   *
   * @param input
   * @param algorithm  "sha1" "sha256"
   * @returns hex string
   */ static hash(input, algorithm = "sha256") {
        if (!input) return;
        return (0, ($parcel$interopDefault($hT1bR$crypto))).createHash(algorithm).update(input).digest("hex");
    }
    /**
   *
   * @param modulusLength effective key size 2048 bit (good until 2030), after 2030, use 3072 bit
   * @returns keypair: object of public and private
   */ static generateRSAKeyPair(modulusLength = 2048) {
        const { publicKey: publicKey , privateKey: privateKey  } = (0, ($parcel$interopDefault($hT1bR$crypto))).generateKeyPairSync("rsa", {
            modulusLength: modulusLength,
            publicKeyEncoding: {
                type: "spki",
                format: "pem"
            },
            privateKeyEncoding: {
                type: "pkcs8",
                format: "pem"
            }
        });
        return {
            publicKey: publicKey,
            privateKey: privateKey
        };
    }
    /**
   * Encrypt using publicKey, the encrypted data is in the form of bytes, so we print it in base64 format
   * so that it's displayed in a more readable form
   * @param publicKey
   * @param plainText
   * @returns String base64 format
   */ static encryptText(publicKey, plainText) {
        const encryptedData = (0, ($parcel$interopDefault($hT1bR$crypto))).publicEncrypt({
            key: publicKey,
            padding: (0, ($parcel$interopDefault($hT1bR$crypto))).constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256"
        }, Buffer.from(plainText));
        return encryptedData.toString("base64");
    }
    /**
   * decrypt using privateKey. The decrypted data is of the Buffer type,
   * which we can convert to a string to reveal the original data
   * @param privateKey
   * @param encryptedTextBase64 String in base64 format
   * @returns utf-8 string
   */ static decryptText(privateKey, encryptedTextBase64) {
        const decryptedData = (0, ($parcel$interopDefault($hT1bR$crypto))).privateDecrypt({
            key: privateKey,
            // In order to decrypt the data, we need to specify the
            // same hashing function and padding scheme that we used to
            // encrypt the data in the previous step
            padding: (0, ($parcel$interopDefault($hT1bR$crypto))).constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256"
        }, Buffer.from(encryptedTextBase64, "base64"));
        return decryptedData.toString("utf8");
    }
}


/** Helper to work with HTTP Protocol */ class $133c6b1a22b5327c$export$2e2bcd8739ae039 {
    /**
   * extract bearer token from request header
   * @param req
   * @returns
   */ static extractBearerToken(req) {
        const hash = req?.headers?.authorization?.replace("Bearer ", "");
        return hash;
    }
}




const $d45e804977bc8ba0$var$execAsync = (0, $hT1bR$util.promisify)((0, $hT1bR$child_process.exec));
class $d45e804977bc8ba0$export$73e2f76829f803fa {
    /** undefined will be ""
   * Returns empty arguments as '""'
Leaves simple arguments without spaces/special chars unchanged
For complex arguments:
Escapes any existing double quotes
Wraps the argument in double quotes

It's not as comprehensive as "npm:shell-quote" but handles most common cases safely and is much lighter. */ static escapeArg(arg) {
        if (arg === undefined) return "";
        if (arg === null) return "";
        // Handle empty strings
        if (!arg) return '""';
        // If argument has no special chars, return as is
        if (/^[a-zA-Z0-9_\/:=-]+$/.test(arg)) return arg;
        // Escape double quotes and wrap the entire argument in double quotes
        return `"${arg.replace(/"/g, '\\"')}"`;
    }
    /**
   * Executes a shell command and returns its output (keep the output in memory and return all at once)
   * @example await runCommand('echo', ['hello world', 'file name.txt'])
   * @param command - The command to execute
   * @param options - Node.js exec options (optional)
   * @param hint - descriptive hint to know what command we're excuting (e.g.: we execute a complex and long ffmpeg command, put a hint here to describle it)
   * @returns Promise resolving to process output details
   * @throws Error if process fails
   */ static async exec(command, args = [], hint, options = {}, bashCommandExtra = "") {
        const { throwOnError: throwOnError = true , silent: silent = false , // uncomment to auto use process.env and cwd
        // env = process.env, cwd = process.cwd(),
        ...execOptions } = options;
        // Properly escape all arguments (for security)
        const fullCommand = `${command} ${args.map($d45e804977bc8ba0$export$73e2f76829f803fa.escapeArg).join(" ")} ${bashCommandExtra}`;
        if (!silent) console.log(`Executing (${hint ? hint : ""}): ${fullCommand}`);
        try {
            const { stdout: stdout , stderr: stderr  } = await $d45e804977bc8ba0$var$execAsync(fullCommand, options);
            return {
                output: stdout.trim(),
                error: stderr.trim(),
                hint: hint
            };
        } catch (error) {
            throw new Error(`Exec CLI command failed: ${error.message}`);
        }
    }
    /**
   * Spawns a child process and returns a promise that resolves with its output
   * @param command - The command to execute
   * @param args - Array of arguments to pass to the command
   * @param options - Configuration options for process spawning
   * @param hint - descriptive hint to know what command we're excuting (e.g.: we execute a complex and long ffmpeg command, put a hint here to describle it)
   * @returns Promise resolving to process output details
   * @throws Error if process fails
   */ static async spawn(command, args = [], hint, options = {}) {
        const { throwOnError: throwOnError = true , silent: silent = false , // uncomment to auto use process.env and cwd
        // env = process.env, cwd = process.cwd(),
        ...spawnOptions } = options;
        if (!silent) console.log(`Executing (${hint ? hint : ""}): ${command} ${args.join(" ")}`);
        const childProc = (0, $hT1bR$child_process.spawn)(command, args, {
            // env,
            // cwd,
            ...spawnOptions
        });
        const stdoutBuffers = [];
        const stderrBuffers = [];
        childProc.stdout?.on("data", (buffer)=>{
            if (!silent) process.stdout.write(buffer);
            stdoutBuffers.push(buffer);
        });
        childProc.stderr?.on("data", (buffer)=>{
            if (!silent) process.stderr.write(buffer);
            stderrBuffers.push(buffer);
        });
        return new Promise((resolve, reject)=>{
            childProc.on("close", (code)=>{
                const output = Buffer.concat(stdoutBuffers).toString().trim();
                const error = Buffer.concat(stderrBuffers).toString().trim();
                if (code !== 0 && throwOnError) {
                    const error1 = new Error(`Process failed with exit code ${code}`);
                    Object.assign(error1, {
                        stdout: output,
                        stderr: error1,
                        code: code,
                        hint: hint
                    });
                    reject(error1);
                } else resolve({
                    output: output,
                    error: error,
                    code: code,
                    hint: hint
                });
            });
            childProc.on("error", reject);
        });
    }
    /**
   * @deprecated This method is kept for backward compatible if there is a problem with new implementation.
   */ static async spawnOld(command, args = [], options = {}) {
        console.log(`Executing: ${command} ${args.join(" ")}`);
        const childProc = (0, $hT1bR$child_process.spawn)(command, args, {
            env: options.env || process.env,
            cwd: options.cwd || process.cwd(),
            ...options
        });
        const resultBuffers = [];
        childProc.stdout.on("data", (buffer)=>{
            console.log(buffer.toString());
            resultBuffers.push(buffer);
        });
        childProc.stderr.on("data", (buffer)=>{
            console.error(buffer.toString());
        });
        return new Promise((resolve, reject)=>{
            childProc.on("close", (code)=>{
                if (code === 0) resolve(Buffer.concat(resultBuffers).toString().trim());
                else reject(new Error(`${command} failed with exit code ${code}`));
            });
            childProc.on("error", (err)=>{
                reject(err);
            });
        });
    }
}








function $1f6d16a92569a9c9$export$3f32c2013f0dcc1e(...args) {
    if (process.env.NODE_ENV !== "production") console.debug("\x1b[36m\uD83D\uDC1E ------ \x1b[0m", ...args);
}
class $1f6d16a92569a9c9$export$e616ecc10ddca3fa {
    static createRandom() {
        return `${new Date().toISOString().substring(0, 10)}_${(0, $hT1bR$nanoid.nanoid)()}`;
    }
    /** convert true false to yes/no or icon of yes/no */ static boolToYesNo(b, withText = false) {
        const text = b ? "yes" : "no ";
        const icon = b ? "✅" : "\uD83D\uDEAB";
        return icon + (withText ? text : "");
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
        if (!str) throw Error("str is empty");
        // Check if it's an absolute path or relative path
        if ((0, ($parcel$interopDefault($hT1bR$path))).isAbsolute(str) || str.startsWith("./") || str.startsWith("../")) return true;
        return false;
    }
}






class $f6b600db55700cdd$export$f7a70f5f17339408 extends Error {
    constructor(message, error, extra){
        super(message);
        this.error = error;
        this.extra = extra;
        this.name = "CustomError";
    }
}


class $bb2fd2799a25985b$export$946d4ce585efed41 extends (0, $f6b600db55700cdd$export$f7a70f5f17339408) {
    constructor(message, error, statusCode, url, extra){
        super(message, error, extra);
        this.statusCode = statusCode;
        this.url = url;
        this.name = "DownloadError";
    }
}
class $bb2fd2799a25985b$export$4daadb33ccaded1 {
    /**
   * This is stream download using raw http/https API
   * Real-world performance example for a 1GB file:

Stream implementation: ~100MB memory usage
fetch()/axios: ~1.1GB memory usage (entire file + overhead)

However, there are cases where fetch() or axios might be preferred:

If you need to process the file in memory anyway
For very small files where the overhead doesn't matter
When you need the additional features these libraries provide (like automatic retries, request interception, etc.)
   */ static async download(urlString, filePath, options = {}) {
        // Validate and parse URL
        let url;
        try {
            url = new (0, $hT1bR$url.URL)(urlString);
        } catch (err) {
            throw new $bb2fd2799a25985b$export$946d4ce585efed41(`Invalid URL: ${urlString}`, err, undefined, urlString);
        }
        // Validate protocol
        if (url.protocol !== "http:" && url.protocol !== "https:") throw new $bb2fd2799a25985b$export$946d4ce585efed41(`Unsupported protocol: ${url.protocol}`);
        // Ensure directory exists
        // const directory = path.dirname(filePath)
        // await fs.promises.mkdir(directory, { recursive: true })
        const { timeout: timeout = 30000 , headers: headers = {}  } = options;
        return new Promise((resolve, reject)=>{
            const fileStream = (0, ($parcel$interopDefault($hT1bR$fs))).createWriteStream(filePath);
            let fileInfo = {
                mime: "",
                size: 0,
                filePath: filePath
            };
            const protocol = url.protocol === "https:" ? (0, ($parcel$interopDefault($hT1bR$https))) : (0, ($parcel$interopDefault($hT1bR$http)));
            const request = protocol.get(url, {
                timeout: timeout,
                headers: headers
            }, (response)=>{
                // // Handle redirects
                // if (response.statusCode === 301 || response.statusCode === 302) {
                //   const redirectUrl = response.headers.location
                //   if (!redirectUrl) {
                //     reject(new DownloadError('Redirect location not provided', response.statusCode, urlString))
                //     return
                //   }
                //   FileDownloader.download(redirectUrl, filePath, options).then(resolve).catch(reject)
                //   return
                // }
                // Handle error status codes
                if (response.statusCode !== 200) {
                    reject(new $bb2fd2799a25985b$export$946d4ce585efed41(`Raw download file error. ${response.statusCode}`, //
                    undefined, response.statusCode, urlString));
                    return;
                }
                // Set file info
                fileInfo = {
                    mime: response.headers["content-type"] || "",
                    size: parseInt(response.headers["content-length"] || "0", 10),
                    filePath: filePath
                };
                response.pipe(fileStream);
            });
            request.on("error", (err)=>{
                fileStream.destroy();
                // TODO: use FileHelper to delete files
                (0, ($parcel$interopDefault($hT1bR$fs))).unlink(filePath, ()=>{
                    reject(new $bb2fd2799a25985b$export$946d4ce585efed41(`Network error: ${err.message}`, err, undefined, urlString));
                });
            });
            request.on("timeout", ()=>{
                request.destroy();
                fileStream.destroy();
                (0, ($parcel$interopDefault($hT1bR$fs))).unlink(filePath, ()=>{
                    reject(new $bb2fd2799a25985b$export$946d4ce585efed41(`Download timed out after ${timeout}ms`, undefined, undefined, urlString));
                });
            });
            // Handle successful download
            fileStream.on("finish", ()=>{
                fileStream.close(()=>resolve(fileInfo));
            });
            // Handle file system errors
            fileStream.on("error", (err)=>{
                fileStream.destroy();
                (0, ($parcel$interopDefault($hT1bR$fs))).unlink(filePath, ()=>{
                    reject(new $bb2fd2799a25985b$export$946d4ce585efed41(`File system error: ${err.message}`, err, undefined, urlString));
                });
            });
        });
    }
}


class $d06b3bef2a4bf440$export$af3e19fefa989154 {
    static async checkFileExist(filePath) {
        if (!filePath) return false;
        try {
            await (0, $hT1bR$fs.promises).access(filePath, (0, $hT1bR$fs.constants).F_OK);
            return true;
        } catch (err) {
            if (err.code === "ENOENT") return false;
            else throw err // Re-throw the error if it's not a "file not found" error
            ;
        }
    }
    /** return the extension, include the dot (.) */ static getFileExtension(filePathOrURL) {
        if (!filePathOrURL) return "";
        return (0, ($parcel$interopDefault($hT1bR$path))).extname(filePathOrURL);
    }
    /** copy files to OS temp dir  */ static async copyToTempDir(sourceFilePath) {
        if (!sourceFilePath) return;
        const tmpFileName = (0, ($parcel$interopDefault($hT1bR$path))).basename(sourceFilePath);
        const tmpFilePath = (0, ($parcel$interopDefault($hT1bR$path))).join((0, ($parcel$interopDefault($hT1bR$os))).tmpdir(), tmpFileName);
        try {
            await (0, $hT1bR$fs.promises).copyFile(sourceFilePath, tmpFilePath);
            // DEBUG(`File copied: ${sourceFilePath} => ${tmpFilePath}`)
            return tmpFilePath;
        } catch (err) {
            console.error(`Error copying file: ${err}`);
            throw err;
        }
    }
    static async clearTempDir() {
        console.log("Clearing /tmp dir ...");
        await (0, $d45e804977bc8ba0$export$73e2f76829f803fa).exec("rm", [
            "-rf",
            (0, ($parcel$interopDefault($hT1bR$os))).tmpdir() + "/*"
        ], "os.clearTempDir", {
            cwd: (0, ($parcel$interopDefault($hT1bR$os))).tmpdir()
        });
    }
    /**
   * Generate a temp filePath in side temp dir (but it is just the file path, no file content existed)
   * @param prefix prepend to the fileName
   * @param fileExtension extension must be with the dot (.), append to the result fileName
   * @returns
   */ static generateNewTempFilePath(prefix = "", fileExtension = "") {
        const tmpFileName = `${prefix}${(0, $1f6d16a92569a9c9$export$e616ecc10ddca3fa).createRandom()}${fileExtension}`;
        const tmpFilePath = (0, ($parcel$interopDefault($hT1bR$path))).join((0, ($parcel$interopDefault($hT1bR$os))).tmpdir(), tmpFileName);
        return tmpFilePath;
    }
    static async unlinksSafe(paths) {
        const arr = paths.map(async (p)=>{
            if (await $d06b3bef2a4bf440$export$af3e19fefa989154.checkFileExist(p)) await (0, $hT1bR$fs.promises).unlink(p);
        });
        return Promise.all(arr);
    }
    /**
   * download remote file into local temp dir
   * @param link
   * @returns local temp file path
   */ static async cacheRemoteUrl(link) {
        if (!link) throw new Error(`${link} is empty, neither URL nor localFile`);
        if ((0, $1f6d16a92569a9c9$export$e616ecc10ddca3fa).isLocalFilePath(link)) return link // already in local, no need to download
        ;
        if (!(0, $1f6d16a92569a9c9$export$e616ecc10ddca3fa).isURL(link)) throw new Error(`${link} is neither URL nor localFile`);
        const url = link;
        // https://vbee-studio-tmp.s3.ap-southeast-1.amazonaws.com/voice-cloning/voices/6765858815ba1ce0979a8b35/filename.wav ==> filename.wav
        const fileName = (0, ($parcel$interopDefault($hT1bR$path))).basename(link) // = link.split('/').slice(-1)[0]
        ;
        const outputFilePath = $d06b3bef2a4bf440$export$af3e19fefa989154.generateNewTempFilePath("temp-cached_", "_" + fileName);
        try {
            await (0, $bb2fd2799a25985b$export$4daadb33ccaded1).download(url, outputFilePath);
        } catch (err) {
            console.error("Error: 404 not Found: ", url, err.code);
        }
        return outputFilePath;
    }
}






//# sourceMappingURL=lakdak.umd.js.map
