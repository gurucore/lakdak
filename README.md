# Lakdak: The common NodeJS utilities library

NodeJS Lib, Core lib for backend (API) services

Common and best practices code are accumulated here

## FE Component library

Use Vite https://github.com/josip2312/typescript-lib-vite

If you want to customize configuratio, see [Vite Configuration Reference](https://vitejs.dev/config/).

Blog post: https://jivancic.com/posts/build-a-component-library.html

## BE NodeJS library

Use Parcel https://dev.to/ihaback/create-your-own-typescript-library-with-parceljs-3dh7

# Project Setup for contribution

We use _Yarn_ for package management.

```sh
yarn install
```

### Compile and Hot-Reload for Development

```sh
yarn dev
```

## Test

We use https://vitest.dev for blazing fast unit test
Run `yarn test` (watch mode) and change a test or source code to see HMR in action!

Or you use the recommended VSCode plugin `ZixuanChen.vitest-explorer`

# Build for production release

Type-Check, Compile and Minify for Production

> Remember to export what you want to expose in `index.ts`

> E.g.: `export { hello as testFunction } from "./libs/lib";`

```sh
yarn build
```

# Usage

In any TypeScript (or JavaScript) project, developer uses lakdak by

```
import { testFunction } from "lakdak"
console.log(testFunction())
```
