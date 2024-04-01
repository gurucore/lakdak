# Lakdak: The common NodeJS utilities library

**Common and best practices** code are accumulated here in a NodeJS Lib for writting backend (API) services

# Project Setup for contribution

- Use Parcel https://dev.to/ihaback/create-your-own-typescript-library-with-parceljs-3dh7
- We use _Yarn_ for package management.

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

- The output will be put to `/dist`
- commit the `.dist` folder to repo to publish it on Github
- create new `versioned tag` for the release

# Usage

In any TypeScript (or JavaScript) project, developer uses lakdak by

```
import { testFunction } from "lakdak"
console.log(testFunction())
```

# Note for FE Component library

Use Vite https://github.com/josip2312/typescript-lib-vite

If you want to customize configuratio, see [Vite Configuration Reference](https://vitejs.dev/config/).

Blog post: https://jivancic.com/posts/build-a-component-library.html
