/**
 * Created by mohwa on 2018. 2. 14..
 */

let ProxyShim = null;

try{ ProxyShim = require('./dist/proxy-shim'); }
catch(e){ ProxyShim = require('./src/proxy-shim'); }

module.exports = ProxyShim;
  
