/**
 * Created by UI/UX Team on 2018. 2. 14..
 */

const path = require('path');
const fs = require('fs');

const _ = require('lodash');
const glob = require('glob');

const {Config, environment} = require('webpack-config');

const envConfig = environment.get('config');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

//const JSDocPlugin = require('./plugins/jsDocPlugin');

const rootPath = path.join(__dirname, '..');

const srcPath = path.join(rootPath, 'src');
const buildPath = path.join(rootPath, 'dist');

const entry = path.join(srcPath, 'proxy-shim');

const config = {
    entry: {
        "proxy-shim": entry
    },
    devServer: {
        host: 'localhost',
        port: '8088',
        open: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            inject: 'head',
            template: path.join(srcPath, 'index.html')
        }),
        new CopyWebpackPlugin([
            {context: srcPath, from: `${path.join(srcPath, 'test/**/*')}`, ignore: ['*.js']}
        ])
    ]
};

module.exports = new Config().extend(path.join(__dirname, 'webpack.base.config.js')).merge(config);