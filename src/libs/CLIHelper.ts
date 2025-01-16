import { exec, spawn as childSpawn, ExecOptions, SpawnOptions } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

interface CLIResult {
  output: string
  error: string
  code?: number
  hint?: string
}

interface ExtendedSpawnOptions extends SpawnOptions {
  /** Whether to throw an error on non-zero exit codes */
  throwOnError?: boolean
  /** Whether to log command execution */
  silent?: boolean
}
interface ExtendedExecOptions extends ExecOptions {
  /** Whether to throw an error on non-zero exit codes */
  throwOnError?: boolean
  /** Whether to log command execution */
  silent?: boolean
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
  static escapeArg(arg?: string | null): string {
    if (arg === undefined) return ''
    if (arg === null) return ''

    // Handle empty strings
    if (!arg) return '""'

    // If argument has no special chars, return as is
    if (/^[a-zA-Z0-9_\/:=-]+$/.test(arg)) return arg

    // Escape double quotes and wrap the entire argument in double quotes
    return `"${arg.replace(/"/g, '\\"')}"`
  }

  /**
   * Executes a shell command and returns its output (keep the output in memory and return all at once)
   * @example await runCommand('echo', ['hello world', 'file name.txt'])
   * @param command - The command to execute
   * @param options - Node.js exec options (optional)
   * @param hint - descriptive hint to know what command we're excuting (e.g.: we execute a complex and long ffmpeg command, put a hint here to describle it)
   * @returns Promise resolving to process output details
   * @throws Error if process fails
   */
  static async exec(command: string, args: string[] = [], hint?: string, options: ExtendedExecOptions = {}, bashCommandExtra = '') {
    const {
      throwOnError = true,
      silent = false,
      // uncomment to auto use process.env and cwd
      // env = process.env, cwd = process.cwd(),
      ...execOptions
    } = options

    // Properly escape all arguments (for security)
    const fullCommand = `${command} ${args.map(CLIHelper.escapeArg).join(' ')} ${bashCommandExtra}`

    if (!silent) {
      console.log(`Executing (${hint ? hint : ''}): ${fullCommand}`)
    }

    try {
      const { stdout, stderr } = await execAsync(fullCommand, options)
      return {
        output: stdout.trim(),
        error: stderr.trim(),
        hint,
      } as CLIResult
    } catch (error) {
      throw new Error(`Exec CLI command failed: ${(error as any).message}`)
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
   */
  static async spawn(command: string, args: string[] = [], hint?: string, options: ExtendedSpawnOptions = {}): Promise<CLIResult> {
    const {
      throwOnError = true,
      silent = false,
      // uncomment to auto use process.env and cwd
      // env = process.env, cwd = process.cwd(),
      ...spawnOptions
    } = options

    if (!silent) {
      console.log(`Executing (${hint ? hint : ''}): ${command} ${args.join(' ')}`)
    }

    const childProc = childSpawn(command, args, {
      // env,
      // cwd,
      ...spawnOptions,
    })

    const stdoutBuffers: Buffer[] = []
    const stderrBuffers: Buffer[] = []

    childProc.stdout?.on('data', (buffer: Buffer) => {
      if (!silent) {
        process.stdout.write(buffer)
      }
      stdoutBuffers.push(buffer)
    })

    childProc.stderr?.on('data', (buffer: Buffer) => {
      if (!silent) {
        process.stderr.write(buffer)
      }
      stderrBuffers.push(buffer)
    })

    return new Promise<CLIResult>((resolve, reject) => {
      childProc.on('close', (code: number) => {
        const output = Buffer.concat(stdoutBuffers).toString().trim()
        const error = Buffer.concat(stderrBuffers).toString().trim()

        if (code !== 0 && throwOnError) {
          const error = new Error(`Process failed with exit code ${code}`)
          Object.assign(error, { stdout: output, stderr: error, code, hint })
          reject(error)
        } else {
          resolve({ output, error, code, hint } as CLIResult)
        }
      })

      childProc.on('error', reject)
    })
  }

  /**
   * @deprecated This method is kept for backward compatible if there is a problem with new implementation.
   */
  static async spawnOld(command: string, args: string[] = [], options: SpawnOptions = {}) {
    console.log(`Executing: ${command} ${args.join(' ')}`)

    const childProc = childSpawn(command, args, {
      env: options.env || process.env,
      cwd: options.cwd || process.cwd(),
      ...options,
    })

    const resultBuffers: Buffer[] = []

    childProc.stdout.on('data', (buffer: Buffer) => {
      console.log(buffer.toString())
      resultBuffers.push(buffer)
    })

    childProc.stderr.on('data', (buffer: Buffer) => {
      console.error(buffer.toString())
    })

    return new Promise((resolve, reject) => {
      childProc.on('close', (code: number) => {
        if (code === 0) {
          resolve(Buffer.concat(resultBuffers).toString().trim())
        } else {
          reject(new Error(`${command} failed with exit code ${code}`))
        }
      })

      childProc.on('error', (err: Error) => {
        reject(err)
      })
    })
  }
}
