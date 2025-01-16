import crypto from "crypto";
import { ExecOptions, SpawnOptions } from "child_process";
/**
 * Helper to inspect, check, analyse command send to chatbot
 */
export class DevOpsHelper {
    /**
     * Get current server IP address
     * @param ipType "v4" or "v6"
     * @returns
     */
    static getCurrentServerIpAddresses(ipType?: string): string;
    /**
     * Get IP from request (if behind proxy, use X-Forwarded-For header)
     * @param req
     * @returns
     */
    static extractIpFromRequest(req: any): any;
}
export class SecurityHelper {
    /**
     *
     * @param input
     * @param algorithm  "sha1" "sha256"
     * @returns hex string
     */
    static hash(input: crypto.BinaryLike, algorithm?: string): string;
    /**
     *
     * @param modulusLength effective key size 2048 bit (good until 2030), after 2030, use 3072 bit
     * @returns keypair: object of public and private
     */
    static generateRSAKeyPair(modulusLength?: number): {
        publicKey: string | Buffer;
        privateKey: string | Buffer;
    };
    /**
     * Encrypt using publicKey, the encrypted data is in the form of bytes, so we print it in base64 format
     * so that it's displayed in a more readable form
     * @param publicKey
     * @param plainText
     * @returns String base64 format
     */
    static encryptText(publicKey: any, plainText: string): string;
    /**
     * decrypt using privateKey. The decrypted data is of the Buffer type,
     * which we can convert to a string to reveal the original data
     * @param privateKey
     * @param encryptedTextBase64 String in base64 format
     * @returns utf-8 string
     */
    static decryptText(privateKey: any, encryptedTextBase64: string): string;
}
/** Helper to work with HTTP Protocol */
export class HttpProtocolHelper {
    /**
     * extract bearer token from request header
     * @param req
     * @returns
     */
    static extractBearerToken(req: any): any;
}
interface CLIResult {
    output: string;
    error: string;
    code?: number;
    hint?: string;
}
interface ExtendedSpawnOptions extends SpawnOptions {
    /** Whether to throw an error on non-zero exit codes */
    throwOnError?: boolean;
    /** Whether to log command execution */
    silent?: boolean;
}
interface ExtendedExecOptions extends ExecOptions {
    /** Whether to throw an error on non-zero exit codes */
    throwOnError?: boolean;
    /** Whether to log command execution */
    silent?: boolean;
}
/**
 * For most cases (simple commands where you know the input is safe), the simpler exec approach is sufficient.
 *
 * Use streaming with spawn only if dealing with very large outputs or needing real-time processing of the output as it comes in.
 * For complex command and incorporating user input into the command, there are security concerns with exec (proper escaping to prevent command injection).
 * In this case spawn is often preferred for more complex use cases - it handles argument passing more safely and explicitly.
 */
export class CLIHelper {
    /** undefined will be ""
     * Returns empty arguments as '""'
  Leaves simple arguments without spaces/special chars unchanged
  For complex arguments:
  Escapes any existing double quotes
  Wraps the argument in double quotes
  
  It's not as comprehensive as "npm:shell-quote" but handles most common cases safely and is much lighter. */
    static escapeArg(arg?: string | null): string;
    /**
     * Executes a shell command and returns its output (keep the output in memory and return all at once)
     * @example await runCommand('echo', ['hello world', 'file name.txt'])
     * @param command - The command to execute
     * @param options - Node.js exec options (optional)
     * @param hint - descriptive hint to know what command we're excuting (e.g.: we execute a complex and long ffmpeg command, put a hint here to describle it)
     * @returns Promise resolving to process output details
     * @throws Error if process fails
     */
    static exec(command: string, args?: string[], hint?: string, options?: ExtendedExecOptions, bashCommandExtra?: string): Promise<CLIResult>;
    /**
     * Spawns a child process and returns a promise that resolves with its output
     * @param command - The command to execute
     * @param args - Array of arguments to pass to the command
     * @param options - Configuration options for process spawning
     * @param hint - descriptive hint to know what command we're excuting (e.g.: we execute a complex and long ffmpeg command, put a hint here to describle it)
     * @returns Promise resolving to process output details
     * @throws Error if process fails
     */
    static spawn(command: string, args?: string[], hint?: string, options?: ExtendedSpawnOptions): Promise<CLIResult>;
    /**
     * @deprecated This method is kept for backward compatible if there is a problem with new implementation.
     */
    static spawnOld(command: string, args?: string[], options?: SpawnOptions): Promise<unknown>;
}
export class UtilHelper {
    static createRandom(): string;
    /** convert true false to yes/no or icon of yes/no */
    static boolToYesNo(b?: boolean, withText?: boolean): string;
    /**
     * Checks if a string is a valid URL.
     * @param str The string to check.
     */
    static isURL(str: string): boolean;
    /**
     * Checks if a string is a valid file path. Just file name like "file" or "file.txt" is false. "c:/file" is true
     * @param str The string to check.
     */
    static isLocalFilePath(str: string): boolean;
}
interface FileInfo {
    mime: string;
    size: number;
    filePath: string;
}
interface DownloadOptions {
    timeout?: number;
    headers?: Record<string, string>;
}
export class RawNetworkHelper {
    /**
     * This is stream download using raw http/https API
     * Real-world performance example for a 1GB file:
  
  Stream implementation: ~100MB memory usage
  fetch()/axios: ~1.1GB memory usage (entire file + overhead)
  
  However, there are cases where fetch() or axios might be preferred:
  
  If you need to process the file in memory anyway
  For very small files where the overhead doesn't matter
  When you need the additional features these libraries provide (like automatic retries, request interception, etc.)
     */
    static download(urlString: string, filePath: string, options?: DownloadOptions): Promise<FileInfo>;
}
export class FileHelper {
    static checkFileExist(filePath?: string): Promise<boolean>;
    /** return the extension, include the dot (.) */
    static getFileExtension(filePathOrURL?: string): string;
    /** copy files to OS temp dir  */
    static copyToTempDir(sourceFilePath: string): Promise<string>;
    static clearTempDir(): Promise<void>;
    /**
     * Generate a temp filePath in side temp dir (but it is just the file path, no file content existed)
     * @param prefix prepend to the fileName
     * @param fileExtension extension must be with the dot (.), append to the result fileName
     * @returns
     */
    static generateNewTempFilePath(prefix?: string, fileExtension?: string): string;
    static unlinksSafe(paths: string[]): Promise<void[]>;
    /**
     * download remote file into local temp dir
     * @param link
     * @returns local temp file path
     */
    static cacheRemoteUrl(link: string): Promise<string>;
}

//# sourceMappingURL=index.d.ts.map
