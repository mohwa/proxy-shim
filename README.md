# [proxy-shim](https://github.com/mohwa/proxy-shim)

`proxy-shim`은 [ES6 Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 기능을 지원하지않는, 브라우저에서 사용할 수 있는 폴리필입니다.

> 이 패키지는 [proxy-polyfill](https://github.com/GoogleChrome/proxy-polyfill) 라이브러리에 영감받아 만들었습니다.

## 지원 브라우저

대부분의 [ES5 Spec](http://kangax.github.io/compat-table/es5/)이 구현된 모든 브라우저(`IE9+`, `Safari 6+` 등)

## 지원 가능한 Proxy trap

`get`, `set`, `construct`, `apply`

> 또한, 생성된 Proxy 객체를 소멸 시킬 수 있는 `revocable` 메서드를 제공한다.

## 설치하기

```
npm i proxy-shim
```

## 예제

> 아래 예제는 MDN에서 제공중인 [handler.get()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/get) 데모 소스입니다.

```

const ProxyShim = require('proxy-shim');

const monster1 = {
  secret: 'easily scared',
  eyeCount: 4
};

const handler1 = {
  get: function(target, prop, receiver) {
    if (prop === 'secret') {
      return `${target.secret.substr(0, 4)} ... shhhh!`;
    } else {
      return Reflect.get(...arguments);
    }
  }
};

const proxy1 = new ProxyShim(monster1, handler1);

console.log(proxy1.eyeCount); // expected output: 4

console.log(proxy1.secret); // expected output: "easi ... shhhh!"

```

`revocable` 메서드 예제

```
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
```

