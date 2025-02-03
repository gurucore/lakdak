var $f6b600db55700cdd$exports = require("./CustomError.1083a31e.js");
var $eWZQs$http = require("http");
var $eWZQs$https = require("https");
var $eWZQs$fs = require("fs");
var $eWZQs$url = require("url");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "RawNetworkHelper", () => $2036d0ecb554b269$export$4daadb33ccaded1);





class $2036d0ecb554b269$export$946d4ce585efed41 extends (0, $f6b600db55700cdd$exports.CustomError) {
    statusCode;
    url;
    constructor(message, error, statusCode, url, extra){
        super(message, error, extra), this.statusCode = statusCode, this.url = url;
        this.name = 'DownloadError';
    }
}
class $2036d0ecb554b269$export$4daadb33ccaded1 {
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
            url = new (0, $eWZQs$url.URL)(urlString);
        } catch (err) {
            throw new $2036d0ecb554b269$export$946d4ce585efed41(`Invalid URL: ${urlString}`, err, undefined, urlString);
        }
        // Validate protocol
        if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new $2036d0ecb554b269$export$946d4ce585efed41(`Unsupported protocol: ${url.protocol}`);
        // Ensure directory exists
        // const directory = path.dirname(filePath)
        // await fs.promises.mkdir(directory, { recursive: true })
        const { timeout: timeout = 30000, headers: headers = {} } = options;
        return new Promise((resolve, reject)=>{
            const fileStream = (0, ($parcel$interopDefault($eWZQs$fs))).createWriteStream(filePath);
            let fileInfo = {
                mime: '',
                size: 0,
                filePath: filePath
            };
            const protocol = url.protocol === 'https:' ? (0, ($parcel$interopDefault($eWZQs$https))) : (0, ($parcel$interopDefault($eWZQs$http)));
            const request = protocol.get(url, {
                timeout: timeout,
                headers: headers
            }, (response)=>{
                // Support download via http redirects
                if (response.statusCode === 301 || response.statusCode === 302) {
                    const redirectUrl = response.headers.location;
                    if (!redirectUrl) {
                        reject(new $2036d0ecb554b269$export$946d4ce585efed41('Redirect location not provided', undefined, response.statusCode, urlString));
                        return;
                    }
                    $2036d0ecb554b269$export$4daadb33ccaded1.download(redirectUrl, filePath, options).then(resolve).catch(reject);
                    return;
                }
                // Handle error status codes
                if (response.statusCode !== 200) {
                    reject(new $2036d0ecb554b269$export$946d4ce585efed41(`Raw download file error. ${response.statusCode}`, //
                    undefined, response.statusCode, urlString));
                    return;
                }
                // Set file info
                fileInfo = {
                    mime: response.headers['content-type'] || '',
                    size: parseInt(response.headers['content-length'] || '0', 10),
                    filePath: filePath
                };
                response.pipe(fileStream);
            });
            request.on('error', (err)=>{
                fileStream.destroy();
                (0, ($parcel$interopDefault($eWZQs$fs))).unlink(filePath, ()=>{
                    reject(new $2036d0ecb554b269$export$946d4ce585efed41(`Network error: ${err.message}`, err, undefined, urlString));
                });
            });
            request.on('timeout', ()=>{
                request.destroy();
                fileStream.destroy();
                (0, ($parcel$interopDefault($eWZQs$fs))).unlink(filePath, ()=>{
                    reject(new $2036d0ecb554b269$export$946d4ce585efed41(`Download timed out after ${timeout}ms`, undefined, undefined, urlString));
                });
            });
            // Handle successful download
            fileStream.on('finish', ()=>{
                fileStream.close(()=>resolve(fileInfo));
            });
            // Handle file system errors
            fileStream.on('error', (err)=>{
                fileStream.destroy();
                (0, ($parcel$interopDefault($eWZQs$fs))).unlink(filePath, ()=>{
                    reject(new $2036d0ecb554b269$export$946d4ce585efed41(`File system error: ${err.message}`, err, undefined, urlString));
                });
            });
        });
    }
}


//# sourceMappingURL=RawNetworkHelper.761de896.js.map
