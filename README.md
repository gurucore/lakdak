# Lakdak: The common NodeJS utilities library

**Common and best practices** code are accumulated here in a NodeJS Lib for writting backend (API) services

- Parcel to build https://dev.to/ihaback/create-your-own-typescript-library-with-parceljs-3dh7
- _pnpm_ for package management

## Project Setup for contribution

```sh
pnpm i
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

## Test

https://vitest.dev

- blazing fast unit test
- Run `pnpm test` (watch mode) and change a test or source code to see HMR in action!

## Build for production release

> Support Type-Check, Compile and Minify for Production
> Support tree-shaking, each helper stays in its own file and can be imported separately
> Build to output both ES and UMD module.

1. When introducing new class that need to expose, remember to **export** what you want to expose in `index.ts`
1. Change `package.json` version string

- every push to repo will run CI check (`npm run ci` type check and unit test).

  - To skip CI check build, add `skipCI` to commit message

- create a tag (start with `v` and `semver` like v0.0.1) will `npm run build` and create a package on Github Packages https://github.com/vbee-holding/vbee-node-shared-lib/packages

# Usage

In any TypeScript (or JavaScript) project, developer uses lakdak by add deps:

`"lakdak": "github:gurucore/lakdak#v0.1.0"`

```js
import { FileHelper } from 'lakdak'
console.log(FileHelper())
```

If you cannot see the code suggestion (with comment), add this to `tsconfig.json`

```json
{
  "compilerOptions": {
    "paths": {
      "lakdak": ["./node_modules/lakdak/dist/types/index.d.ts"]
    } // tells TypeScript: "When you see an import for 'lakdak', look exactly here for the types"
  }
}
```

To benefit tree-shaking, add this to `tsconfig.json`

```json
{
  "compilerOptions": {
    "module": "ES2022",
    "moduleResolution": "bundler"
    // This will give you better tree-shaking and modern module benefits
  }
}
```

### NOTE about package.json - "type": "module"

Make this library intended to be consumed as an ES module.
This setting ensures that Node.js treats .js files as ES modules by default.

We want to support both CommonJS and ES module consumers
The build process outputs both module formats (already does this by specifying both main and module fields)

- CommonJS consumers to use the main entry point
- and ES module consumers to use the module entry point.

### NOTE: about releasing

To avoid setup npm build and deploy, we can research to use deps like this: "@vbee-holding/node-shared-lib": "github:vbee-holding/vbee-node-shared-lib#v0.1.0"
But this require the lib to be in public repo

1. Run `pnpm release`
1. The output will be put to `/dist` (support both **ESM-MJS** and **CommonJS-CJS-UMD**)
1. commit the `.dist` folder to repo to publish it on Github
1. create new `versioned tag` for the release (E.g.: `v0.2.3`)
