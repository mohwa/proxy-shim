/**
 * Created by UI/UX Team on 2018. 3. 10..
 */

const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const rootPath = path.join(__dirname, '../..');

/**
 *
 */
class JSDocPlugin{

    constructor({
        configFilePath = ''
    } = {}){

        const defaultConfigFilePath = path.join(rootPath, 'jsdoc.conf.json');

        this.configFilePath = !_.isEmpty(configFilePath) ? configFilePath : defaultConfigFilePath;
    }
    apply(compiler){

        let self = this;

        const configFilePath = this.configFilePath;

        if (!fs.existsSync(configFilePath)){
            console.log('Not Found configFilePath');
            return;
        }

        compiler.plugin('done', () => {

            const jsDoc = path.join(rootPath, `node_modules/.bin/jsdoc`);

            if (fs.existsSync(jsDoc)) exec(`${jsDoc} -c ${self.configFilePath}`);
        });
    }
}

module.exports = JSDocPlugin;