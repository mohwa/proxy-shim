/**
 * Created by mohwa on 2018. 2. 14..
 */


const ProxyShim = require('proxy-shim');

function monster1(disposition) {
  this.disposition = disposition;
}

const handler1 = {
  construct(target, args) {

    console.log('monster1 constructor called'); // expected output: "monster1 constructor called"
    return new target(...args);
  }
};

const proxy1 = new ProxyShim(monster1, handler1);

console.log(new proxy1('fierce').disposition); // expected output: "fierce"
