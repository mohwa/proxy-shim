
/**
 * ProxyShim 생성자 함수
 */

function ProxyShim(target = {}, handler = {}){

    if (!target) throw new Error('Not found target argument');
    if (!handler || handler.constructor !== Object) throw new Error('Not found handler argument');

    // new 연산자 사용 여부
    const isNewOperator = _isNewOperator(this, ProxyShim);

    // new 연산자를 사용하지 않았을 경우
    if (!isNewOperator){
        throw new Error(`Class constructor ProxyShim cannot be invoked without 'new'`);
    }

    // 내부에서 사용하는 키 이름
    const internalKeyName = _getInternalKeyName();

    // proxy 객체
    let proxy = this;

    const {get: _get, set: _set, apply: _apply, construct: _construct} = handler;

    // 전달받은 target 타입이 함수 타입인지 여부
    let isFunction = false;

    // target 이 함수일 경우
    if (typeof target === 'function'){

        proxy = function(...args){

            // 반환된 함수의 new 연산자 사용 여부
            const isNewOperator = _isNewOperator(this, target);

            if (isNewOperator && _construct){

                _checkRevoke(proxy, 'construct');

                const ret = _construct.call(handler, target, args, proxy);

                if (!isObject(ret)){
                    throw new Error(`'construct' on proxy: trap returned non-object ('${ret}')`);
                }

                return ret;
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

        // 함수 constructor, prototype 객체를 초기화한다.
        proxy.constructor = target.constructor;
        proxy.prototype = target.prototype;

        isFunction = true;

    }

    // getter / setter 함수 생성
    let getter = _get ? function(k){

        return _get.apply(this, [target, k, proxy]);

    } : function(k, v){

        let currentValue = this[k];

        if (!proxy[internalKeyName][_replaceExternalKeyName(k)].__isChanged__){
            currentValue = currentValue || v;
        }

        return currentValue;
    };

    let setter = _set ? function(k, v){
        return _set.apply(this, [target, k, v, proxy]);

    } : function(k, v){

        this[k] = v;

        return true;
    };

    const properties = Object.getOwnPropertyNames(target);

    target[internalKeyName] = {};
    proxy[internalKeyName] = {};

    properties.forEach((k = '') => {

        // 기존 proxy 내부 프로퍼티들은 재정의 할 수 없다(target 이 function, array 타입일 경우)
        if (isFunction && k in proxy) return;

        const {configurable, enumerable} = Object.getOwnPropertyDescriptor(target, k);

        const internalAccessorKeyName = _replaceInternalAccessorKeyName(k);

        // 초기 속성값 변경 여부(초기 속성값을 반환해야하는지 결정한다)
        target[internalKeyName][k] = {__isChanged__: false};
        proxy[internalKeyName][k] = {__isChanged__: false};

        // 바인딩될 key
        const getKey = _get ? k : internalAccessorKeyName;
        const setKey = _set ? k : internalAccessorKeyName;

        // 바인딩될 this 객체
        const getThis = _get ? handler : proxy;
        const setThis = _set ? handler : proxy;

        const v = target[k];

        const targetDesc = {
            configurable: configurable,
            enumerable: enumerable,
            get: () => {

                let currentValue = proxy[internalAccessorKeyName];

                if (!target[internalKeyName][k].__isChanged__){
                    currentValue = currentValue || v;
                }

                // 결국 target 속성값과, proxy 속성값은 동일하다.
                return currentValue;
            },
            set: (v) => {

                target[internalKeyName][k].__isChanged__ = true;

                // target 속성값이 할당되면, proxy 객체 속성값을 변경시킨다.
                proxy[internalAccessorKeyName] = v;

                return true;
            }
        };

        const proxyDesc = {
            configurable: configurable,
            enumerable: enumerable,
            get: () => {

                _checkRevoke(proxy, 'get');

                return getter.apply(getThis, [getKey, v, proxy]);
            },
            set: (v) => {

                _checkRevoke(proxy, 'set');

                proxy[internalKeyName][k].__isChanged__ = true;

                return setter.apply(setThis, [setKey, v, proxy]);
            }
        };


        Object.defineProperty(target, k, targetDesc);
        Object.defineProperty(proxy, k, proxyDesc);
    });

    proxy.IsRevoked = false;

    // target 객체를 프리징시킨다.
    Object.seal(target);

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
 * 접근자(get/set)를 위한, key 이름을 반환한다.
 *
 * @param k
 * @returns {*}
 * @private
 */
function _replaceInternalAccessorKeyName(k = ''){
    return `__${k}__`;
}

/**
 * 외부, key 이름을 반환한다.
 *
 * @param k
 * @returns {string}
 * @private
 */
function _replaceExternalKeyName(k = ''){
    return k.replace(/\_/g, '');
}

/**
 * 내부에서만 사용되는 key 이름을 반환한다.
 *
 * @returns {string}
 * @private
 */
function _getInternalKeyName(){
    return '_';
}

/**
 *
 * new 연산자 사용 여부를 반환한다.
 *
 * @param _this
 * @param constructor
 * @returns {*|boolean}
 * @private
 */
function _isNewOperator(_this = null, constructor = null){

    return _this &&  _this.constructor === constructor;
}

/**
 *
 * revoke 상태를위한, 예외처리
 *
 * @param proxy
 * @param trap
 * @private
 */
function _checkRevoke(proxy = null, trap = ''){
    if (proxy && proxy.IsRevoked) throw new Error(`Cannot perform '${trap}' on a proxy that has been revoked`);
}

/**
 * object 타입 유/무를 반환한다.
 *
 * @param v
 * @returns {boolean}
 */
function isObject(v){
    return typeof v === 'object';
}

module.exports = ProxyShim;


