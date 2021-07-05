// rollup.config.js
// umd
var nodeResolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');
var uglify = require('rollup-plugin-uglify');
var builtins = require('rollup-plugin-node-builtins');

var common = require('./rollup.js');

var prod = process.env.NODE_ENV === 'production';

module.exports = {
    input: 'lib/index.js',
    output: {
        file: prod ? 'lib/index.aio.min.js' : 'lib/index.umd.js',
        format: 'umd',
        // When export and export default are not used at the same time, set legacy to true.
        // legacy: true,
        name: common.name,
        banner: common.banner,
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
};
