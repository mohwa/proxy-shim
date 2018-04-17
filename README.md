# [proxy-shim](https://github.com/mohwa/proxy-shim)

`proxy-shim`은 [ES6 Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 기능을 지원하지않는, 브라우저에서 사용할 수 있는 폴리필입니다.

> 이 라이브러리는 [proxy-polyfill](https://github.com/GoogleChrome/proxy-polyfill) 폴리필에 영감받아 만들었습니다.

## 지원 브라우저

대부분의 [ES5 Spec](http://kangax.github.io/compat-table/es5/)이 구현된 모든 브라우저(`IE9+`, `Safari 6+` 등)

## 지원 가능한 [Proxy trap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

`get`, `set`, `construct`, `apply`

> 또한, 생성된 Proxy 객체를 소멸 시킬 수 있는 [revocable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/revocable) 메서드를 제공한다.

## 참고 사항

- 이 폴리필은 네이티브 객체와 최대한 유사한 형태로 개발되었습니다.(예외처리 등)

- 네이티브와 달리, 초기화된 속성에 대해서만 `trap` 을 사용하실 수 있습니다.

## 설치하기

```
npm i proxy-shim
```

## 가져오기

CommonJS 모듈 로더 방식으로 가져오기

```
const ProxyShim = require('proxy-shim');
```


\<script\> 엘리먼트로 가져오기

```html
<script src="path/to/proxy-shim.min.js"></script>
```

## 사용 예제

> 아래 예제는 MDN에서 제공중인 데모를 수정하여 만들었습니다.

`get` trap 예제
```
const ProxyShim = require('proxy-shim');

var p = new ProxyShim({a: 1}, {
  get: function(target, prop, receiver) {
    console.log('called: ' + prop);
    return 10;
  }
});

console.log(p.a); // "called: a" // 10
```

`set` trap 예제
```
const ProxyShim = require('proxy-shim');

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
```

`construct` trap 예제
```
const ProxyShim = require('proxy-shim');

var p = new ProxyShim(function() {}, {
  construct: function(target, argumentsList, newTarget) {
    console.log('called: ' + argumentsList.join(', '));
    return { value: argumentsList[0] * 10 };
  }
});

console.log(new p(1).value); // "called: 1"  10
```

`apply` trap 예제
```
const ProxyShim = require('proxy-shim');

var p = new ProxyShim(function() {}, {
  apply: function(target, thisArg, argumentsList) {
    console.log('called: ' + argumentsList.join(', '));
    return argumentsList[0] + argumentsList[1] + argumentsList[2];
  }
});

console.log(p(1, 2, 3)); // "called: 1, 2, 3" 6
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

