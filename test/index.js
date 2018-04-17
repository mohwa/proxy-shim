/**
 * Created by mohwa on 2018. 2. 14..
 */


const ProxyShim = require('proxy-shim');

// getter 예제
var p = new ProxyShim({a: 1}, {
  get: function(target, prop, receiver) {
    console.log('called: ' + prop);
    return 10;
  }
});

console.log(p.a); // "called: a" // 10


// setter 예제
var p = new ProxyShim({a: 1}, {
  set: function(target, prop, value, receiver) {
    target[prop] = value
    console.log('property set: ' + prop + ' = ' + value)
    return true
  }
})

console.log('a' in p)  // false

p.a = 10               // "property set: a = 10"
console.log('a' in p)  // true
console.log(p.a)       // 10


// construct 예제
var p = new ProxyShim(function() {}, {
  construct: function(target, argumentsList, newTarget) {
    console.log('called: ' + argumentsList.join(', '));
    return { value: argumentsList[0] * 10 };
  }
});

console.log(new p(1).value); // "called: 1"  10


// apply 예제
var p = new ProxyShim(function() {}, {
  apply: function(target, thisArg, argumentsList) {
    console.log('called: ' + argumentsList.join(', '));
    return argumentsList[0] + argumentsList[1] + argumentsList[2];
  }
});

console.log(p(1, 2, 3)); // "called: 1, 2, 3" 6


// revocable 예제
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