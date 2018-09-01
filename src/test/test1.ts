import * as THREE from "three";

// class TWEEN {
//     public static Tween = Tween;
//     public static getAll = () => {
//
//         return Object.keys(TWEEN._tweens).map(function (tweenId) {
//             return this._tweens[tweenId];
//         });
//
//     }
//     public static removeAll = () => {
//         TWEEN._tweens = {};
//     }
//
//     public static add = (tween:TWEEN.Tween) => {
//         (TWEEN._tweens as any)[tween.getId()] = tween;
//         (TWEEN._tweensAddedDuringUpdate as any)[tween.getId()] = tween;
//     }
// }
//
// class Tween {
//
// }


namespace TWEEN {
    let _tweens:any = {};
    let _tweensAddedDuringUpdate:any = {};
    let _nextId = 0;

     // console.log("执行1次？");
    let nowFn:Function;

    if(typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined) {
        nowFn = window.performance.now.bind(window.performance);
    } else if(Date.now !== undefined) {
        nowFn = Date.now;
    } else {
        nowFn = function() {
            return new Date().getTime();
        }
    }

    export function now() {

        return nowFn();

    }

    export function getAll() {

        return Object.keys(_tweens).map(function (tweenId) {
            return _tweens[tweenId];
        });

    }
    export function removeAll() {

        _tweens = {};

    }
    export function add(tween: Tween) {

        _tweens[tween.getId()] = tween;
        _tweensAddedDuringUpdate[tween.getId()] = tween;

    }
    export function remove(tween: Tween) {

        delete _tweens[tween.getId()];
        delete _tweensAddedDuringUpdate[tween.getId()];

    }
    export function update(time:any, preserve:any) {

        var tweenIds = Object.keys(_tweens);

        if (tweenIds.length === 0) {
            return false;
        }

        time = time !== undefined ? time : TWEEN.now();

        // Tweens are updated in "batches". If you add a new tween during an update, then the
        // new tween will be updated in the next batch.
        // If you remove a tween during an update, it will normally still be updated. However,
        // if the removed tween was added during the current batch, then it will not be updated.
        while (tweenIds.length > 0) {
            _tweensAddedDuringUpdate = {};

            for (let i = 0; i < tweenIds.length; i++) {
                if (_tweens[tweenIds[i]].update(time) === false && !preserve) {
                    delete _tweens[tweenIds[i]];
                }
            }

            tweenIds = Object.keys(_tweensAddedDuringUpdate);
        }

        return true;

    }
    export function nextId() {

        return _nextId++;

    }

    export class Tween {

        public _object:any;
        public _valuesStart:any;
        public _valuesEnd:any;
        public _valuesStartRepeat:any;
        public _duration:number;
        public _repeat:number;
        public _repeatDelayTime:number;
        public _yoyo:boolean;
        public _isPlaying:boolean;
        public _reversed:boolean;
        public _delayTime:number;
        public _startTime:number;
        public _easingFunction:Function;
        public _interpolationFunction:Function;
        public _chainedTweens:any;
        public _onStartCallback:Function;
        public _onStartCallbackFired:boolean;
        public _onUpdateCallback:Function;
        public _onCompleteCallback:Function;
        public _onStopCallback:Function;
        public _id:number;

        constructor(object:any) {

            this._object = object;
            this._valuesStart = {};
            this._valuesEnd = {};
            this._valuesStartRepeat = {};
            this._duration = 1000;
            this._repeat = 0;
            this._repeatDelayTime = undefined;
            this._yoyo = false;
            this._isPlaying = false;
            this._reversed = false;
            this._delayTime = 0;
            this._startTime = null;
            this._easingFunction = TWEEN.Easing.Linear.None;
            this._interpolationFunction = TWEEN.Interpolation.Linear;
            this._chainedTweens = [];
            this._onStartCallback = null;
            this._onStartCallbackFired = false;
            this._onUpdateCallback = null;
            this._onCompleteCallback = null;
            this._onStopCallback = null;
            this._id = TWEEN.nextId();

        }

