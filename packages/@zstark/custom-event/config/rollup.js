var typescript = require('rollup-plugin-typescript2');
var babel = require('rollup-plugin-babel');
var replace =  require('rollup-plugin-replace');

var pkg = require('../../eslint-plugin-zstark/package.json');

var version = pkg.version;

var banner =
`/*!
 * ${pkg.name} ${version}
 */
`;

function getCompiler(opt = {}, isJs) {
    if (isJs) {
        return babel({
            babelrc: false,
            presets: [
                [
                    '@babel/preset-env',
                    {
                        'targets': {
                            'browsers': 'last 2 versions, > 1%, ie >= 6, Android >= 4, iOS >= 6, and_uc > 9',
                            'node': '0.10'
                        },
                        'modules': false,
                        'loose': false
                    }
                ]
            ],
            plugins: [
                [
                    '@babel/plugin-transform-runtime',
                    {
                        'helpers': false,
                        'regenerator': false
                    }
                ]
            ],
            runtimeHelpers: true,
            // exclude: 'node_modules/**'
        });
    }

    opt = opt || {
        tsconfigOverride: { compilerOptions : { module: 'ES2015' } }
    }

    return typescript(opt);
}

function getReplace() {
    return replace({
        PKG_VERSION: JSON.stringify(pkg.version),
    })
}


exports.name = 'zstarkCustomEvent';
exports.banner = banner;
exports.getCompiler = getCompiler;
exports.getReplace = getReplace
