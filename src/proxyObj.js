function proxyObj(obj, fn) {
    var queue = new Set();
    var proxyObj = new Proxy(obj, {set});

    //第二个参数规定为一个方法或者为有方法组成的数组
    if(Array.isArray(fn)) {
        let length = fn.length;
        for(let i = 0; i < length; i++) {
            queue.add(fn[i].bind(this, proxyObj));
        }
    } else {
        queue.add(fn.bind(this, proxyObj));
    }

    function set(target, key, value, receiver) {
        var result = Reflect.set(target, key, value, receiver);
        queue.forEach( o => o());
        return result;
    }

    return proxyObj;
}

module.exports = proxyObj;