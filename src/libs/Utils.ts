// NOTE: INTERNAL utils for this repo only

/** noticable log in DEBUG environment */
export function DEBUG(...args) {
  if (process.env.NODE_ENV !== 'production') {
    console.debug('\x1b[36m🐞 ------ \x1b[0m', ...args)
    // [ℹ️]
  }
}
