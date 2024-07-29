const fs = require("fs");
const path = require("path");
const postcssModules = require("postcss-modules");

module.exports = (opts = {}) => {
  const modules = new Map();
  const globalCSSReg = /(?<!\.module)\.[^.]+$/;
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
    plugins: [
      postcssModules({
        ...opts,
        globalModulePaths: [globalCSSReg],
        getJSON(_, exports, distFile) {
          if (!isEmpty(exports)) {
            modules.set(distFile, exports);
          }
        },
      }),
    ],
  };
};
module.exports.postcss = true;

function isEmpty(obj) {
  for (const _ in obj) {
    return false;
  }
  return true;
}