        public getId() {
            return this._id;
        }
        public to(properties:any, duration:number) {
            this._valuesEnd = properties;

            if (duration !== undefined) {
                this._duration = duration;
            }

            return this;
        }
        public start(time:number) {

            TWEEN.add(this);

            this._isPlaying = true;

            this._onStartCallbackFired = false;

            this._startTime = time !== undefined ? time : TWEEN.now();
            this._startTime += this._delayTime;

            for (var property in this._valuesEnd) {

                // Check if an Array was provided as property value
                if (this._valuesEnd[property] instanceof Array) {

                    if (this._valuesEnd[property].length === 0) {
                        continue;
                    }

                    // Create a local copy of the Array with the start value at the front
                    this._valuesEnd[property] = [this._object[property]].concat(this._valuesEnd[property]);

                }

                // If `to()` specifies a property that doesn't exist in the source object,
                // we should not set that property in the object
                if (this._object[property] === undefined) {
                    continue;
                }

                // Save the starting value.
                this._valuesStart[property] = this._object[property];

                if ((this._valuesStart[property] instanceof Array) === false) {
                    this._valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
                }

                this._valuesStartRepeat[property] = this._valuesStart[property] || 0;

            }

            return this;

        }
        public stop() {

            if (!this._isPlaying) {
                return this;
            }

            TWEEN.remove(this);
            this._isPlaying = false;

            if (this._onStopCallback !== null) {
                this._onStopCallback.call(this._object, this._object);
            }

            this.stopChainedTweens();
            return this;

        }
        public end() {

            this.update(this._startTime + this._duration);
            return this;

        }
        public stopChainedTweens() {

            for (var i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
                this._chainedTweens[i].stop();
            }

        }
        public delay(amount:number) {

            this._delayTime = amount;
            return this;

        }
        public repeat(times:number) {

            this._repeat = times;
            return this;

        }
        public repeatDelay(amount:number) {

            this._repeatDelayTime = amount;
            return this;

        }
        public yoyo(yoyo:boolean) {

            this._yoyo = yoyo;
            return this;

        }
        public easing(easing:Function) {

            this._easingFunction = easing;
            return this;

        }
        public interpolation(interpolation:Function) {

            this._interpolationFunction = interpolation;
            return this;

        }
        public chain() {

            this._chainedTweens = arguments;
            return this;

        }
        public onStart(callback:Function) {

            this._onStartCallback = callback;
            return this;

        }
        public onUpdate(callback:Function) {

            this._onUpdateCallback = callback;
            return this;

        }
        public onComplete(callback:Function) {

            this._onCompleteCallback = callback;
            return this;

        }
        public onStop(callback:Function) {

            this._onStopCallback = callback;
            return this;

        }
        public update(time:number) {

            var property;
            var elapsed;
            var value;

            if (time < this._startTime) {
                return true;
            }

            if (this._onStartCallbackFired === false) {

                if (this._onStartCallback !== null) {
                    this._onStartCallback.call(this._object, this._object);
                }

                this._onStartCallbackFired = true;
            }

            elapsed = (time - this._startTime) / this._duration;
            elapsed = elapsed > 1 ? 1 : elapsed;

            value = this._easingFunction(elapsed);

            for (property in this._valuesEnd) {

                // Don't update properties that do not exist in the source object
                if (this._valuesStart[property] === undefined) {
                    continue;
                }

                var start = this._valuesStart[property] || 0;
                var end = this._valuesEnd[property];

                if (end instanceof Array) {

                    this._object[property] = this._interpolationFunction(end, value);

                } else {

                    // Parses relative end values with start as base (e.g.: +10, -3)
                    if (typeof (end) === 'string') {

                        if (end.charAt(0) === '+' || end.charAt(0) === '-') {
                            end = start + parseFloat(end);
                        } else {
                            end = parseFloat(end);
                        }
                    }

                    // Protect against non numeric properties.
                    if (typeof (end) === 'number') {
                        this._object[property] = start + (end - start) * value;
                    }

                }

            }

            if (this._onUpdateCallback !== null) {
                this._onUpdateCallback.call(this._object, value);
            }

            if (elapsed === 1) {

                if (this._repeat > 0) {

                    if (isFinite(this._repeat)) {
                        this._repeat--;
                    }

                    // Reassign starting values, restart by making startTime = now
                    for (property in this._valuesStartRepeat) {

                        if (typeof (this._valuesEnd[property]) === 'string') {
                            this._valuesStartRepeat[property] = this._valuesStartRepeat[property] + parseFloat(this._valuesEnd[property]);
                        }

                        if (this._yoyo) {
                            var tmp = this._valuesStartRepeat[property];

                            this._valuesStartRepeat[property] = this._valuesEnd[property];
                            this._valuesEnd[property] = tmp;
                        }

                        this._valuesStart[property] = this._valuesStartRepeat[property];

                    }

                    if (this._yoyo) {
                        this._reversed = !this._reversed;
                    }

                    if (this._repeatDelayTime !== undefined) {
                        this._startTime = time + this._repeatDelayTime;
                    } else {
                        this._startTime = time + this._delayTime;
                    }

                    return true;

                } else {

                    if (this._onCompleteCallback !== null) {

                        this._onCompleteCallback.call(this._object, this._object);
                    }

                    for (var i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
                        // Make the chained tweens start exactly at the time they should,
                        // even if the `update()` method was called way past the duration of the tween
                        this._chainedTweens[i].start(this._startTime + this._duration);
                    }

                    return false;

                }

            }

            return true;

        }

    }



