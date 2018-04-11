# [proxy-shim](https://github.com/mohwa/proxy-shim)

**proxy-shim**은 [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)를 지원하지않는 구브라우저에서 사용할 수 있는 폴리필 라이브러리입니다.

> 또한, [proxy-polyfill](https://github.com/GoogleChrome/proxy-polyfill) 라이브러리에 영감받아 스터디삼아 만든 라이브러리이기도합니다.

## 지원 가능한 proxy `trap`

- `get`, `set`, `construct`, `apply`