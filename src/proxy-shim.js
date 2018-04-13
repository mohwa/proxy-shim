
/**
 * ProxyShim 생성자 함수
 */

function ProxyShim(target = {}, handler = {}){

    if (!target) throw new Error('Not found target argument');
    if (!handler || handler.constructor !== Object) throw new Error('Not found handler argument');

    // new 연산자 사용 여부
    const isNewOperator = this && this.constructor === ProxyShim ? true : false;

    // new 연산자를 사용하지 않았을 경우
    if (!isNewOperator) throw new Error(`Class constructor ProxyShim cannot be invoked without 'new'`);

    let proxy = this;

    const {get: _get, set: _set, apply: _apply, construct: _construct} = handler;

    let isFunction = false;


    // target 이 함수일 경우
    if (typeof target === 'function'){

        proxy = function _(...args){

            // 반환된 함수의 new 연산자 사용 여부
            let isNewOperator = false;

            if (this && this.constructor === proxy) isNewOperator = true;

            if (isNewOperator && _construct){

                _checkRevoke(proxy, 'construct');

                return _construct.call(handler, target, args);
            }
            else if (!isNewOperator && _apply){

                _checkRevoke(proxy, 'apply');

                return _apply.call(handler, target, this, args);
            }

            if (isNewOperator){
                return new (target.bind.apply(target, [target].concat(args)));
            }

            return target.apply(this, args);
        };

        isFunction = true;

    }

    // getter / setter 함수 생성
    let getter = _get ? function(k){

        return _get.apply(this, [target, k, proxy]);

    } : function(k){
        return this[k];
    };

    let setter = _set ? function(k, v){

        return _set.apply(this, [target, k, v]);

    } : function(k, v){
        this[k] = v;
    };

    const properties = Object.getOwnPropertyNames(target);

    properties.forEach((k = '') => {

        // 기존 proxy 내부 프로퍼티들은 재정의 할 수 없다(target 이 function, array 타입일 경우)
        if (isFunction && k in proxy) return;

        const _k = _replaceKeyName(k);

        // 바인딩될 key
        const getKey = _get ? k : _k;
        const setKey = _set ? k : _k;

        // 바인딩될 this
        const getThis = _get ? handler : proxy;
        const setThis = _set ? handler : proxy;

        const v = target[k];

        const disc = {
            get: () => {

                _checkRevoke(proxy, 'get');

                return getter.apply(getThis, [getKey]);
            },
            set: (v) => {

                _checkRevoke(proxy, 'set');

                return setter.apply(setThis, [setKey, v]);
            }
        };

        Object.defineProperty(proxy, k, disc);

        proxy[k] = v;
    });

    proxy.IsRevoked = false;

    // target, proxy 객체 속성을 추가할 수 없도록 프리징시킨다.
    Object.seal(target);
    Object.seal(proxy);

    return proxy;
}

/**
 * 생성된 proxy 를 소멸시킬 수 있는 static 메서드
 *
 * @param target
 * @param handler
 * @returns {{}}
 */
ProxyShim.revocable = function(target = {}, handler = {}){

    let proxy = new ProxyShim(target, handler);

    const revoke = () => {
        proxy.IsRevoked = true;
    };

    return {
        proxy,
        revoke
    };
};

/**
 *
 * get/set 접근자를 위한, key 반환
 *
 * @param k
 * @returns {*}
 * @private
 */
function _replaceKeyName(k = ''){
    return `__${k}__`;
}

/**
 * revoke 상태를위한, 예외처리
 *
 * @param proxy
 * @param trap
 * @private
 */
function _checkRevoke(proxy = null, trap = ''){
    if (proxy && proxy.IsRevoked) throw new Error(`Cannot perform '${trap}' on a proxy that has been revoked`);
}

module.exports = ProxyShim;


