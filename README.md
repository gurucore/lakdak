# node-lib-core

NodeJS Lib, Core lib for backend (API) services

Common and best practices code are accumulated here

## FE Component library

Use Vite https://github.com/josip2312/typescript-lib-vite

If you want to customize configuratio, see [Vite Configuration Reference](https://vitejs.dev/config/).

Blog post: https://jivancic.com/posts/build-a-component-library.html

## BE NodeJS library

Use Parcel https://dev.to/ihaback/create-your-own-typescript-library-with-parceljs-3dh7

# Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm run dev
```

# Test

We use https://vitest.dev for blazing fast unit test
Run `npm test` (run in watch mode) and change a test or source code to see HMR in action!

Or use the recommended VSCode plugin `ZixuanChen.vitest-explorer`

# Build for production release

### Type-Check, Compile and Minify for Production

```sh
pnpm run build
```

> Remember to export what you want to expose in `index.ts`

> E.g.: `export { hello as testFunction } from "./libs/lib";`

## Usage

In project A, user can use

```
import { testFunction } from "lakdak"
console.log(testFunction())
```
