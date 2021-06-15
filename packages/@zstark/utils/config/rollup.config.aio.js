// rollup.config.js
// umd
var nodeResolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');
var uglify = require('rollup-plugin-uglify');
var builtins = require('rollup-plugin-node-builtins');

var common = require('./rollup.js');

var prod = process.env.NODE_ENV === 'production';

module.exports = common.files.map(o => {
    return {
        input: `lib/${o}.js`,
        output: {
            file: prod ? `lib/${o}.aio.min.js` : `lib/${o}.aio.js`,
            format: 'umd',
            // When export and export default are not used at the same time, set legacy to true.
            // legacy: true,
            name: common.name,
            banner: common.banner.replace(/{dts}/g, o),
        },
        plugins: [
            builtins(),
            common.getReplace(),
            nodeResolve({
                main: true,
                browser: true,
                jsnext: true,
                extensions: ['.ts', '.js', '.json']
            }),
            commonjs({
                // include: 'node_modules/**',
            }),
            common.getCompiler({}, true),
            (prod && uglify()),
        ]
    }
})
