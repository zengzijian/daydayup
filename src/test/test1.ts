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
}

export {testFn1};