/**
 * Created by sgjeon on 16. 4. 5..
 */

const path = require('path');
const _ = require('lodash');

const {Config, environment} = require('webpack-config');

const rootPath = path.join(__dirname, '..');
const srcPath = path.join(rootPath, 'src');

module.exports = env => {

    environment.setAll();

    return new Config().extend(path.join(__dirname, 'webpack.' + env + '.config.js'));
};