    export const Easing:any = {
        Linear: {

            None: function (k:number) {

                return k;

            }

        },

        Quadratic: {

            In: function (k:number) {

                return k * k;

            },

            Out: function (k:number) {

                return k * (2 - k);

            },

            InOut: function (k:number) {

                if ((k *= 2) < 1) {
                    return 0.5 * k * k;
                }

                return - 0.5 * (--k * (k - 2) - 1);

            }

        },

        Cubic: {

            In: function (k:number) {

                return k * k * k;

            },

            Out: function (k:number) {

                return --k * k * k + 1;

            },

            InOut: function (k:number) {

                if ((k *= 2) < 1) {
                    return 0.5 * k * k * k;
                }

                return 0.5 * ((k -= 2) * k * k + 2);

            }

        },

        Quartic: {

            In: function (k:number) {

                return k * k * k * k;

            },

            Out: function (k:number) {

                return 1 - (--k * k * k * k);

            },

            InOut: function (k:number) {

                if ((k *= 2) < 1) {
                    return 0.5 * k * k * k * k;
                }

                return - 0.5 * ((k -= 2) * k * k * k - 2);

            }

        },

        Quintic: {

            In: function (k:number) {

                return k * k * k * k * k;

            },

            Out: function (k:number) {

                return --k * k * k * k * k + 1;

            },

            InOut: function (k:number) {

                if ((k *= 2) < 1) {
                    return 0.5 * k * k * k * k * k;
                }

                return 0.5 * ((k -= 2) * k * k * k * k + 2);

            }

        },

        Sinusoidal: {

            In: function (k:number) {

                return 1 - Math.cos(k * Math.PI / 2);

            },

            Out: function (k:number) {

                return Math.sin(k * Math.PI / 2);

            },

            InOut: function (k:number) {

                return 0.5 * (1 - Math.cos(Math.PI * k));

            }

        },

        Exponential: {

            In: function (k:number) {

                return k === 0 ? 0 : Math.pow(1024, k - 1);

            },

            Out: function (k:number) {

                return k === 1 ? 1 : 1 - Math.pow(2, - 10 * k);

            },

            InOut: function (k:number) {

                if (k === 0) {
                    return 0;
                }

                if (k === 1) {
                    return 1;
                }

                if ((k *= 2) < 1) {
                    return 0.5 * Math.pow(1024, k - 1);
                }

                return 0.5 * (- Math.pow(2, - 10 * (k - 1)) + 2);

            }

        },

        Circular: {

            In: function (k:number) {

                return 1 - Math.sqrt(1 - k * k);

            },

            Out: function (k:number) {

                return Math.sqrt(1 - (--k * k));

            },

            InOut: function (k:number) {

                if ((k *= 2) < 1) {
                    return - 0.5 * (Math.sqrt(1 - k * k) - 1);
                }

                return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);

            }

        },

        Elastic: {

            In: function (k:number) {

                if (k === 0) {
                    return 0;
                }

                if (k === 1) {
                    return 1;
                }

                return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);

            },

            Out: function (k:number) {

                if (k === 0) {
                    return 0;
                }

                if (k === 1) {
                    return 1;
                }

                return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;

            },

