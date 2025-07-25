# Lakdak: The common NodeJS utilities library

**Common and best practices** code are accumulated here in a NodeJS Lib for writting backend (API) services

Published on NPM
[![NPM downloads](https://img.shields.io/npm/dm/@gurucore/lakdak.svg?label=npm%20downloads)](https://npm-stat.com/charts.html?package=@gurucore/lakdak)
[![Push (CI check)](https://github.com/gurucore/lakdak/actions/workflows/push.yml/badge.svg?branch=main)](https://github.com/gurucore/lakdak/actions/workflows/push.yml)

# Usage

In any TypeScript (or JavaScript) project, run:

`npm i @gurucore/lakdak`

Then in your code

```js
import { FileHelper } from 'lakdak'
console.log(FileHelper())
```

### If you cannot see the code suggestion (with comment), add this to `tsconfig.json`

```json
{
  "compilerOptions": {
    "paths": {
      "@gurucore/lakdak": ["./node_modules/@gurucore/lakdak/dist/types/index.d.ts"]
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

# Notable services

## CLI Helper

## File Helper and Remote File Helper

## Raw Network Helper

Download internet file with raw stream, reduce a lot of memory consumption

## Cache Manager

- wrap any fetch function in cache
- supports a mechanism to refresh expiring cache keys in background.
- Tiered caches, data is stored in many caches, fetched from the highest priority cache(s) first
- nonBlocking, Keyv compatible

# Developments

- Parcel to build https://dev.to/ihaback/create-your-own-typescript-library-with-parceljs-3dh7
- _pnpm_ for package management
- [Vitest](https://vitest.dev)

### Project Setup for contribution

```sh
pnpm i
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

## Test

- Run `pnpm test` (watch mode) and change a test or source code to see HMR in action!

## Build for production release

> Support Type-Check, Compile and Minify for Production
> Support tree-shaking, each helper stays in its own file and can be imported separately
> Build to output both ES and UMD module.

1. When introducing new class that need to expose, remember to **export** what you want to expose in `index.ts`
1. Change `package.json` version string

- every push to repo will run CI check (`npm run ci` type check and unit test).

  - To skip CI check build, add `skipCI` to commit message

- create a tag (start with `v` and `semver` like v0.0.1) will `npm run build` and create a package on https://www.npmjs.com/package/@gurucore/lakdak

### NOTE about package.json config to support serving both CommonJS and ESM

As a shared library, we want to support both CommonJS and ES module consumers
The build process outputs both module formats (already does this by specifying both main and module fields)

- CommonJS consumers (used with NodeJS repo, written in JS) to use the main entry point
- and ES module consumers (NodeJS repo written in TypeScript, or modern browser) to use the module entry point

### NOTE: about code-repo-releasing without publishing to npmjs

To avoid setup npm build and deploy, we can research to use deps like this: `"@gurucore/shared-lib": "github:gurucore/shared-lib#v0.1.0"`
But this require the lib to be in public repo

1. Run `pnpm run ci` and `pnpm release` locally before commit and push
1. The output will be put to `/dist` (support both **ESM-MJS** and **CommonJS-CJS-UMD**)
1. commit the `.dist` folder to repo to publish it on Github
1. create new `versioned tag` for the release (E.g.: `v0.2.3`)
