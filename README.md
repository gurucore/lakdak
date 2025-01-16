# Lakdak: The common NodeJS utilities library

**Common and best practices** code are accumulated here in a NodeJS Lib for writting backend (API) services

# Project Setup for contribution

- Parcel to build https://dev.to/ihaback/create-your-own-typescript-library-with-parceljs-3dh7
- _pnpm_ for package management

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

# Build for production release

Type-Check, Compile and Minify for Production

> Remember to export what you want to expose in `index.ts`

> E.g.: `export { hello as testFunction } from "./libs/lib";`

```sh
pnpm build
```

- The output will be put to `/dist`
- commit the `.dist` folder to repo to publish it on Github
- create new `versioned tag` for the release

# Usage

In any TypeScript (or JavaScript) project, developer uses lakdak by add deps:

`"lakdak": "github:gurucore/lakdak#v0.1.0"`

```js
import { FileHelper } from 'lakdak'
console.log(FileHelper())
```
