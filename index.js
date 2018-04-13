/**
 * Created by mohwa on 2018. 2. 14..
 */

let ProxyPolyFill = null;

try{ ProxyPolyFill = require('./dist/proxy-shim'); }
catch(e){ ProxyPolyFill = require('./src/proxy-shim'); }

module.exports = ProxyPolyFill;
  
