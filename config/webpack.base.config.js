/**
 * Created by mohwa on 2018. 2. 14..
 */

const path = require('path');

const webpack = require('webpack');

const {Config, environment} = require('webpack-config');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const rootPath = path.join(__dirname, '..');

const buildPath = path.join(rootPath, 'dist');
const srcPath = path.join(rootPath, 'src');
const testPath = path.join(rootPath, 'test');

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// config
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
const config = {
    // 설정된 context 으로, watch 영역이 할당된다.
    context: path.join(__dirname, '..'),
    output: {
        filename: '[name].js',
        libraryTarget: 'umd',
        path: buildPath,
        library: 'ProxyShim'
    },
    module: {
        rules: [
        {
            test: /\.js$/,
            include: [srcPath, testPath],
            use: {
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    presets: ['es2015'],
                    plugins: ['transform-runtime']
                }
            }
        }]
    },
    cache: true,
    resolve: {
        modules: ['node_modules'],
        /*
         모듈명 뒤에 여기 명시된 확장자명들을 붙여보며 탐색을 수행한다. 즉 아래처럼 extensions: ['.js', '.css']
         으로 설정되어 있으면 require('abc')를 resolve 하기 위해 abc, abc.js, abc.css 로 탐색한다.
         */
        extensions: ['.js']
    },
    plugins: [
        new CleanWebpackPlugin(buildPath, {root: rootPath, verbose: true, watch: false})
    ]
};


module.exports = new Config().merge(config);