            InOut: function (k:number) {

                if (k === 0) {
                    return 0;
                }

                if (k === 1) {
                    return 1;
                }

                k *= 2;

                if (k < 1) {
                    return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
                }

                return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;

            }

        },

        Back: {

            In: function (k:number) {

                var s = 1.70158;

                return k * k * ((s + 1) * k - s);

            },

            Out: function (k:number) {

                var s = 1.70158;

                return --k * k * ((s + 1) * k + s) + 1;

            },

            InOut: function (k:number) {

                var s = 1.70158 * 1.525;

                if ((k *= 2) < 1) {
                    return 0.5 * (k * k * ((s + 1) * k - s));
                }

                return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);

            }

        },

        Bounce: {

            In: function (k:number) {

                return 1 - TWEEN.Easing.Bounce.Out(1 - k);

            },

            Out: function (k:number) {

                if (k < (1 / 2.75)) {
                    return 7.5625 * k * k;
                } else if (k < (2 / 2.75)) {
                    return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
                } else if (k < (2.5 / 2.75)) {
                    return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
                } else {
                    return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
                }

            },

            InOut: function (k:number) {

                if (k < 0.5) {
                    return TWEEN.Easing.Bounce.In(k * 2) * 0.5;
                }

                return TWEEN.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;

            }

        }
    }

    export const Interpolation:any = {
        Linear: function (v:Array<any>, k:number) {

            var m = v.length - 1;
            var f = m * k;
            var i = Math.floor(f);
            var fn = TWEEN.Interpolation.Utils.Linear;

            if (k < 0) {
                return fn(v[0], v[1], f);
            }

            if (k > 1) {
                return fn(v[m], v[m - 1], m - f);
            }

            return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);

        },

        Bezier: function (v:Array<any>, k:number) {

            var b = 0;
            var n = v.length - 1;
            var pw = Math.pow;
            var bn = TWEEN.Interpolation.Utils.Bernstein;

            for (var i = 0; i <= n; i++) {
                b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
            }

            return b;

        },

        CatmullRom: function (v:Array<any>, k:number) {

            var m = v.length - 1;
            var f = m * k;
            var i = Math.floor(f);
            var fn = TWEEN.Interpolation.Utils.CatmullRom;

            if (v[0] === v[m]) {

                if (k < 0) {
                    i = Math.floor(f = m * (1 + k));
                }

                return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);

            } else {

                if (k < 0) {
                    return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
                }

                if (k > 1) {
                    return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
                }

                return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);

            }

        },

        Utils: {

            Linear: function (p0:any, p1:any, t:any) {

                return (p1 - p0) * t + p0;

            },

            Bernstein: function (n:any, i:any) {

                var fc = TWEEN.Interpolation.Utils.Factorial;

                return fc(n) / fc(i) / fc(n - i);

            },

            Factorial: (function () {

                var a = [1];

                return function (n:any) {

                    var s = 1;

                    if (a[n]) {
                        return a[n];
                    }

                    for (var i = n; i > 1; i--) {
                        s *= i;
                    }

                    a[n] = s;
                    return s;

                };

            })(),

            CatmullRom: function (p0:any, p1:any, p2:any, p3:any, t:any) {

                var v0 = (p2 - p0) * 0.5;
                var v1 = (p3 - p1) * 0.5;
                var t2 = t * t;
                var t3 = t * t2;

                return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (- 3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;

            }

        }
    }
}

function testFn1() {
    /**
     * test
     */

    console.log(TWEEN);
    console.log(TWEEN.Tween);

    let t1 = new TWEEN.Tween({});
    console.log(t1);
    console.log(TWEEN.now());


    enum Color {Red, Green, Blue}

    let colorName: string = Color[2];
    console.log(colorName);

    let obj: any = {};
    obj.name = "x";

    let arr: Array<any> = [1, 2, 3, "4", obj];

    let str: any = "123";
    let length: number = str.length;

    let [first, ...rest] = [1, 2, 3, 4];
    console.log(first, rest);

    let o = {
        a: "foo",
        b: 23,
        c: "bar"
    };
    let {a, ...b} = o;
    console.log(a, b);

    interface label {
        name: string;
        [propName: string] : any
    }
    function printName(labelobj: label) {
        console.log(labelobj.name);
    }
    var labelValue = {
        name: "111111",
        color: "red"
    }
    printName({
        name: "111111",
        color: "red"
    });


    // 随机生成uuid的算法
    var lut = [];
    for ( var i = 0; i < 256; i ++ ) {
        lut[ i ] = ( i < 16 ? '0' : '' ) + ( i ).toString( 16 );
    }
    // console.log(lut);

    console.log(THREE.Math.randFloat(12.5, 16));
    console.log(THREE.Math.floorPowerOfTwo(10));

    let v1 = new THREE.Vector2(2, 3);
    let v2 = new THREE.Vector2(2, 0);
    console.log(v2.width, v2.height);

    v1.rotateAround(v2, Math.PI);
    console.log(v1);

}

export {testFn1};