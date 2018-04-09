/**
 * Created by UI/UX Team on 2018. 2. 14..
 */

const path = require('path');
const fs = require('fs');

const _ = require('lodash');
const glob = require('glob');

const webpack = require('webpack');

const {Config, environment} = require('webpack-config');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
//const JSDocPlugin = require('./plugins/jsDocPlugin');

const envConfig = environment.get('config');

const rootPath = path.join(__dirname, '..');
const srcPath = path.join(rootPath, 'src');

const entry = path.join(srcPath, 'proxy-shim');

const config = {
    entry: {
        "proxy-shim": entry,
        "proxy-shim.min": entry
    },
    plugins: [
        new UglifyJsPlugin({
            include: /\.min\.js$/
        })
    ]
};

module.exports = new Config().extend(path.join(__dirname, 'webpack.base.config.js')).merge(config);