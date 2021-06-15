// rollup.config.js
// ES output
var common = require('./rollup.js');
var builtins = require('rollup-plugin-node-builtins');

module.exports = common.files.map(o => {
    return {
        input: `src/${o}.ts`,
        output: {
            file: `lib/${o}.esm.js`,
            format: 'es',
            // When export and export default are not used at the same time, set legacy to true.
            // legacy: true,
            banner: common.banner.replace(/{dts}/g, o),
        },
        plugins: [
            common.getCompiler({
                tsconfigOverride: { compilerOptions : { declaration: false } },
                useTsconfigDeclarationDir: true
            }),
            common.getReplace(),
            builtins(),
        ]
    }
})
