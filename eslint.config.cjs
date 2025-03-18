// for eslint . --fix

// use type=module in package.json if we want to use ES6 modules `export default {}`

module.exports = {
  ignores: [
    'node_modules',
    '.parcel-cache',
    'dist',
    'coverage',
    //
    '.eslintrc.js',
    'eslint.config.cjs',
    'package.json',
    'package-lock.json'
    //
  ]
}
