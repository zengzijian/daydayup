require('./style.css');
const React = require('react');
const ReactDOM = require('react-dom');
const webglMain = require('./webglMain');
const UI = require('./ui');

var rootDiv = document.createElement('div');
rootDiv.id = 'root';
document.body.appendChild(rootDiv);

ReactDOM.render(
    <UI />,
    rootDiv,
    () => {
        webglMain();
    }
);

// var start = () => {
//     var p = new Promise((resolve, rejected) => {
//         setTimeout(resolve(1111), 10000);
//     }).then((value)=>{
//         console.log(value);
//     });  
// }

// var start = new Promise((resolve, rejected) => {
//     setTimeout(resolve(1111), 10000);
// }).then((value)=>{
//     console.log(value);
// });

// async function test() {
//     console.log("before");
//     // await start;
//     var a = await new Promise((resolve, rejected) => {
//         setTimeout(()=>{
//             resolve(1111);
//         }, 5000);
//     });
//     console.log(a);
//     console.log("after");
// }
// test();