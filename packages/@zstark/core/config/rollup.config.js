// rollup.config.js
// commonjs
var common = require('./rollup.js');

module.exports = common.files.map(o => {
    return {
        input: `src/${o}.ts`,
        output: {
            file: `lib/${o}.js`,
            format: 'cjs',
            // When export and export default are not used at the same time, set legacy to true.
            // legacy: true,
            banner: common.banner.replace(/{dts}/g, o),
        },
        plugins: [
            common.getCompiler({
                tsconfigOverride: { compilerOptions : { declaration: true, module: 'ES2015' } },
                useTsconfigDeclarationDir: true
            }),
            common.getReplace(),
        ]
    }
})
