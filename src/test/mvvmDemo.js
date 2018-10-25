// MVVM框架思路整理
// reference link: https://blog.csdn.net/w178191520/article/details/79133965

// Object.keys()方法会返回一个由一个给定对象的自身【可枚举】属性组成的数组，数组中属性名
// 的排列顺序和使用for...in循环遍历该对象时返回的顺序一致

// getFoo is a property which isn't enumerable
var myObj = Object.create({}, {
    getFoo: {
        value: function () {
            return this.foo;
        }
    }
});
myObj.foo = 1;
console.log(Object.keys(myObj)); // console: ['foo']
// 如果你想获取一个对象的所有属性，甚至包括不可枚举的，请查看Object.getOwnPropertyNames()

// 调用方式
const vm = new Mvvm({
    el: "#app",
    data: {
        title: "mvvm title",
        name: "mvvm name"
    }
});

// 让vm通过vm.title访问到title属性，而不是vm.data.title，需要对Mvvm的prototype进行处理
function Mvvm(options) {
    this.data = options.data;
    const self = this;
    Object.keys(this.data).forEach(key =>
        self.proxyKeys(key)
    )
}

// 代理方法
Mvvm.prototype.proxyKeys = function (key) {
    const self = this;
    Object.defineProperty(this, key, {
        // get和set实现vm.data.title和vm.title的值同步
        get: function () {
            return self.data[key];
        },
        set: function (newVal) {
            self.data[key] = newVal;
        }
    })
}

// 主流程
function Mvvm(options) {
    this.data = options.data;
    //  ...
    observe(this.data);
    // new Compile(options.el, this); // model改变时，调用compile中的回调更新视图
}

// observer实现
let data = {
    number: 0
};
observe(data);
data.number = 1;

function observe(data) {
    if (!data || typeof data !== "object") {
        return;
    }

    const self = this;
    Object.keys(data).forEach(key =>
        defineReactive(data, key, data[key])
    )
}

function defineReactive(data, key, value) {
    var dep = new Dep();
    Object.defineProperty(data, key, {
        get: function () {
            if (Dep.target) {
                dep.addSub(Dep.target); // Dep.target指向watcher的实例
            }
            return value;
        },
        set: function (newValue) {
            if (value !== newValue) {
                console.log("值发生了变化");
                value = newValue;
                dep.notify();
            }
        }
    });
}

// Dep（订阅者数组）和watcher（订阅者）
function Dep() {
    this.subs = [];
}

Dep.prototype.addSub = function (sub) {
    this.subs.push(sub);
}
Dep.prototype.notify = function () {
    this.subs.forEach(function (sub) { // sup为Watcher的实例
        sub.update();
    })
}

/**
 * Wathcer的作用，充当了observer和compile的桥梁
 * 1.在自身实例化的过程中，往订阅器dep中添加自己；
 * 2.当model发生变动，dep.notify()通知时，其能调用自身的update函数，并触发compile绑定的回调函数实现视图更新；
 */
function Watcher(vm, exp, cb) {
    this.vm = vm;
    this.exp = exp;
    this.cb = cb;
    this.value = this.get();
}

Watcher.prototype.update = function () {
    this.run();
}
Watcher.prototype.run = function () {
    // ...
    if (value !== oldVal) {
        this.cb.call(this.vm, value); // 触发compile的回调
    }
}
Watcher.prototype.get = function () {
    Dep.target = this;
    const value = this.vm.data[this.exp]; // 强制执行监听器里的get函数
    Dep.target = null; // 缓存了自己以后立即释放
    return value;
}

// compile（编译）
// let fragment = document.createDocumentFragment(); // 创建一个新的空白的文档片段
// fragment是一个指向空DocumentFragment对象的引用
// DocumentFragments 是DOM节点。它们不是主DOM树的一部分。
// 通常的用例是创建文档片段，将元素附加到文档片段，然后将文档片段附加到DOM树。
// 在DOM树中，文档片段被其所有的子元素所代替。
// 因为文档片段存在于内存中，并不在DOM树中，所以将子元素插入到文档片段时不会引起页面回流（对元素位置和几何上的计算）。
// 因此，使用文档片段通常会带来更好的性能。
function Compile(el, vm) {
    this.vm = vm;
    this.el = document.querySelector(el);
    this.fragment = null;
    this.init();
}

Compile.prototype.init = function () {
    if (this.el) {
        this.fragment = this.nodeToFragment(this.el); // 将节点转为dragment文档碎片
        this.compileElement(this.fragment); // 对fragment进行编译
        this.el.appendChild(this.fragment);
    }
}
Compile.prototype.nodeToFragment = function (el) {
    const fragment = document.createDocumentFragment();
    let child = el.firstChild;
    while (child) {
        fragment.appendChild(child);
        child = el.firstChild;
    }
    return fragment;
}
Compile.prototype.compileElement = function () {
}
Compile.prototype.compileText = function (node, exp) { // 对文本类型进行处理
    const self = this;
    const initText = this.vm[exp];
    this.updateText(node, initText); // 初始化？
    new Watcher(this.vm, exp, function (value) {
        self.updateText(node, value);
    })
}
Compile.prototype.compileEvent = function (node, vm, exp, dir) { // 对事件指令进行处理
    const eventType = dir.split(":")[1];
    const cb = vm.method && vm.method[exp];
    if(eventType && cb) {
        node.addEventListener(eventType, cb.bind(vm), false)
    }
}
Compile.prototype.compileModel = function (node, vm, exp) { // 对v-model进行处理
    let val = vm[exp];
    const self = this;
    this.modelUpdate(node, val);
    node.addEventListener("input", function(e) {
        const newVal = e.target.value;
        self.vm[exp] = newVal; // 实现view到model的绑定
    })
}





