var $8UsVG$child_process = require("child_process");
var $8UsVG$util = require("util");


function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "CLIHelper", () => $0e02fa5f74c03ebb$export$73e2f76829f803fa);


const $0e02fa5f74c03ebb$var$execAsync = (0, $8UsVG$util.promisify)((0, $8UsVG$child_process.exec));
class $0e02fa5f74c03ebb$export$73e2f76829f803fa {
    /** undefined will be ""
   * Returns empty arguments as '""'
Leaves simple arguments without spaces/special chars unchanged
For complex arguments:
Escapes any existing double quotes
Wraps the argument in double quotes

It's not as comprehensive as "npm:shell-quote" but handles most common cases safely and is much lighter. */ static escapeArg(arg) {
        if (arg === undefined) return '';
        if (arg === null) return '';
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
   */ static async exec(command, args = [], hint, options = {}, bashCommandExtra = '') {
        const { throwOnError: throwOnError = true, silent: silent = false, // uncomment to auto use process.env and cwd
        // env = process.env, cwd = process.cwd(),
        ...execOptions } = options;
        // Properly escape all arguments (for security)
        const fullCommand = `${command} ${args.map($0e02fa5f74c03ebb$export$73e2f76829f803fa.escapeArg).join(' ')} ${bashCommandExtra}`;
        if (!silent) console.log(`Executing (${hint ? hint : ''}): ${fullCommand}`);
        try {
            const { stdout: stdout, stderr: stderr } = await $0e02fa5f74c03ebb$var$execAsync(fullCommand, options);
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
        const { throwOnError: throwOnError = true, silent: silent = false, // uncomment to auto use process.env and cwd
        // env = process.env, cwd = process.cwd(),
        ...spawnOptions } = options;
        if (!silent) console.log(`Executing (${hint ? hint : ''}): ${command} ${args.join(' ')}`);
        const childProc = (0, $8UsVG$child_process.spawn)(command, args, {
            // env,
            // cwd,
            ...spawnOptions
        });
        const stdoutBuffers = [];
        const stderrBuffers = [];
        childProc.stdout?.on('data', (buffer)=>{
            if (!silent) process.stdout.write(buffer);
            stdoutBuffers.push(buffer);
        });
        childProc.stderr?.on('data', (buffer)=>{
            if (!silent) process.stderr.write(buffer);
            stderrBuffers.push(buffer);
        });
        return new Promise((resolve, reject)=>{
            childProc.on('close', (code)=>{
                const output = Buffer.concat(stdoutBuffers).toString().trim();
                const error = Buffer.concat(stderrBuffers).toString().trim();
                if (code !== 0 && throwOnError) {
                    const error = new Error(`Process failed with exit code ${code}`);
                    Object.assign(error, {
                        stdout: output,
                        stderr: error,
                        code: code,
                        hint: hint
                    });
                    reject(error);
                } else resolve({
                    output: output,
                    error: error,
                    code: code,
                    hint: hint
                });
            });
            childProc.on('error', reject);
        });
    }
}


//# sourceMappingURL=CLIHelper.a5a9dc24.js.map
