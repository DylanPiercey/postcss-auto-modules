const fs = require("fs");
const path = require("path");
const postcssModules = require("postcss-modules");

module.exports = (opts = {}) => {
  const modules = new Map();
  const globalCSSReg = /(?<!\.module)\.[^.]+$/;
  const originalPlugin = postcssModules({
    ...opts,
    globalModulePaths: [globalCSSReg],
    getJSON(_, exports, distFile) {
      if (!isEmpty(exports)) {
        modules.set(distFile, exports);
      }
    },
  });
  const facadePlugin = {
    ...originalPlugin,
    OnceExit(css, ctx) {
      if (
        ctx.result.processor.plugins.some(
          (plugin) =>
            plugin !== facadePlugin &&
            plugin.postcssPlugin === facadePlugin.postcssPlugin,
        )
      )
        return;
      return originalPlugin.OnceExit(css, ctx);
    },
  };
  process.on("beforeExit", () => {
    for (const [file, exports] of modules) {
      const outCSSFile = file.replace(/\.[^.]+$/, ".dist$&");
      fs.renameSync(file, outCSSFile);
      fs.writeFileSync(
        `${file}.js`,
        `import "./${path.basename(outCSSFile)}";\n` +
          `export default ${JSON.stringify(exports)};`,
      );
    }
  });
  return {
    postcssPlugin: "postcss-auto-modules",
    plugins: [facadePlugin],
  };
};
module.exports.postcss = true;

function isEmpty(obj) {
  for (const _ in obj) {
    return false;
  }
  return true;
}
