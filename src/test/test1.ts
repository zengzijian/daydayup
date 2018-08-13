import * as THREE from "three";

function testFn1() {
    /**
     * test
     */
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