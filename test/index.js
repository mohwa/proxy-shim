/**
 * Created by mohwa on 2018. 2. 14..
 */


const ProxyShim = require('proxy-shim');

var revocable = ProxyShim.revocable({foo: function(){}}, {
  get: function(target, name) {
    return "[[" + name + "]]";
  }
});

var proxy = revocable.proxy;

console.log(proxy.foo); // "[[foo]]"

revocable.revoke();

console.log(proxy.foo); // TypeError is thrown
proxy.foo = 1;           // TypeError again

  
