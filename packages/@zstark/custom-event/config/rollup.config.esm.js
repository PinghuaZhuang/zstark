// rollup.config.js
// ES output
var common = require('./rollup.js');
var builtins = require('rollup-plugin-node-builtins');

module.exports = {
    input: 'src/index.ts',
    output: {
        file: 'lib/index.esm.js',
        format: 'es',
        // When export and export default are not used at the same time, set legacy to true.
        // legacy: true,
        banner: common.banner,
    },
    plugins: [
        common.getCompiler({
            tsconfigOverride: { compilerOptions : { declaration: false } },
            useTsconfigDeclarationDir: true
        }),
        common.getReplace(),
        builtins(),
    ]
};
