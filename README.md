<h1 align="center">PostCSS-Auto-Modules</h1>

## Details
This module is intended to be used in library code that would like to use css modules output by the postcss cli _WITHOUT_ having to think about JSON files and the like.

The goal is to automatically treat `*.module.*` files as css modules (similar to bundler integrations in vite/webpack/etc).
This plugin will also output a `.css.js` file for every css module which is then imported from your app and re-exports the JSON from `postcss-modules` and imports the built css file.

## Getting Started
### Install

```console
npm i -D postcss-auto-modules
```

### Configure PostCSS
```json
{
  "plugins": {
    "postcss-auto-modules": {}
  }
}
```

> Note: all options forwarded to postcss-modules plugin

### Use PostCSS CLI
```console
postcss ./src/**/*.css -d dist --base src
```
